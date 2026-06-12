import jwt, { type JwtPayload } from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";

type AuthPayload = JwtPayload & {
  role?: string;
};

type AuthedRequest = Request & {
  auth?: AuthPayload;
};

const jwtSecret = process.env.JWT_SECRET ?? "dev-secret";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const token = header.slice(7).trim();

  try {
    const payload = jwt.verify(token, jwtSecret) as AuthPayload;
    (req as AuthedRequest).auth = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as AuthedRequest).auth;

    if (!auth) {
      return res.status(401).json({ error: "Token not provided" });
    }

    if (!auth.role || !roles.includes(auth.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return next();
  };
}
