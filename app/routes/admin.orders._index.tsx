import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/custom/dropdown-menu';
import { Form, useLoaderData, useSearchParams } from '@remix-run/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';

import type { LoaderFunctionArgs } from '@remix-run/node';
import { PaginationBar } from '~/components/ui/custom/PaginationBar';
import { PiCaretDownBold } from 'react-icons/pi/index.js';
import dayjs from 'dayjs';
import { getAllOrders } from '~/services/orders.server';
import { json } from '@remix-run/node';
import numeral from 'numeral';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const status = searchParams.get('status') || 'all';
  const orderBy = searchParams.get('orderBy') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  const $top = searchParams.get('$top') || '10';
  const $skip = searchParams.get('$skip') || '0';

  const { orders, groupOrders, total } = await getAllOrders(status, orderBy, order, $top, $skip);
  return json({ orders, groupOrders, total, status, $top });
};
export default function AdminOrders() {
  const { orders, groupOrders, total, status, $top } = useLoaderData<typeof loader>();
  const productsOnPageOptions = ['10', '25', '50', '100'];

  const [searchParams] = useSearchParams();
  const existingParams = Array.from(searchParams.entries());

  const setStatus = (status: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('status', status);
    searchParams.set('$top', $top);
    window.location.search = searchParams.toString();
  };

  const handleOrderBy = (orderBy: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.get('orderBy') ? searchParams.set('orderBy', orderBy) : searchParams.append('orderBy', orderBy);
    searchParams.get('order')
      ? searchParams.get('order') === 'asc'
        ? searchParams.set('order', 'desc')
        : searchParams.set('order', 'asc')
      : searchParams.append('order', 'asc');
    window.location.search = searchParams.toString();
  };

  return (
    <div className='flex flex-col space-y-6'>
      <h1 className='text-3xl font-bold'>Orders</h1>
      <section id='filters' className='flex space-x-2.5'>
        <Tabs defaultValue='active' className=''>
          <TabsList>
            <TabsTrigger
              value='All'
              data-state={status === 'all' ? 'active' : ''}
              className='px-6 py-1.5 border border-primary-brown text-primary-brown data-[state=active]:bg-secondary-100 data-[state=active]:text-primary-brown data-[state=active]:border-secondary-100'
              onClick={() => setStatus('all')}
            >
              All ({numeral(total).format('(0,0.00a)')})
            </TabsTrigger>
            <TabsTrigger
              value='active'
              data-state={status === 'active' ? 'active' : ''}
              className='px-6 py-1.5 border border-primary-brown text-primary-brown data-[state=active]:bg-secondary-100 data-[state=active]:text-primary-brown data-[state=active]:border-secondary-100'
              onClick={() => setStatus('active')}
            >
              Active (
              {numeral(groupOrders.filter(group => group.status !== 'closed').reduce((a, b) => a + b.count, 0)).format(
                '(0,0.00a)'
              )}
              )
            </TabsTrigger>
            <TabsTrigger
              value='pending'
              data-state={status === 'pending' ? 'active' : ''}
              className='px-6 py-1.5 border border-primary-brown text-primary-brown data-[state=active]:bg-secondary-100 data-[state=active]:text-primary-brown data-[state=active]:border-secondary-100'
              onClick={() => setStatus('pending')}
            >
              Pending ({numeral(groupOrders.find(group => group.status === 'pending')?.count || 0).format('(0,0.00a)')})
            </TabsTrigger>
            <TabsTrigger
              value='delivering'
              data-state={status === 'delivering' ? 'active' : ''}
              className='px-6 py-1.5 border border-primary-brown text-primary-brown data-[state=active]:bg-secondary-100 data-[state=active]:text-primary-brown data-[state=active]:border-secondary-100'
              onClick={() => setStatus('delivering')}
            >
              Delivering (
              {numeral(groupOrders.find(group => group.status === 'delivering')?.count || 0).format('(0,0.00a)')})
            </TabsTrigger>
            <TabsTrigger
              value='closed'
              data-state={status === 'closed' ? 'active' : ''}
              className='px-6 py-1.5 border border-primary-brown text-primary-brown data-[state=active]:bg-secondary-100 data-[state=active]:text-primary-brown data-[state=active]:border-secondary-100'
              onClick={() => setStatus('closed')}
            >
              Closed ({numeral(groupOrders.find(group => group.status === 'closed')?.count || 0).format('(0,0.00a)')})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>
      <section id='products' className='w-full border rounded-t-xl border-secondary-100'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-secondary-50 bg-secondary-50 [&>th]:text-secondary-500 [&>th]:font-semibold border-secondary-100'>
              <TableHead className='w-16 cursor-pointer rounded-tl-xl' onClick={() => handleOrderBy('id')}>
                №
              </TableHead>
              <TableHead className='w-28'>Status</TableHead>
              <TableHead className='min-w-fit max-w-fit'>Products</TableHead>
              <TableHead className='text-center cursor-pointer' onClick={() => handleOrderBy('deliveredAt')}>
                Delivered
              </TableHead>
              <TableHead className='text-center cursor-pointer' onClick={() => handleOrderBy('total')}>
                Total
              </TableHead>
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
      {orders.length > 0 && (
        <section id='pagination' className='flex justify-between my-12 text-xs font-medium'>
          <PaginationBar total={total} />
          <div className='flex items-center space-x-2'>
            <div>Products per page: </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='min-w-[32px] min-h-[32px] px-2 rounded-md bg-secondary-50 border border-secondary-100 flex justify-center items-center space-x-2 text-sm font-normal'>
                  <span>{$top}</span>
                  <PiCaretDownBold />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='min-w-[54px] rounded-md shadow-none bg-secondary-50 border border-secondary-100'
              >
                {productsOnPageOptions.map((value, index) => {
                  return (
                    <Form method='get' preventScrollReset key={index}>
                      <>
                        {[
                          ['$skip', '0'],
                          ['$top', value],
                          ...existingParams.filter(([key]) => key !== '$skip' && key !== '$top'),
                        ].map(([key, value]) => {
                          return <input key={key} type='hidden' name={key} value={value} />;
                        })}
                      </>
                      <button className='w-full' type='submit'>
                        <DropdownMenuItem className='focus:bg-secondary-100 text-primary-brown focus:text-primary-brown'>
                          {value}
                        </DropdownMenuItem>
                      </button>
                    </Form>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>
      )}
    </div>
  );
}
