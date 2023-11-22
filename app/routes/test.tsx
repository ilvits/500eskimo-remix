import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';

import { getProducts } from '~/services/products.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const { status, page, limit, orderBy, order } = Object.fromEntries(url.searchParams.entries());
  const { products, total } = await getProducts({
    productStatus: status || 'published',
    $top: Number(limit) || 10,
    $skip: Number(page) || 0,
    orderBy: orderBy || 'createdAt',
    order: order || 'desc',
  });
  // console.dir(products);
  return json({ products, status, page, limit, orderBy, order, total });
};
export default function Test() {
  const fetcher = useFetcher<typeof loader>();
  const loaderData = useLoaderData<typeof loader>();
  const { products, total } = fetcher.data || loaderData;
  console.log('products: ', products.length);
  console.log('total: ', total);

  return (
    <>
      <div className='p-4 text-3xl'>test</div>
      <nav>
        <ul className='flex space-x-4'>
          <li>
            <button
              className='px-8 py-2 rounded-full bg-[#DA9100] font-medium text-base text-white'
              onClick={() => {
                fetcher.submit({ status: 'published' }, { action: '/test', method: 'get' });
              }}
            >
              Published
            </button>
          </li>
          <li>
            <button
              className='px-8 py-2 rounded-full bg-[#DA9100] font-medium text-base text-white'
              onClick={() => {
                fetcher.submit({ status: 'draft' }, { action: '/test', method: 'get' });
              }}
            >
              Drafts
            </button>
          </li>
          <li>
            <button
              className='px-8 py-2 rounded-full bg-[#DA9100] font-medium text-base text-white'
              onClick={() => {
                fetcher.submit({ status: 'hidden' }, { action: '/test', method: 'get' });
              }}
            >
              Hidden
            </button>
          </li>
        </ul>
      </nav>
      <div className='p-4 '>
        {products.map(product => (
          <div key={product.id} className='flex space-x-4 py-4 border-b border-gray-200 items-center'>
            <div className='text-sm text-gray-500'>{product.id}</div>
            <div className='text-lg whitespace-nowrap'>
              {product.title} | {product.price}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
