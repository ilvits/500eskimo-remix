import { Card, CardContent } from '~/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useFetcher, useLoaderData } from '@remix-run/react';

import DashboardChart from '~/components/ui/custom/DashboardChart';
import { NumericFormat } from 'react-number-format';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import type { loader } from '~/routes/admin.dashboard';
import numeral from 'numeral';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);

export default function AdminDashboard() {
  const { orders, totalEarned, ordersTotalsCompleted, ordersTotalsActive, orderHits, messages, range, totalArray } =
    useLoaderData<typeof loader>();

  const fetcher = useFetcher();
  const setRange = (newRange: string) => {
    range !== newRange && fetcher.submit({ chart: newRange }, { method: 'post' });
  };

  return (
    <div className='flex flex-row w-full space-x-10'>
      <div className='w-4/5 space-y-10'>
        <section id='cards' className='flex flex-row justify-between space-x-4'>
          <Card className='w-full border-none bg-secondary-100'>
            <CardContent className='text-[#372400] py-6 px-4'>
              <div className='flex flex-row items-center justify-between space-x-2'>
                <div className='text-lg font-bold'>
                  <NumericFormat
                    displayType='text'
                    thousandSeparator=' '
                    decimalScale={0}
                    prefix={'$'}
                    value={totalEarned}
                  />
                </div>
                <div className='flex flex-row items-center space-x-1'>
                  <img className='rotate-180' src='/static/assets/icons/arrow_up.svg' alt='' />
                  <span>-67%</span>
                </div>
              </div>
              <p className='text-xs text-primary-brown'>Total earnings</p>
            </CardContent>
          </Card>
          <Card className='w-full border-none bg-secondary-100'>
            <CardContent className='text-[#372400] py-6 px-4'>
              <div className='flex flex-row items-center justify-between'>
                <div className='text-lg font-bold'>
                  <NumericFormat
                    displayType='text'
                    thousandSeparator=' '
                    decimalScale={0}
                    prefix={'$'}
                    value={ordersTotalsActive}
                  />
                </div>
                <div className='flex flex-row items-center space-x-1'>
                  <img className='rotate-180' src='/static/assets/icons/arrow_up.svg' alt='' />
                  <span>-2%</span>
                </div>
              </div>
              <p className='text-xs text-primary-brown'>Active orders</p>
            </CardContent>
          </Card>
          <Card className='w-full border-none bg-secondary-100'>
            <CardContent className='text-[#372400] py-6 px-4'>
              <div className='flex flex-row items-center justify-between'>
                <div className='text-lg font-bold'>
                  <NumericFormat
                    displayType='text'
                    thousandSeparator=' '
                    decimalScale={0}
                    prefix={'$'}
                    value={ordersTotalsCompleted}
                  />
                </div>
                <div className='flex flex-row items-center space-x-1'>
                  <img src='/static/assets/icons/arrow_up.svg' alt='' />
                  <span>8%</span>
                </div>
              </div>
              <p className='text-xs text-primary-brown'>Completed orders</p>
            </CardContent>
          </Card>
        </section>
        <section id='chart' className='flex flex-col w-full space-y-6'>
          <div className='flex flex-row items-center justify-between w-full'>
            <div className='text-xl font-semibold'>Total earnings in the last 6 {range}s</div>
            <Tabs defaultValue='month' className=''>
              <TabsList className='bg-white border rounded-full border-secondary-200'>
                <button type='button' onClick={() => setRange('week')}>
                  <TabsTrigger
                    className='rounded-full data-[state=active]:text-[#372400] text-secondary-500 data-[state=active]:bg-secondary-200 px-5'
                    value='week'
                    data-state={range === 'week' ? 'active' : ''}
                  >
                    Weeks
                  </TabsTrigger>
                </button>
                <button type='button' onClick={() => setRange('month')}>
                  <TabsTrigger
                    className='rounded-full data-[state=active]:text-[#372400] text-secondary-500 data-[state=active]:bg-secondary-200 px-5'
                    value='month'
                    data-state={range === 'month' ? 'active' : ''}
                  >
                    Months
                  </TabsTrigger>
                </button>
                <button type='button' onClick={() => setRange('year')}>
                  <TabsTrigger
                    className='rounded-full data-[state=active]:text-[#372400] text-secondary-500 data-[state=active]:bg-secondary-200 px-5'
                    value='year'
                    data-state={range === 'year' ? 'active' : ''}
                  >
                    Years
                  </TabsTrigger>
                </button>
              </TabsList>
            </Tabs>
          </div>
          <div className='w-full h-96'>
            {fetcher.state !== 'idle' ? (
              <div className='flex flex-row justify-center'>loading...</div>
            ) : (
              <DashboardChart chartData={totalArray} />
            )}
          </div>
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
      <div className='flex flex-col w-2/6 pr-12 space-y-10'>
        <section id='sales_hits'>
          <h1 className='mb-2 text-xl font-extrabold'>Sale Hits</h1>
          {orderHits.map((product, index) => (
            <Card key={index} className='border-0 shadow-none'>
              <CardContent className='text-[#372400] py-4 px-0'>
                <div className='flex flex-row items-center space-x-4'>
                  <img
                    className='w-12 h-12 rounded-sm shrink-0'
                    src={product.product.cover || '/static/assets/no-image.jpg'}
                    alt=''
                  />
                  <div className='flex flex-col grow'>
                    <div className='text-xs font-normal text-secondary-500'>{product.product.category.name}</div>
                    <div className='flex flex-row items-center space-x-1 text-sm font-semibold'>
                      {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
                    </div>
                    <div className='text-xs font-bold'>
                      {numeral(product.price).format('$0,0.00')} / <span className='text-secondary-500'>250 g.</span>
                    </div>
                  </div>
                  <div className='flex flex-col space-y-1 text-sm text-right'>
                    <div className='font-semibold'>
                      <NumericFormat
                        displayType='text'
                        thousandSeparator=' '
                        decimalScale={0}
                        prefix={'$'}
                        value={product.price}
                      />
                    </div>
                    <div>x {product._count.orderItems}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        <section id='last_messages'>
          <h1 className='mb-2 text-xl font-extrabold'>Last messages </h1>
          {messages.map((message, index) => (
            <Card key={index} className='border-0 shadow-none'>
              <CardContent className='text-[#372400] py-4 px-0'>
                <div className='text-xs text-secondary-500'>{dayjs(message.createdAt).format('DD MMM YYYY')}</div>
                <div className='flex flex-row items-center space-x-1 text-sm font-bold'>{message.name}</div>
                <div className='text-sm font-medium'>
                  {message.phone}, {message.email}
                </div>
                <div className='text-sm font-bold text-secondary-500 line-clamp-2'>{message.body}</div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////////
//  NESTED REDUCE
/////////////////////////////////////////////////////////////////////////////////
// for (let i = dayjs().subtract(5, range); i < dayjs(); i = i.add(1, range)) {
//   totalArray.push({
//     date: [i.format(format).toLocaleUpperCase() + (range === 'week' ? ' Week' : '')],
//     totalPrice: ordersRange.reduce((acc, order) => {
//       if (dayjs(order.createdAt).isSame(i, range)) {
//         acc += order.orderItems.reduce((acc, orderItem) => {
//           return acc + Number(orderItem.price) * orderItem.quantity;
//         }, 0);
//       }
//       return acc;
//     }, 0),
//   });
// }
////////////////////////////////////////////////////////////////////////////////////
