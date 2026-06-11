import { type NextFunction, type Request, type Response } from "express";

// Middleware simples para registrar a requisição no terminal
function logger(req: Request, _res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.url}`);
  next();
}

export { logger };
