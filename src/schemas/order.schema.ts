// Schemas Zod para pedidos.
import { z } from "zod";

export const createOrderItemSchema = z.object({
  productId: z.string().uuid("invalid product ID format"),
  quantity: z.coerce.number().int().positive({
    message: "quantity must be a positive number",
  }),
});

export const createOrderSchema = z.object({
  clientId: z.string().uuid("invalid client ID format"),
  addressId: z.string().uuid("invalid address ID format"),
  items: z.array(createOrderItemSchema).min(1, {
    message: "at least one item is required",
  }),
  status: z.string().min(1).optional(),
});

export const updateOrderSchema = z.object({
  status: z.string().min(1, "status is required"),
});

export const orderParamsSchema = z.object({
  id: z.string().uuid("invalid order ID format"),
});

export const orderQueryPaginationSchema = z.object({
  page: z.coerce.number().int().min(0, {
    message: "page must be a non-negative number",
  }),
  size: z.coerce.number().int().positive({
    message: "size must be a positive number",
  }),
});
