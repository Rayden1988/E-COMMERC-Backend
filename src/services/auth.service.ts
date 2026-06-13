import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type {
  RegisterDto,
  LoginDto,
  TokenPayload,
  UserResponseDto,
} from "../dto/auth.dto.js";
import { User } from "../entity/user.entity.js";
import type { UserRepository } from "../repository/interfaces/user.repository.js";

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(dto: RegisterDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = User.create(dto.name, dto.email, hashedPassword);
    const created = await this.userRepository.create(user);

    return {
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new Error("Invalid credentials");

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new Error("Invalid credentials");

    const accessToken = this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = this.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await this.userRepository.saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  private getRefreshTokenExpiration(): Date {
    const refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";
    const expiresMs = refreshTokenExpiresIn.endsWith("d")
      ? Number(refreshTokenExpiresIn.slice(0, -1)) * 24 * 60 * 60 * 1000
      : refreshTokenExpiresIn.endsWith("h")
        ? Number(refreshTokenExpiresIn.slice(0, -1)) * 60 * 60 * 1000
        : Number(refreshTokenExpiresIn) * 1000;

    if (Number.isNaN(expiresMs) || expiresMs <= 0) {
      throw new Error("Invalid JWT refresh token expiration");
    }

    return new Date(Date.now() + expiresMs);
  }

  async refresh(refreshToken: string) {
    const savedToken = await this.userRepository.findRefreshToken(refreshToken);
    if (!savedToken) throw new Error("Refresh token not found");

    if (new Date() > savedToken.expiresAt) {
      await this.userRepository.deleteRefreshToken(refreshToken);
      throw new Error("Refresh token expired");
    }

    const payload = jwt.verify(
      refreshToken,
      this.getJwtRefreshSecret(),
    ) as TokenPayload;

    const accessToken = this.generateAccessToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });

    return { accessToken };
  }

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT secret not configured");
    return secret;
  }

  private getJwtRefreshSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT refresh secret not configured");
    return secret;
  }

  private generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.getJwtSecret(), {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
    } as jwt.SignOptions);
  }

  private generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.getJwtRefreshSecret(), {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
    } as jwt.SignOptions);
  }
}
