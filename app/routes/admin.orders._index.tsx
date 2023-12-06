import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import { getAllOrders } from '~/services/orders.server';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import numeral from 'numeral';
import { Button } from '~/components/ui/button';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const status = searchParams.get('status');
  console.log('status: ', status);

  const orders = await getAllOrders(status || 'all');
  return json({ orders });
};
export default function AdminMessages() {
  const { orders } = useLoaderData<typeof loader>();

  const setStatus = (status: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('status', status);
    window.location.search = searchParams.toString();
  };

  return (
    <div className='flex flex-col space-y-6'>
      <h1 className='text-3xl font-bold'>Orders</h1>
      <section id='filters' className='flex space-x-4'>
        <Button variant='secondary' onClick={() => setStatus('all')}>
          Active
        </Button>
        <Button variant='outline' onClick={() => setStatus('pending')}>
          Pending
        </Button>
        <Button variant='outline' onClick={() => setStatus('delivering')}>
          Shipped
        </Button>
        <Button variant='outline' onClick={() => setStatus('closed')}>
          Closed
        </Button>
      </section>
      <section id='products' className='w-full border rounded-t-xl border-secondary-100'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-secondary-50 bg-secondary-50 [&>th]:text-secondary-500 [&>th]:font-semibold border-secondary-100'>
              <TableHead className='w-16 rounded-tl-xl'>№</TableHead>
              <TableHead className='w-28'>Status</TableHead>
              <TableHead className='min-w-fit max-w-fit'>Products</TableHead>
              <TableHead className='text-center'>Delivered</TableHead>
              <TableHead className='text-center'>Total</TableHead>
              <TableHead className='text-center rounded-tr-xl'>Customer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id} className='border-secondary-100 hover:bg-[#fffdf8]'>
                <TableCell className='w-16'>{order.id}</TableCell>
                <TableCell className=''>
                  <div className='flex flex-row items-center space-x-2'>
                    <div
                      className={`${
                        order.status === 'closed'
                          ? 'bg-green-500'
                          : order.status === 'delivering' ||
                            order.status === 'processing' ||
                            order.status === 'pending' ||
                            order.status === 'waiting payment'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      } w-2 h-2 rounded-full shrink-0`}
                    ></div>
                    <div>{order.status}</div>
                  </div>
                </TableCell>
                <TableCell className='flex items-center justify-center -space-x-1 overflow-hidden min-w-fit max-w-fit'>
                  {order.orderItems.slice(0, 2).map(item => (
                    <div key={item.id}>
                      <img
                        className='w-10 h-10 rounded-md ring-[3px] ring-white'
                        src={item.productVariant.product.cover || '/static/assets/no-image.jpg'}
                        alt=''
                      />
                    </div>
                  ))}
                  {order.orderItems.length >= 3 &&
                    (order.orderItems.length === 3 ? (
                      <div key={order.orderItems[2].id}>
                        <img
                          className='w-10 h-10 rounded-md ring-[3px] ring-white'
                          src={order.orderItems[2].productVariant.product.cover || '/static/assets/no-image.jpg'}
                          alt=''
                        />
                      </div>
                    ) : (
                      <div className='flex justify-center items-center w-10 h-10 rounded-md ring-[3px] ring-white bg-secondary-200'>
                        +{order.orderItems.length - 2}
                      </div>
                    ))}
                </TableCell>
                <TableCell className='text-center'>
                  <div className='flex items-center justify-center space-x-2'>
                    <img
                      className='w-4 h-4'
                      src={
                        '/static/assets/icons/' + (order.deliveryMethod === 'pick-up' ? 'lavka.svg' : 'delivery.svg')
                      }
                      alt=''
                    />
                    <div>{dayjs(order.deliveredAt).format('DD.MM.YYYY')}</div>
                  </div>
                </TableCell>
                <TableCell className='text-center'>{numeral(order.total).format('$0,0.00')}</TableCell>
                <TableCell className='text-center'>{order.customers?.username}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
