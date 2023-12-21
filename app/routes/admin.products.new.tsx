import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import {
  checkTitleExists,
  createTemporaryImages,
  getCategoryBySlug,
  getImagesByProductId,
  getTempProduct,
  getTemporaryImages,
  getTemporaryImagesByProductId,
  updateProduct,
  updateTemporaryImages,
} from '~/services/products.server';
import { json, redirect } from '@remix-run/node';

import AdminNewProductLayout from '~/features/admin/AdminNewProductLayout';
import dashedBorderCSS from '~/styles/dashed-border.css';
import { productSchema } from '~/common/productSchema';
import reactCroperAdditional from '~/styles/react-advanced-cropper.css';
import reactCroperCSS from 'react-advanced-cropper/dist/style.css';
import reactCroperTheme from 'react-advanced-cropper/dist/themes/corners.css';
import { uploadImagesToCloudinary } from '~/services/cloudinary.server';
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  // const action = searchParams.get('_action');
  // console.log('action: ', action);
  // const titleExist =
  //   action === 'checkTitle' && (await checkTitleExists({ title: searchParams.get('title') as string }));
  const categorySlug = searchParams.get('category');
  const category = categorySlug && (await getCategoryBySlug(categorySlug));
  const { product, tags, sorts, options } = await getTempProduct();
  // console.log('product: ', product);
  const images = product && (await getTemporaryImagesByProductId({ productId: product.id }));
  // console.log('images: ', images);
  // console.log('titleExist: ', titleExist);

  return json({ product, tags, sorts, options, images, category });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const productId = Number(formData.get('productId') as string);

  switch (formData.get('_action')) {
    case 'uploadImages': {
      const productImages = JSON.parse(formData.get('productImages') as string);
      const lastIndex = parseInt(formData.get('lastIndex') as string);
      const uploadedImages = await uploadImagesToCloudinary(productImages);
      const uploadedProductImages = await createTemporaryImages({ images: uploadedImages, lastIndex, productId });
      return json({ uploadedProductImages });
    }
    case 'sortImages': {
      const productImages = JSON.parse(formData.get('productImages') as string);
      const updatedProductImages = await updateTemporaryImages({ images: productImages });
      return json({ updatedProductImages });
    }
    case 'checkTitle': {
      const titleExist = await checkTitleExists({ title: formData.get('title') as string });
      return json({ titleExist });
    }
    case 'newProduct': {
      const fieldValues = await validator.validate(formData);
      if (fieldValues.error) return validationError(fieldValues.error);
      const createdProduct = await updateProduct({ product: fieldValues.data });
      if (!createdProduct) throw new Error('Something went wrong');
      return redirect('/admin/products?status=DRAFT');
    }
    default:
      throw new Error('Something went wrong');
  }
};

export default function AddNewProduct() {
  return <AdminNewProductLayout />;
}
