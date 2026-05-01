import { type NextFunction, type Request, type Response } from "express";

export function logger(req: Request, _res: Response, next: NextFunction) {
  console.log(
    `[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl}`,
  );
  next();
}
