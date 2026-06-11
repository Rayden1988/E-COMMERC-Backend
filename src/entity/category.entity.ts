export class Category {
  constructor(
    public id: string,
    public name: string,
  ) {}

  static create(name: string): Category {
    if (name.trim().length < 3) {
      throw new Error("Name must be at least 3 characters long");
    }

    return new Category(crypto.randomUUID(), name);
  }

  static restore(id: string, name: string): Category {
    if (name.trim().length < 3) {
      throw new Error("Name must be at least 3 characters long");
    }

    return new Category(id, name);
  }

  rename(newName: string): void {
    if (!newName || newName.trim().length < 3) {
      throw new Error("Nome deve ter ao menos 3 caracteres");
    }

    this.name = newName;
  }
}
