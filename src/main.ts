import express from "express";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { productRouter } from "./routers/product.routers.js";
import { categoryRouter } from "./routers/category.routers.js";
import { authRouter } from "./routers/auth.router.js";
import { orderRouter } from "./routers/orders.router.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
const port = 3001;

// Habilita JSON e aplica middlewares/rotas
app.use(express.json());
app.use(loggerMiddleware);
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/orders", orderRouter);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
