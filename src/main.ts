import express from "express";
import { logger } from "./middlewares/logger.js";
import { productRouter } from "./routers/product.routers.js";
import { ordersRouter } from "./routers/category.orders.js";
import { categoryRoute } from "./routers/category.routes.js";
const app = express();
const port = 3001;

// Habilita JSON e aplica middlewares/rotas
app.use(express.json());
app.use(logger);
app.use("/product", productRouter);
app.use(ordersRouter);
app.use("/category", categoryRoute);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
