import { type AddCategory, categorySchema } from '~/common/productSchema';
import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';
import { useLoaderData } from '@remix-run/react';
import { Input } from '~/components/ui/custom/Input';
import { createCategory } from 'tmp/services_old/category.server';
import { Button } from '~/components/ui/custom/Button';

import invariant from 'tiny-invariant';

const validator = withZod(categorySchema);

export const loader: LoaderFunction = async () => {
  const defaultValues: AddCategory = {
    name: '',
    description: '',
  };
  return json({ defaultValues });
};

export default function AddNewCategory() {
  const { defaultValues } = useLoaderData<typeof loader>();

  return (
    <div className='m-12'>
      <h1 className='text-3xl'>Add New Category</h1>
      <ValidatedForm className='w-96 space-y-4' method='POST' validator={validator} defaultValues={defaultValues}>
        <Input type='text' name='name' id='name' label='Name' />
        <Input type='text' name='description' id='description' label='Description' />

        <Button type='submit' label='Add'>
          Add Category
        </Button>
      </ValidatedForm>
    </div>
  );
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const fieldValues = await validator.validate(formData);

  if (fieldValues.error) return validationError(fieldValues.error);

  const result = await createCategory(fieldValues.data);
  invariant(result, 'Failed to create category');

  return redirect('/admin/categories');
};
