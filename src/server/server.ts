import dotenv from "dotenv";
dotenv.config(); // precisa ser a primeira coisa antes de tudo

import express from "express";
import { authRouter } from "../routers/auth.router.js";
import { categoryRouter } from "../routers/category.routers.js";
import { productRouter } from "../routers/product.routers.js";
import { orderRouter } from "../routers/orders.router.js";
import { loggerMiddleware } from "../middlewares/logger.middleware.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";

// Variante de bootstrap usada para subir a API com dotenv carregado cedo.
const app = express();
const port = 3001;

app.use(express.json());

app.use(loggerMiddleware); // Global, todas as rotas
app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/orders", orderRouter);

app.use(errorMiddleware); // Sempre fica por último

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
