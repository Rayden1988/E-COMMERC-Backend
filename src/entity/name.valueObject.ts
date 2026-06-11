export class Name {
  constructor(public readonly value: string) {
    if (value.trim().length < 3) {
      throw new Error("Name must be at least 3 characters long");
    }
  }

  static create(name: string): Name {
    return new Name(name.trim());
  }

  getValue(): string {
    return this.value;
  }
}
