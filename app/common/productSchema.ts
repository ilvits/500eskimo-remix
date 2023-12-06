import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(3, 'Must contain at least 3 chars'),
  description: z.string(),
});

export type AddCategory = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  categoryId: z.coerce.number(),
  title: z.string({ required_error: 'Title is required' }).min(3, 'Must contain at least 3 chars'),
  description: z.string().optional(),
  cover: z.string(),
  conditions: z.string().optional(),
  callories: z.coerce.number().optional(),
  protein: z.coerce.number().optional(),
  fat: z.coerce.number().optional(),
  carbs: z.coerce.number().optional(),
  ProductStatus: z.enum(['published', 'draft', 'unpublished']).default('published').optional(),
  tagIds: z.string().or(z.array(z.string())).optional(),
  productVariants: z.array(
    z.object({
      name: z.string().min(3, 'Must contain at least 3 chars').optional(),
      price: z.coerce.number().default(0).optional(),
      sku: z.string().optional().optional(),
      quantity: z.coerce.number().default(0).optional(),
      optionValueId: z.coerce.number({ required_error: 'Option value is required' }),
    })
  ),
});

export type AddProduct = z.infer<typeof productSchema>;

// export const authSchemaWithoutUsername = productSchema.omit({ username: true });

// export type GetUserByEmailAuth = z.infer<typeof authSchemaWithoutUsername>;
