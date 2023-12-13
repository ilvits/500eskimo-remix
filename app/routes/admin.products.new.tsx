import type { DataFunctionArgs, LinksFunction, LoaderFunction } from '@remix-run/node';
import { createProduct, getAllTags, getOptions } from '~/services/products.server';
import { json, redirect } from '@remix-run/node';

import AdminNewProductLayout from '~/features/admin/AdminNewProductLayout';
import dashedBorderCSS from '~/styles/dashed-border.css';
import { productSchema } from '~/common/productSchema';
import reactCroperAdditional from '~/styles/react-advanced-cropper.css';
import reactCroperCSS from 'react-advanced-cropper/dist/style.css';
import reactCroperTheme from 'react-advanced-cropper/dist/themes/corners.css';
import { validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

const validator = withZod(productSchema);

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: reactCroperCSS },
    { rel: 'stylesheet', href: reactCroperTheme },
    { rel: 'stylesheet', href: reactCroperAdditional },
    { rel: 'stylesheet', href: dashedBorderCSS },
  ];
};

export const loader: LoaderFunction = async () => {
  const tags = await getAllTags();
  const options = await getOptions();
  return json({ tags, options });
};

export const action = async ({ request }: DataFunctionArgs) => {
  const formData = await request.formData();
  const fieldValues = (await validator.validate(formData)) || { data: {} };

  if (fieldValues.error) return validationError(fieldValues.error);

  const categorySlug = formData.get('categorySlug');
  console.log('categorySlug', categorySlug);

  const tagIds = formData.getAll('tagIds');
  const images = formData.getAll('images');
  const createdProduct = await createProduct(fieldValues.data, images, categorySlug, tagIds);
  if (!createdProduct) throw new Error('Something went wrong');

  return redirect('/admin/products?status=DRAFT');
};

export default function AddNewProduct() {
  return <AdminNewProductLayout />;
}
