import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import {
  createProduct,
  createTemporaryImages,
  getCategoryBySlug,
  getTempProduct,
  getTemporaryImages,
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
  const categorySlug = new URL(request.url).searchParams.get('category');
  const category = categorySlug && (await getCategoryBySlug(categorySlug));
  const { product, tags, sorts, options } = await getTempProduct();
  const images = await getTemporaryImages();
  return json({ product, tags, sorts, options, images, category });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  if (formData.get('_action') === 'uploadImages') {
    const productImages = JSON.parse(formData.get('productImages') as string);
    const lastIndex = parseInt(formData.get('lastIndex') as string);
    const uploadedImages = await uploadImagesToCloudinary(productImages);
    const updatedProductImages = await createTemporaryImages({ images: uploadedImages, lastIndex });
    // console.log('updatedProductImages: ', updatedProductImages);
    return json({ updatedProductImages });
  } else if (formData.get('_action') === 'sortImages') {
    const productImages = JSON.parse(formData.get('productImages') as string);
    console.log('productImages: ', productImages);

    const updatedProductImages = await updateTemporaryImages({ images: productImages });
    console.log('updatedProductImages: ', updatedProductImages);

    return json({ updatedProductImages });
  } else {
    const fieldValues = (await validator.validate(formData)) || { data: {} };
    if (fieldValues.error) return validationError(fieldValues.error);

    const categorySlug = formData.get('categorySlug');
    console.log('categorySlug', categorySlug);

    const tagIds = formData.getAll('tagIds');
    const productImages = formData.getAll('productImages');
    const productVariantsImages = formData.getAll('productVariantsImages').map(image => JSON.parse(image as string))[0];
    console.log('productVariantsImages: ', productVariantsImages);

    const createdProduct = await createProduct({
      data: fieldValues.data,
      productImages,
      productVariantsImages,
      categorySlug,
      tagIds,
    });
    if (!createdProduct) throw new Error('Something went wrong');

    return redirect('/admin/products?status=DRAFT');
  }
};

export default function AddNewProduct() {
  return <AdminNewProductLayout />;
}
