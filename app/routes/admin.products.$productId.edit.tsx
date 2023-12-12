import type { ActionFunctionArgs, LinksFunction, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { getAllCategories, getAllTags, getOptions, getProduct, updateProduct } from '~/services/products.server';
import { json, redirect } from '@remix-run/node';

import AdminEditProductLayout from '~/features/admin/AdminEditProductLayout';
import dashedBorderCSS from '~/styles/dashed-border.css';
import { editProductSchema } from '~/common/productSchema';
import invariant from 'tiny-invariant';
import reactCroperAdditional from '~/styles/react-advanced-cropper.css';
import reactCroperCSS from 'react-advanced-cropper/dist/style.css';
import reactCroperTheme from 'react-advanced-cropper/dist/themes/corners.css';
import { validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

const validator = withZod(editProductSchema);

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: reactCroperCSS },
    { rel: 'stylesheet', href: reactCroperTheme },
    { rel: 'stylesheet', href: reactCroperAdditional },
    { rel: 'stylesheet', href: dashedBorderCSS },
  ];
};

export const loader: LoaderFunction = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.productId, 'Missing productId param');
  const product = params.productId && (await getProduct(Number(params.productId)));

  const categories = await getAllCategories();
  const tags = await getAllTags();
  const options = await getOptions();
  return json({ categories, tags, options, product });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fieldValues = await validator.validate(formData);

  if (fieldValues.error) {
    console.log('fieldValues.error: ', fieldValues.error);
    return validationError(fieldValues.error);
  }

  const productId = Number(formData.get('id'));
  const coverPublicId = formData.get('coverPublicId');
  const categorySlug = formData.get('categorySlug');
  const tagIds = formData.getAll('tagIds');
  const images = formData.getAll('images');

  console.log('freeDelivery(formData): ', formData.get('freeDelivery'));
  console.log('freeDelivery(fieldValues.data): ', fieldValues.data.freeDelivery);

  const updatedProduct = await updateProduct(fieldValues.data, productId, categorySlug, coverPublicId, images, tagIds);
  // console.log('updatedProduct: ', updatedProduct);

  if (!updatedProduct) throw new Error('Something went wrong');
  return redirect('/admin/products?status=' + updatedProduct.productStatus);
};

export default function AddNewProduct() {
  return <AdminEditProductLayout />;
}
