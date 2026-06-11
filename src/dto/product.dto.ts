import type { Product } from "../entity/product.entity.js";

export class ProductListDTO {
  static create(products: Product[], page: number, size: number) {
    return {
      content: products,
      page,
      size,
    };
  }
}
