import { Input } from '~/components/ui/custom/Input';
import { ValidatedForm } from 'remix-validated-form';
import { categorySchema } from '~/common/productSchema';
import { withZod } from '@remix-validated-form/with-zod';
import { json, type LoaderFunctionArgs, type LoaderFunction, redirect } from '@remix-run/node';
import { getCategory, updateCategory } from '~/services/category.server';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/custom/Button';

const validator = withZod(categorySchema);

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.categoryId, 'Missing categoryId param');
  const category = await getCategory(Number(params.categoryId));
  return json({ defaultValues: category });
};

export const action = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.categoryId, 'Missing categoryId param');
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  console.log('updates: ', updates);

  await updateCategory(Number(params.categoryId), updates);
  return redirect(`/admin/categories`);
};

export default function AdminProductCardEdit() {
  const { defaultValues } = useLoaderData<typeof loader>();
  return (
    <ValidatedForm className='w-96 space-y-4' method='POST' validator={validator} defaultValues={defaultValues}>
      <Input type='text' name='name' id='name' label='Name' />
      <Input type='text' name='description' id='description' label='Description' />

      <Button
        type='submit'
        label='Save'
        className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        Save
      </Button>
    </ValidatedForm>
  );
}
