import { type AddProduct, productSchema } from '~/common/productSchema';

import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';
import { useLoaderData } from '@remix-run/react';
import { Input } from '~/components/ui/custom/Input';
import { Select } from '~/components/ui/custom/Select';
import { createProduct, getAllCategories, getAllTags } from '~/services/products.server';

const validator = withZod(productSchema);

export const loader: LoaderFunction = async () => {
  const defaultValues: AddProduct = {
    sku: '',
    title: '',
    description: '',
    price: 0,
    image: '',
    rating: 0,
    stock: 0,
    numReviews: 0,
    categoryId: 2,
  };

  const categories = await getAllCategories();
  const tags = await getAllTags();
  return json({ defaultValues, categories, tags });
};

export default function AddNewProduct() {
  const { defaultValues, categories, tags } = useLoaderData<typeof loader>();
  // console.log("categories: ", categories);

  return (
    <div className='m-12'>
      <h1 className='text-3xl'>Add New Product</h1>
      <ValidatedForm className='w-96 space-y-4' method='POST' validator={validator} defaultValues={defaultValues}>
        <Input type='text' name='sku' id='sku' label='SKU' />
        <Input type='text' name='title' id='title' label='Title' />
        <Select name='categoryId' id='categoryId' label='Category' options={categories}></Select>
        <Input type='text' name='description' id='description' label='Description' />
        <Input type='number' name='price' id='price' label='Price' />
        <Input type='text' name='image' id='image' label='Image' />
        <Input type='number' name='rating' id='rating' label='Rating' />
        <Input type='number' name='stock' id='stock' label='Stock' />
        <Input type='number' name='numReviews' id='numReviews' label='Num Reviews' />
        <input type='hidden' name='tagIds' id='tagIds' value='1' />
        {/* <Select name='tagIds' id='tagIds' label='Tags' options={tags}></Select> */}

        <button type='submit'>Add Product</button>
      </ValidatedForm>
    </div>
  );
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  console.log('formData: ', formData);

  const fieldValues = await validator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const result = await createProduct(fieldValues.data);
  console.log('result: ', result);
  if (!result) throw new Error('Something went wrong');

  return redirect('/admin/products');
};
