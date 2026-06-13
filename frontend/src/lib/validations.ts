import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
export type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── Product ─────────────────────────────────────────────────────────────────

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional().default(""),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative"),
  reorder_level: z.coerce
    .number()
    .int("Reorder level must be a whole number")
    .min(0, "Reorder level cannot be negative"),
});
export type ProductFormValues = z.infer<typeof productSchema>;

// ─── Stock Movement ───────────────────────────────────────────────────────────

export const addStockSchema = z.object({
  product_id: z.coerce.number().positive("Select a product"),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
  movement_type: z.enum(["purchase", "adjustment", "return"]),
  notes: z.string().optional().default(""),
});
export type AddStockFormValues = z.infer<typeof addStockSchema>;

export const removeStockSchema = z.object({
  product_id: z.coerce.number().positive("Select a product"),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
  notes: z.string().optional().default(""),
});
export type RemoveStockFormValues = z.infer<typeof removeStockSchema>;

// ─── Sale ─────────────────────────────────────────────────────────────────────

export const createSaleSchema = z.object({
  product_id: z.coerce.number().positive("Select a product"),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
});
export type CreateSaleFormValues = z.infer<typeof createSaleSchema>;
