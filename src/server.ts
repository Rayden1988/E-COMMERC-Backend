import express from "express";
import { categoryRoute } from "./routers/category.routes.js";

const app = express();
const port = 3001;

app.use(express.json());
app.use("/category", categoryRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
