import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(3, "Must contain at least 3 chars"),
  description: z.string(),
});

export type AddCategory = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  sku: z.string().min(12, "Must contain at least 12 chars"),
  title: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  image: z.string(),
  rating: z.string(),
  stock: z.coerce.number(),
  numReviews: z.coerce.number(),
  categoryId: z.coerce.number(),
});

export type AddProduct = z.infer<typeof productSchema>;

// export const authSchemaWithoutUsername = productSchema.omit({ username: true });

// export type GetUserByEmailAuth = z.infer<typeof authSchemaWithoutUsername>;
