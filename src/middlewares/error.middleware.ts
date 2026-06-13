import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error.js";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(`[ERROR] ${err.message}`);

  const pgError = err as Error & { code?: string };

  const knownErrors: Record<string, number> = {
    "Email already in use": 409,
    "Invalid credentials": 401,
    "Refresh token not found": 401,
    "Refresh token expired": 401,
    "Product not found": 404,
    "Category not found": 404,
    "Client not found": 404,
    "Address not found": 404,
    "Order not found": 404,
    "Insufficient product stock": 400,
    "Product not updated": 400,
    "Category not updated": 400,
    "Order not updated": 400,
    "At least one order item is required": 400,
  };

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (pgError.code === "23505") {
    return res.status(409).json({ error: "Email already in use" });
  }

  if (pgError.code === "23503") {
    return res.status(404).json({ error: "Referenced record not found" });
  }

  const status = knownErrors[err.message] ?? 500;
  const message = status === 500 ? "Internal server error" : err.message;

  return res.status(status).json({ error: message });
}
