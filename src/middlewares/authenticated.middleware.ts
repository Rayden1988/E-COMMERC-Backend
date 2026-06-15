import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type AuthenticatedUser = jwt.JwtPayload;

// Extende a request do Express para guardar o usuario autenticado.
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
    return res.status(401).json({ error: "Token nÃ£o fornecido" });
  }

  // Extrai somente o token, sem o prefixo Bearer.
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token nÃ£o fornecido" });
  }

  const jwtSecret = process.env.JWT_SECRET ?? "";

  if (!jwtSecret) {
    return res.status(500).json({ error: "JWT secret nÃ£o configurado" });
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as AuthenticatedUser;

    // Disponibiliza o usuario para os proximos handlers.
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: "Token expirado",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      error: "Token invÃ¡lido",
      code: "TOKEN_INVALID",
    });
  }
}
