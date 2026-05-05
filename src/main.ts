import express from "express";
import { logger } from "./middlewares/logger.js";
import { productsRouter } from "./routers/category.products.js";
import { ordersRouter } from "./routers/category.orders.js";
import { categoryRoute } from "./routers/category.routes.js";

const app = express();
const port = 3001;

app.use(express.json());
app.use(logger);
app.use(productsRouter);
app.use(ordersRouter);
app.use("/category", categoryRoute);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
