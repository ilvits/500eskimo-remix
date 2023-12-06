import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import { getAllOrders } from '~/services/orders.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const orders = await getAllOrders();
  return json({ orders });
};
export default function AdminMessages() {
  const { orders } = useLoaderData<typeof loader>();

  return (
    <div className='p-6'>
      <h1 className='mb-4 text-3xl font-bold'>orders</h1>
      <ul className='grid grid-cols-1 gap-4 p-4'>
        {orders.map(order => (
          <li key={order.id} className='flex flex-col space-y-2'>
            <div className='text-sm text-gray-500'>{dayjs(order.createdAt).format('DD MMM YYYY hh:mm')}</div>
            <div className='text-xl font-bold'>{order.customers?.username}</div>
            <div>{order.customers?.email}</div>
            <div className='grid grid-cols-4 space-y-2'>
              {order.orderItems.map(item => (
                <div key={item.id} className='flex items-center space-x-4'>
                  <div>
                    <img className='w-10 h-10 rounded' src={item.productVariant.product.cover || ''} alt='' />
                  </div>
                  <div>
                    {item.productVariant.product.title} ({item.price}$) ({item.quantity} pcs.)
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
