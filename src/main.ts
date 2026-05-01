import express, { type Request, type Response } from "express";
const app = express();
const port = 3000;
app.use(express.json());
app.get("/helf", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});
app.get("/category", (req: Request, res: Response) => {
  res.json({ message: "retornar todas as categorias" });
});
app.get("/category/:id", (req: Request, res: Response) => {
  const { page, size } = req.query;
  const id = req.params.id;
  res.json({ message: `retornar a categoria com id ${id}` });
});
app.post("/category", (req: Request, res: Response) => {
  const { name } = req.body;
  res.json({ message: `criar uma nova categoria com nome ${name}` });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
