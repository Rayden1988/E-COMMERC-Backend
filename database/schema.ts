import { pool } from "./connection";

// Função principal que cria as tabelas do banco
export async function runSchema(): Promise<void> {
  // Abre uma conexão com o banco
  const client = await pool.connect();

  try {
    // Inicia uma transação:
    // se algum comando falhar, tudo é revertido
    await client.query("BEGIN");

    // Habilita a extensão pgcrypto
    // ela permite gerar UUID com gen_random_uuid()
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    // Cria a tabela de categorias
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    // Cria a tabela de clientes
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE
      )
    `);

    // Cria a tabela de endereços
    // cada endereço pertence a um cliente
    await client.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id UUID NOT NULL REFERENCES clients(id),
        street VARCHAR(200) NOT NULL,
        number VARCHAR(20) NOT NULL,
        city VARCHAR(100) NOT NULL
      )
    `);

    // Cria a tabela de usuários
    // aqui ficam os dados de login e permissão
    // password vai armazenar a senha em formato hash
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Cria a tabela de refresh tokens
    // serve para renovar o acesso sem pedir login toda hora
    // cada token fica ligado a um usuário
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Inserir usuário com papel de admin
    await client.query(`
  INSERT INTO users (id, name, email, password, role)
  VALUES (
    '22c69aaf-d9d8-4bc8-8405-c26171a6f590',
    'admin',
    'admin@gmail.com',
    '$2b$10$a.0TgmNdEdmSV1Gh10ImGOIRZotbnT445Fw.kB.GrHHUMAKByJkG.',
    'admin'
  )
  ON CONFLICT (email) DO NOTHING
`);
    // Cria um usuário inicial: senha 123456

    // Finaliza a transação
    await client.query("COMMIT");
    console.log("✅ Schema criado com sucesso");

    // Cria a tabela de produtos
    // cada produto pertence a uma categoria
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        category_id UUID NOT NULL REFERENCES categories(id)
      )
    `);

    // Cria a tabela de pedidos
    // cada pedido pertence a um cliente e a um endereço
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

    // Cria a tabela de itens do pedido
    // cada item liga um pedido a um produto
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id),
        product_id UUID NOT NULL REFERENCES products(id),
        quantity INT NOT NULL,
        unit_price NUMERIC(10,2) NOT NULL
      )
    `);

    // Finaliza a transação com sucesso
    await client.query("COMMIT");
    console.log("✅ Schema criado com sucesso");
  } catch (err) {
    // Se der erro, desfaz tudo que foi feito na transação
    await client.query("ROLLBACK");
    console.error("❌ Erro ao criar schema:", err);
    throw err;
  } finally {
    // Libera a conexão com o banco
    client.release();
  }
}

// Executa a criação do schema quando o arquivo roda
runSchema().catch((err) => {
  console.error("Erro ao executar runSchema:", err);
  process.exit(1);
});
