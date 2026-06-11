import { Pool } from "pg";
import dotenv from "dotenv";

// Carrega as variáveis do arquivo .env
dotenv.config();

// Cria o pool de conexões com o PostgreSQL
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Confirma quando a conexão com o banco é aberta
pool.on("connect", () => {
  console.log("Conectado ao PostgreSQL");
});

// Mostra erro de conexão com o banco
pool.on("error", (err) => {
  console.error("Erro na conexão:", err.message);
});
