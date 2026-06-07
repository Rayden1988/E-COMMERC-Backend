import { pool } from "./connection";

export async function runSchema(): Promise<void> {
  const client = await pool.connect();

  try {
    // Inicia a transação
    await client.query("BEGIN");

    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id UUID NOT NULL REFERENCES clients(id),
        street VARCHAR(200) NOT NULL,
        number VARCHAR(20) NOT NULL,
        city VARCHAR(100) NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        category_id UUID NOT NULL REFERENCES categories(id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id UUID NOT NULL REFERENCES clients(id),
        address_id UUID NOT NULL REFERENCES addresses(id),
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        total NUMERIC(10,2) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id),
        product_id UUID NOT NULL REFERENCES products(id),
        quantity INT NOT NULL,
        unit_price NUMERIC(10,2) NOT NULL
      )
    `);

    // Finaliza a transação
    await client.query("COMMIT");
    console.log("✅ Schema criado com sucesso");
  } catch (err) {
    // Em caso de erro, desfaz a transação
    await client.query("ROLLBACK");
    console.error("❌ Erro ao criar schema:", err);
    throw err;
  } finally {
    client.release();
  }
}
runSchema().catch((err) => {
  console.error("Erro ao executar runSchema:", err);
  process.exit(1);
});
