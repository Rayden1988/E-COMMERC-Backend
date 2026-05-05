import { z } from "zod";

const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "name must be at least 3 characters " })
    .max(100, { message: "name must be less than 100 characters" }),
  description: z.string().optional(),
});

const categoryQueryPaginationSchema = z.object({
  page: z.coerce.number().int().positive({
    message: "page must be a positive number",
  }),
  size: z.coerce.number().int().positive({
    message: "size must be a positive number",
  }),
});

const categoryParamsSchema = z.object({
  id: z.string().uuid("invalid category ID format"),
});

export {
  createCategorySchema,
  categoryParamsSchema,
  categoryQueryPaginationSchema,
};
