import type { Request, Response, NextFunction } from "express";

// Middleware simples para medir tempo de resposta.
export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`,
    );
  });

  next();
}
