import type { Request, Response, NextFunction } from "express";
import {
  loginSchema,
  refreshSchema,
  registerSchema,
} from "../schemas/auth.schema.js";
import type { AuthService } from "../services/auth.service.js";

export class AuthController {
  constructor(private service: AuthService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    const user = await this.service.register(result.data);
    return res.status(201).json(user);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    const tokens = await this.service.login(result.data);
    return res.json(tokens);
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    const result = refreshSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    const tokens = await this.service.refresh(result.data.refreshToken);
    return res.json(tokens);
  }
}
