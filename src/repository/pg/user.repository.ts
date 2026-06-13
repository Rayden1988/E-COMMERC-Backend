import jwt from "jsonwebtoken";
import { User } from "../../entity/user.entity.js";
import type {
  RefreshTokenRecord,
  UserRepository,
} from "../interfaces/user.repository.js";

export class UserPgRepository implements UserRepository {
  constructor(private db: any) {}

  async create(user: User): Promise<User> {
    const query = `
      INSERT INTO users (id, name, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await this.db.query(query, [
      user.id,
      user.name,
      user.email,
      user.password,
      user.role,
    ]);

    const row = result.rows[0];
    return User.restore(row.id, row.name, row.email, row.password, row.role);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query(
      `SELECT id, name, email, password, role FROM users WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return User.restore(row.id, row.name, row.email, row.password, row.role);
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.query(
      `SELECT id, name, email, password, role FROM users WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return User.restore(row.id, row.name, row.email, row.password, row.role);
  }

  async saveRefreshToken(userId: string, token: string): Promise<void> {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date();

    await this.db.query(
      `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (token) DO UPDATE
      SET user_id = EXCLUDED.user_id,
          expires_at = EXCLUDED.expires_at
    `,
      [userId, token, expiresAt],
    );
  }

  async findRefreshToken(token: string): Promise<RefreshTokenRecord | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        user_id AS "userId",
        token,
        expires_at AS "expiresAt",
        created_at AS "createdAt"
      FROM refresh_tokens
      WHERE token = $1
    `,
      [token],
    );

    if (result.rows.length === 0) return null;

    return result.rows[0] as RefreshTokenRecord;
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.db.query(`DELETE FROM refresh_tokens WHERE token = $1`, [token]);
  }
}
