import type {
  CreateOrderInput,
  OrderRecord,
  OrderRepository,
} from "../interfaces/order.repository.js";

export class OrderPgRepository implements OrderRepository {
  constructor(private db: any) {}

  private async mapOrderRow(client: any, orderRow: any): Promise<OrderRecord> {
    const itemsResult = await client.query(
      `
      SELECT
        product_id AS "productId",
        quantity,
        unit_price AS "unitPrice"
      FROM order_items
      WHERE order_id = $1
      ORDER BY id ASC
      `,
      [orderRow.id],
    );

    return {
      id: orderRow.id,
      clientId: orderRow.client_id,
      addressId: orderRow.address_id,
      status: orderRow.status,
      total: Number(orderRow.total),
      createdAt: new Date(orderRow.created_at).toISOString(),
      items: itemsResult.rows.map((item: any) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    };
  }

  async createOrder(input: CreateOrderInput): Promise<OrderRecord> {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      const clientResult = await client.query(
        `SELECT id FROM clients WHERE id = $1`,
        [input.clientId],
      );

      if (clientResult.rows.length === 0) {
        throw new Error("Client not found");
      }

      const addressResult = await client.query(
        `SELECT id FROM addresses WHERE id = $1`,
        [input.addressId],
      );

      if (addressResult.rows.length === 0) {
        throw new Error("Address not found");
      }

      let total = 0;
      const normalizedItems: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
      }> = [];

      for (const item of input.items) {
        const productResult = await client.query(
          `SELECT id, price, stock FROM products WHERE id = $1 FOR UPDATE`,
          [item.productId],
        );

        if (productResult.rows.length === 0) {
          throw new Error("Product not found");
        }

        const product = productResult.rows[0];
        const unitPrice = Number(product.price);
        const currentStock = Number(product.stock);

        if (currentStock < item.quantity) {
          throw new Error("Insufficient product stock");
        }

        await client.query(
          `UPDATE products SET stock = stock - $1 WHERE id = $2`,
          [item.quantity, item.productId],
        );

        total += unitPrice * item.quantity;
        normalizedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
        });
      }

      const status = input.status ?? "pending";
      const orderResult = await client.query(
        `
        INSERT INTO orders (client_id, address_id, status, total)
        VALUES ($1, $2, $3, $4)
        RETURNING id, client_id, address_id, status, total, created_at
        `,
        [input.clientId, input.addressId, status, total],
      );

      const orderRow = orderResult.rows[0];

      for (const item of normalizedItems) {
        await client.query(
          `
          INSERT INTO order_items (order_id, product_id, quantity, unit_price)
          VALUES ($1, $2, $3, $4)
          `,
          [orderRow.id, item.productId, item.quantity, item.unitPrice],
        );
      }

      await client.query("COMMIT");

      return this.mapOrderRow(client, orderRow);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getAllOrders({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<OrderRecord[]> {
    const offset = page * size;
    const result = await this.db.query(
      `
      SELECT id, client_id, address_id, status, total, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [size, offset],
    );

    const orders: OrderRecord[] = [];
    for (const row of result.rows) {
      const itemsResult = await this.db.query(
        `
        SELECT
          product_id AS "productId",
          quantity,
          unit_price AS "unitPrice"
        FROM order_items
        WHERE order_id = $1
        ORDER BY id ASC
        `,
        [row.id],
      );

      orders.push({
        id: row.id,
        clientId: row.client_id,
        addressId: row.address_id,
        status: row.status,
        total: Number(row.total),
        createdAt: new Date(row.created_at).toISOString(),
        items: itemsResult.rows.map((item: any) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      });
    }

    return orders;
  }

  async getOrderById(id: string): Promise<OrderRecord | null> {
    const result = await this.db.query(
      `
      SELECT id, client_id, address_id, status, total, created_at
      FROM orders
      WHERE id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) return null;

    return this.mapOrderRow(this.db, result.rows[0]);
  }

  async updateOrderStatus(
    id: string,
    status: string,
  ): Promise<OrderRecord | null> {
    const result = await this.db.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING id, client_id, address_id, status, total, created_at
      `,
      [status, id],
    );

    if (result.rows.length === 0) return null;

    return this.getOrderById(id);
  }

  async deleteOrder(id: string): Promise<boolean> {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      const orderResult = await client.query(
        `
        SELECT id, status
        FROM orders
        WHERE id = $1
        FOR UPDATE
        `,
        [id],
      );

      if (orderResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return false;
      }

      const itemsResult = await client.query(
        `
        SELECT product_id AS "productId", quantity
        FROM order_items
        WHERE order_id = $1
        `,
        [id],
      );

      for (const item of itemsResult.rows) {
        await client.query(
          `
          UPDATE products
          SET stock = stock + $1
          WHERE id = $2
          `,
          [item.quantity, item.productId],
        );
      }

      await client.query(`DELETE FROM order_items WHERE order_id = $1`, [id]);
      await client.query(`DELETE FROM orders WHERE id = $1`, [id]);

      await client.query("COMMIT");
      return true;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
