import type { DataFunctionArgs, LoaderFunction } from '@remix-run/node';
import { createProduct, getAllCategories, getAllTags, getOptions } from '~/services/products.server';
import { json, redirect } from '@remix-run/node';

import AdminNewProductLayout from '~/features/admin/AdminNewProductLayout';
import { productSchema } from '~/common/productSchema';
import { validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

const validator = withZod(productSchema);

export const loader: LoaderFunction = async () => {
  const categories = await getAllCategories();
  const tags = await getAllTags();
  const options = await getOptions();
  return json({ categories, tags, options });
};

export const action = async ({ request }: DataFunctionArgs) => {
  const formData = await request.formData();
  const fieldValues = (await validator.validate(formData)) || { data: {} };

  if (fieldValues.error) return validationError(fieldValues.error);

  const tagIds = formData.getAll('tagIds');
  const imagesData = formData.getAll('images');
  const createdProduct = await createProduct(fieldValues.data, imagesData, tagIds);
  if (!createdProduct) throw new Error('Something went wrong');

  return redirect('/admin/products?status=draft');
};

export default function AddNewProduct() {
  return <AdminNewProductLayout />;
}
