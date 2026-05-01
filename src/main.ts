import express from "express";
import { logger } from "./middlewares/logger.js";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(logger);
app.use(productsRouter);
app.use(ordersRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
