import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getAllCategoriesWithProducts } from '~/services/category.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const categories = await getAllCategoriesWithProducts();

  return json({ categories });
};

export default function AdminCatalog() {
  const { categories } = useLoaderData<typeof loader>();
  console.log('categories: ', categories);

  return (
    <div>
      <div className='flex justify-between items-start'>
        <h1 className='text-5xl mb-4'>Products</h1>
        <Link to='/admin/products/new' className='text-green-900 text-xl font-bold'>
          add new product
        </Link>
      </div>
      <ul className='mx-16 flex flex-col space-y-4'>
        {categories.map(category => (
          <li key={category.id}>
            <div className='text-4xl capitalize font-bold pb-4'>{category.name}</div>
            <ul className='flex space-x-4 w-full [&>li]:w-1/5 font-semibold text-lg'>
              <li className='!w-7'></li>
              <li>
                <div>Product</div>
              </li>
              <li>
                <div>SKU</div>
              </li>
              <li>
                <div>Price</div>
              </li>
              <li>
                <div>Rating</div>
              </li>
              <li>
                <div>Stock</div>
              </li>
            </ul>
            <ul className='flex flex-col justify-center divide-y divide-slate-600 py-4 divide-dashed'>
              {category.products.map(product => (
                <Link key={product.id} to={`/admin/products/${product.id}/edit`}>
                  <ul className='flex space-x-4 w-full [&>li]:w-1/5 py-2'>
                    <li className='!w-7'>
                      <img className='w-7 h-7 rounded-md' src={product.image ?? undefined} alt='' />
                    </li>
                    <li key={product.id}>{product.title}</li>
                    <li>{product.sku}</li>
                    <li>{product.price}</li>
                    <li>{product.rating}</li>
                    <li>{product.stock}</li>
                  </ul>
                </Link>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
