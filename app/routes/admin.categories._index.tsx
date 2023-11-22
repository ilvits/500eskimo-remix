import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { getAllCategories } from 'services_old/category.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const categories = await getAllCategories();

  return json({ categories });
};

export default function AdminCatalog() {
  const { categories } = useLoaderData<typeof loader>();

  return (
    <div className='w-screen h-screen flex justify-center p-6'>
      <div className='w-full'>
        <div className='flex justify-between items-start'>
          <h1 className='text-5xl mb-4'>Categories</h1>
          <Link to='/admin/categories/new' className='text-green-900 text-xl font-bold'>
            add new category
          </Link>
        </div>
        <ul className='flex flex-col justify-center divide-y divide-slate-600 p-4 divide-dashed'>
          {categories.map(category => (
            <div key={category.id} className='flex'>
              <li className='font-semibold text-lg w-2/6'>{category.name}</li>
              <li className='w-3/6 truncate'>{category.description}</li>
              <li className='w-1/12'>
                <Link to={category.id + '/edit'}>Edit</Link>
              </li>
              <Form
                method='post'
                action={category.id + '/delete'}
                onSubmit={event => {
                  const response = confirm('Please confirm you want to delete this contact.');
                  if (!response) {
                    event.preventDefault();
                  }
                }}
              >
                <button className='text-red-600 disabled:opacity-50' type='submit'>
                  Delete
                </button>
              </Form>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
