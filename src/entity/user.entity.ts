// Entidade de usuario usada na autenticacao.
import { randomUUID } from "node:crypto";

export class User {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: string,
  ) {}

  static create(name: string, email: string, password: string): User {
    if (!name || name.trim().length < 3) {
      throw new Error("Nome deve ter ao menos 3 caracteres");
    }

    if (!email || !email.includes("@")) {
      throw new Error("Email inválido");
    }

    if (!password || password.length < 6) {
      throw new Error("Senha deve ter ao menos 6 caracteres");
    }

    return new User(randomUUID(), name.trim(), email.toLowerCase(), password, "user");
  }

  static restore(
    id: string,
    name: string,
    email: string,
    password: string,
    role: string,
  ): User {
    return new User(id, name, email, password, role);
  }
}
