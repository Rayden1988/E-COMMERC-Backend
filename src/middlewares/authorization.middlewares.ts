// Variante auxiliar do middleware de permissao.
import type { Request, Response, NextFunction } from "express";

type AuthRequest = Request & { user?: { role: string } };

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Sem permissão para esta ação" });
    }

    // 401 = não autenticado / 403 = autenticado mas sem permissão
    next();
  };
}
