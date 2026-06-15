import { Pool } from "pg";
import dotenv from "dotenv";

// Carrega as variaveis do ambiente antes de abrir conexao.
dotenv.config();

// Pool compartilhado para as consultas no PostgreSQL.
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Loga quando o banco aceita a conexao.
pool.on("connect", () => {
  console.log("Conectado ao PostgreSQL");
});

// Loga falhas de conexao com o banco.
pool.on("error", (err) => {
  console.error("Erro na conexao:", err.message);
});
