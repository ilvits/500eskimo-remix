import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(3, 'Must contain at least 3 chars'),
  description: z.string(),
});

export type AddCategory = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  id: z.coerce.number(),
  categorySlug: z.string(),
  sortId: z.coerce.number().min(1, 'Please select a sort'),
  title: z.string({ required_error: 'Title is required' }).min(3, 'Must contain at least 3 chars'),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  cover: z.string(),
  coverPublicId: z.string().optional(),
  conditions: z.string({ required_error: 'Conditions is required' }).min(10, 'Must contain at least 10 chars'),
  callories: z.coerce.number().default(0).optional(),
  protein: z.coerce.number().default(0).optional(),
  fat: z.coerce.number().default(0).optional(),
  carbs: z.coerce.number().default(0).optional(),
  productStatus: z.enum(['PUBLISHED', 'DRAFT', 'ARCHIVED']).default('PUBLISHED').optional(),
  tagIds: z.string().or(z.array(z.string())).optional(),
  freeDelivery: z.coerce.boolean().default(false).optional(),
  productVariants: z.array(
    z.object({
      name: z.string({ required_error: 'Name is required' }).min(3, 'Must contain at least 3 chars'),
      price: z.coerce.number().default(0).optional(),
      SKU: z.string().optional().optional(),
      quantity: z.coerce.number().default(0).optional(),
      optionValueId: z.coerce.number({ required_error: 'Option value is required' }),
      status: z.enum(['PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
    })
  ),
});

export const editProductSchema = z.object({
  id: z.coerce.number(),
  sortId: z.coerce.number().min(1, 'Please select a sort'),
  title: z.string({ required_error: 'Title is required' }).min(3, 'Must contain at least 3 chars'),
  description: z.string({ required_error: 'Description is required' }).min(10, 'Must contain at least 10 chars'),
  ingredients: z.string({ required_error: 'Ingredients is required' }).min(10, 'Must contain at least 10 chars'),
  cover: z.string(),
  conditions: z.string({ required_error: 'Conditions is required' }).min(10, 'Must contain at least 10 chars'),
  callories: z.coerce.number().min(1, 'Must be > 0'),
  protein: z.coerce.number().min(1, 'Must be > 0'),
  fat: z.coerce.number().min(1, 'Must be > 0'),
  carbs: z.coerce.number().min(1, 'Must be > 0'),
  productStatus: z.enum(['PUBLISHED', 'DRAFT', 'ARCHIVED']).default('PUBLISHED').optional(),
  tagIds: z.string().or(z.array(z.string())).optional(),
  freeDelivery: z.coerce.boolean().default(false),
  productVariants: z.array(
    z.object({
      id: z.coerce.number().optional(),
      name: z.string({ required_error: 'Name is required' }).min(3, 'Must contain at least 3 chars'),
      price: z.coerce.number().default(0).optional(),
      SKU: z.string().optional().optional(),
      quantity: z.coerce.number().default(0).optional(),
      optionValueId: z.coerce.number({ required_error: 'Option value is required' }),
      status: z.enum(['PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
    })
  ),
});

export type AddProduct = z.infer<typeof productSchema>;

export type EditProduct = z.infer<typeof editProductSchema>;
