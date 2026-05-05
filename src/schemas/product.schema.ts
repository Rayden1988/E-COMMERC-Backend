import { z } from "zod";

const createProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "name must be at least 3 characters" }),
  price: z.coerce.number().positive({
    message: "price must be a positive number",
  }),
  categoryId: z.string().uuid("invalid category ID format"),
});

const productQuerySchema = z.object({
  category: z.string().uuid("invalid category ID format").optional(),
});

const productParamsSchema = z.object({
  id: z.string().uuid("invalid product ID format"),
});

export { createProductSchema, productQuerySchema, productParamsSchema };
