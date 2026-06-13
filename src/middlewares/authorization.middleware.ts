import { type NextFunction, type Request, type Response } from "express";

type AuthedRequest = Request & {
  user?: {
    role?: string;
  };
};

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthedRequest).user;

    if (!user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (!user.role || !roles.includes(user.role)) {
      return res.status(403).json({ error: "Sem permissão para esta ação" });
    }

    return next();
  };
}
