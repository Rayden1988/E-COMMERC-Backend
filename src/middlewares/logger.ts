import { type NextFunction, type Request, type Response } from "express";

function logger(req: Request, _res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.url}`);
  next();
}

export { logger };
