import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthenticatedUser } from "../dto/auth.dto.js";

// extendendo o tipo do Express para guardar o user na request
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1]; // pega só o token, sem o "Bearer "
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const jwtSecret = process.env.JWT_SECRET ?? "";

  if (!jwtSecret) {
    return res.status(500).json({ error: "JWT secret não configurado" });
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as AuthenticatedUser;

    req.user = payload; // disponibiliza o user pra qualquer controller
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: "Token expirado",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      error: "Token inválido",
      code: "TOKEN_INVALID",
    });
  }
}
