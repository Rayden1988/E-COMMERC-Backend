import { Router } from "express";
import { pool } from "../database/connection.js";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.services.js";
import { UserPgRepository } from "../repository/pg/user.repository.js";

const router = Router();

const userRepository = new UserPgRepository(pool);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post("/register", (req, res, next) =>
  authController.register(req, res, next),
);
router.post("/login", (req, res, next) => authController.login(req, res, next));
router.post("/refresh", (req, res, next) =>
  authController.refresh(req, res, next),
);

export { router as authRouter };
