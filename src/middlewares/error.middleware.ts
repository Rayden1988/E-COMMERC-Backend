import { type NextFunction, type Request, type Response } from "express";
import { AppError } from "../errors/app-error.js";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof Error) {
    const statusCode = err.message.includes("not found") ? 404 : 500;
    return res.status(statusCode).json({ error: err.message });
  }

  return res.status(500).json({ error: "Internal server error" });
}
