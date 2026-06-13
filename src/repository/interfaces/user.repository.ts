import type { User } from "../../entity/user.entity.js";

export interface RefreshTokenRecord {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface UserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  saveRefreshToken(userId: string, token: string): Promise<void>;
  findRefreshToken(token: string): Promise<RefreshTokenRecord | null>;
  deleteRefreshToken(token: string): Promise<void>;
}
