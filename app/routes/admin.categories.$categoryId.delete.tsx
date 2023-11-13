import type { ActionFunctionArgs } from "@remix-run/node";
import { deleteCategory } from "~/services/category.server";
import invariant from "tiny-invariant";
import { redirect } from "@remix-run/node";

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.categoryId, "Missing categoryId param");
  await deleteCategory(Number(params.categoryId));
  return redirect("/admin/categories");
};
