import { z } from "zod";

export const productSchema = z.object({
  sku: z.string(),
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
