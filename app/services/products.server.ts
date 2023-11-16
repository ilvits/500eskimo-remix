import { desc, eq } from 'drizzle-orm';

import { db } from '~/db/config.server';
import invariant from 'tiny-invariant';
import { products } from '~/db/schema.server';

export const getAllProducts = async (limit = 10) => {
  const result = await db.query.products.findMany({
    limit: limit,
    with: {
      category: {
        columns: {
          name: true,
        },
      },
    },
    orderBy: [desc(products.createdAt)],
  });
  invariant(result, 'Unable to get all products');
  return result;
};

export const getProduct = async (id: number) => {
  const result = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  invariant(result, 'Unable to get product');
  return result;
};

export const createProduct = async (data: any) => {
  data.categoryId = Number(data.categoryId);
  const record = await db.insert(products).values(data).returning();
  invariant(record, 'Unable to create a new product');
  return record;
};

export const updateProduct = async (id: number, data: any) => {
  data.updatedAt = new Date();
  const record = await db.update(products).set(data).where(eq(products.id, id)).returning();
  invariant(record, 'Unable to update product');
  return record;
};
