// Centraliza o tratamento de erros da API.
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

  const knownErrors: Record<string, { statusCode: number; message: string }> = {
    // Produto não encontrado
    "Product not found": {
      statusCode: 404,
      message: "There is not product with this id",
    },
    // Categoria não encontrada
    "Category not found": {
      statusCode: 404,
      message: "There is not category with this id",
    },
    // Produto não atualizado
    "Product not updated": {
      statusCode: 400,
      message: "It was not possible to update this product",
    },
    // Categoria não atualizada
    "Category not updated": {
      statusCode: 400,
      message: "It was not possible to update this category",
    },
    // Nome de categoria já existe
    "Category name already exists": {
      statusCode: 409,
      message: "Category must be unique",
    },
    // Parâmetros inválidos
    "Invalid Params": {
      statusCode: 400,
      message: "You must send correct params",
    },
    // E-mail já cadastrado
    "Email already in use": {
      statusCode: 409,
      message: "Email already in use",
    },
    // Credenciais inválidas
    "Invalid credentials": {
      statusCode: 401,
      message: "Invalid credentials",
    },
    // Refresh token não encontrado
    "Refresh token not found": {
      statusCode: 401,
      message: "Refresh token not found",
    },
    // Refresh token expirado
    "Refresh token expired": {
      statusCode: 401,
      message: "Refresh token expired",
    },
    // Cliente não encontrado
    "Client not found": {
      statusCode: 404,
      message: "There is not client with this id",
    },
    // Endereço não encontrado
    "Address not found": {
      statusCode: 404,
      message: "There is not address with this id",
    },
    // Pedido não encontrado
    "Order not found": {
      statusCode: 404,
      message: "There is not order with this id",
    },
    // Pedido não atualizado
    "Order not updated": {
      statusCode: 400,
      message: "It was not possible to update this order",
    },
    // Estoque insuficiente
    "Insufficient product stock": {
      statusCode: 422,
      message: "Insufficient stock",
    },
    // Pedido sem itens
    "At least one order item is required": {
      statusCode: 400,
      message: "At least one order item is required",
    },
  };

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
    });
  }

  if (pgError.code === "23505") {
    return res.status(409).json({ error: "Category name already exists" });
  }

  if (pgError.code === "23503") {
    return res.status(404).json({ error: "Referenced record not found" });
  }

  const knownError = knownErrors[err.message];

  if (knownError) {
    return res.status(knownError.statusCode).json({
      error: knownError.message,
    });
  }

  return res.status(500).json({
    error: "Internal server error",
  });
}
