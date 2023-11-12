import { categories, products } from "~/db/schema.server";

import { db } from "~/db/config.server";
import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";

export const getAllCategories = async () => {
  const result = await db.select().from(categories);
  if (!result) {
    throw new Error("Unable to get all categories");
  }
  return result;
};

export const getAllCategoriesWithProducts = async () => {
  // const result = await db.select().from(users);
  const result = await db.query.categories.findMany({
    with: {
      products: true,
    },
  });
  invariant(result, "Unable to get all categories");
  return result;
};

export const getAllProducts = async () => {
  const result = await db.select().from(products);
  invariant(result, "Unable to get all products");
  return result;
};

export const getProduct = async (id: number) => {
  const result = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  invariant(result, "Unable to get product");
  return result;
};

export const createProduct = async (data: any) => {
  console.log("createProduct: ", data);

  data.categoryId = Number(data.categoryId);
  const record = await db.insert(products).values(data).returning();
  invariant(record, "Unable to create a new product");
  return record;
};

export const updateProduct = async (id: number, data: any) => {
  data.updatedAt = new Date();
  const record = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();
  invariant(record, "Unable to update product");
  return record;
};
