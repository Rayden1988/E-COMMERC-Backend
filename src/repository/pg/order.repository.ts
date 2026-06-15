// Implementacao PostgreSQL do repositorio de pedidos.
import type {
  CreateOrderInput,
  OrderRecord,
  OrderRepository,
} from "../interfaces/order.repository.js";

export class OrderPgRepository implements OrderRepository {
  constructor(private db: any) {}

  // Converte a linha do pedido em objeto com os itens carregados
  private async mapOrderRow(client: any, orderRow: any): Promise<OrderRecord> {
    // Busca os itens ligados ao pedido
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

  // Cria um pedido, valida estoque e grava os itens
  async createOrder(input: CreateOrderInput): Promise<OrderRecord> {
    const client = await this.db.connect();

    try {
      // Começa a transação para garantir consistência
      await client.query("BEGIN");

      // Confere se o cliente existe
      const clientResult = await client.query(
        `SELECT id FROM clients WHERE id = $1`,
        [input.clientId],
      );

      if (clientResult.rows.length === 0) {
        throw new Error("Client not found");
      }

      // Confere se o endereço existe
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
        // Bloqueia o produto para evitar corrida de estoque
        const productResult = await client.query(
          `SELECT id, price, stock FROM products WHERE id = $1 FOR UPDATE`,
          [item.productId],
        );

        if (productResult.rows.length === 0) {
          throw new Error("Product not found");
        }

        // Calcula subtotal e checa estoque
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

        // Acumula o total do pedido
        total += unitPrice * item.quantity;
        normalizedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
        });
      }

      const status = input.status ?? "pending";
      // Insere o pedido principal
      const orderResult = await client.query(
        `
        INSERT INTO orders (client_id, address_id, status, total)
        VALUES ($1, $2, $3, $4)
        RETURNING id, client_id, address_id, status, total, created_at
        `,
        [input.clientId, input.addressId, status, total],
      );

      const orderRow = orderResult.rows[0];

      // Insere os itens do pedido
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

      // Retorna o pedido com os itens carregados
      return this.mapOrderRow(client, orderRow);
    } catch (error) {
      // Em caso de erro, desfaz tudo
      await client.query("ROLLBACK");
      throw error;
    } finally {
      // Libera a conexão
      client.release();
    }
  }

  // Lista pedidos com paginação
  async getAllOrders({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<OrderRecord[]> {
    // Busca pedidos com paginação
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
      // Carrega os itens de cada pedido
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

  // Busca um pedido pelo id
  async getOrderById(id: string): Promise<OrderRecord | null> {
    // Busca o pedido principal
    const result = await this.db.query(
      `
      SELECT id, client_id, address_id, status, total, created_at
      FROM orders
      WHERE id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) return null;

    // Monta o pedido completo com os itens
    return this.mapOrderRow(this.db, result.rows[0]);
  }

  // Atualiza somente o status do pedido
  async updateOrderStatus(
    id: string,
    status: string,
  ): Promise<OrderRecord | null> {
    // Atualiza apenas o status do pedido
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

    // Retorna o pedido atualizado
    return this.getOrderById(id);
  }

  // Remove o pedido e devolve o estoque dos produtos
  async deleteOrder(id: string): Promise<boolean> {
    const client = await this.db.connect();

    try {
      // Começa a transação para reverter o estoque se algo falhar
      await client.query("BEGIN");

      // Garante que o pedido existe antes de apagar
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

      // Busca os itens do pedido para devolver o estoque
      const itemsResult = await client.query(
        `
        SELECT product_id AS "productId", quantity
        FROM order_items
        WHERE order_id = $1
        `,
        [id],
      );

      for (const item of itemsResult.rows) {
        // Devolve a quantidade ao estoque dos produtos
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
      // Confirma a exclusão
      return true;
    } catch (error) {
      // Em caso de erro, desfaz a operação
      await client.query("ROLLBACK");
      throw error;
    } finally {
      // Libera a conexão
      client.release();
    }
  }
}
