import { categories } from "~/db/schema.server";
import { db } from "~/db/config.server";
import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";
import slugify from "@sindresorhus/slugify";

export const getAllCategories = async () => {
  const result = await db.select().from(categories);
  invariant(result, "Unable to get all categories");
  return result;
};

export const getAllCategoriesWithProducts = async () => {
  // const result = await db.select().from(users);
  const result = await db.query.categories.findMany({
    with: {
      products: {
        limit: 3,
      },
    },
  });
  invariant(result, "Unable to get all categories");
  return result;
};

export const getCategory = async (id: number) => {
  const result = await db.query.categories.findFirst({
    where: eq(categories.id, id),
  });
  invariant(result, "Unable to get category");
  return result;
};

export const createCategory = async (data: any) => {
  data.slug = slugify(data.name);
  console.log(data);

  const record = await db.insert(categories).values(data).returning();
  invariant(record, "Unable to create a new category");
  return record;
};

export const updateCategory = async (id: number, data: any) => {
  data.updatedAt = new Date();
  const record = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, id))
    .returning();
  invariant(record, "Unable to update category");
  return record;
};

export const deleteCategory = async (id: number) => {
  const deletedCategoryIds: { deletedId: number }[] = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning({ deletedId: categories.id });
  return deletedCategoryIds;
};
