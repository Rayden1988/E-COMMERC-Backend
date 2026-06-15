// Entidade de produto com validacoes de dominio.
import { Name } from "./name.valueObject.js";

export class Product {
  private constructor(
    public readonly id: string,
    public readonly name: Name,
    public readonly price: number,
    public readonly stock: number,
    public readonly categoryId: string,
  ) {}

  static create(
    name: string,
    price: number,
    stock: number,
    categoryId: string,
  ): Product {
    if (!name || name.trim().length < 3) {
      throw new Error("Name must be at least 3 characters long");
    }

    if (price < 0) {
      throw new Error("Price cannot be negative");
    }

    if (stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    return new Product(
      crypto.randomUUID(),
      Name.create(name),
      price,
      stock,
      categoryId,
    );
  }

  static restore(
    id: string,
    name: Name,
    price: number,
    stock: number,
    categoryId: string,
  ): Product {
    if (!name.getValue() || name.getValue().trim().length < 3) {
      throw new Error("Name must be at least 3 characters long");
    }

    if (price < 0) {
      throw new Error("Price cannot be negative");
    }

    if (stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    return new Product(id, name, price, stock, categoryId);
  }
}
