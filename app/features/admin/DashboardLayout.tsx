import { Card, CardContent } from '~/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import dayjs, { type ManipulateType } from 'dayjs';
import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react';
import { NumericFormat } from 'react-number-format';
import DashboardChart from '~/components/ui/custom/DashboardChart';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import type { loader } from '~/routes/admin.dashboard';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);

export default function AdminDashboard() {
  const [searchParams] = useSearchParams();

  const { orders, totalEarned, ordersTotals, ordersTotalsCompleted, ordersTotalsActive, orderHits, messages } =
    useLoaderData<typeof loader>();
  const range = (searchParams.get('chart') as ManipulateType) || 'week';
  // console.log('totalEarned: ', totalEarned);
  // console.log('ordersTotalsCompleted: ', ordersTotalsCompleted);
  // console.log('activeOrdersEarned: ', ordersTotalsActive);
  console.log('orderHits: ', orderHits);

  let format = 'MMM';
  switch (range) {
    case 'week':
      format = 'w';
      break;
    case 'month':
      format = 'MMM';
      break;
    case 'year':
      format = 'YYYY';
      break;
    default:
      format = 'MMM';
      break;
  }

  let totalArray = [];
  for (let i = dayjs().subtract(5, range); i < dayjs(); i = i.add(1, range)) {
    totalArray.push({
      date: [i.format(format).toLocaleUpperCase() + (range === 'week' ? ' Week' : '')],
      totalPrice: ordersTotals.reduce((acc, orders) => {
        if (dayjs(orders.createdAt).isSame(i, range)) {
          acc += Number(orders.total);
        }
        return acc;
      }, 0),
    });
  }

  // console.log('total(dl): ', totalArray);
  const fetcher = useFetcher();
  const setRange = (newRange: string) => {
    range !== newRange && fetcher.submit({ chart: newRange }, { method: 'post' });
  };

  return (
    <div className='flex flex-row w-full space-x-10'>
      <div className='w-4/5 space-y-10'>
        <section id='cards' className='flex flex-row space-x-4 justify-between'>
          <Card className='bg-[#F8E9CC] border-none w-full'>
            <CardContent className='text-[#372400] py-6 px-4'>
              <div className='flex flex-row justify-between items-center space-x-2'>
                <div className='text-lg font-bold'>
                  <NumericFormat
                    displayType='text'
                    thousandSeparator=' '
                    decimalScale={0}
                    prefix={'$'}
                    value={totalEarned}
                  />
                </div>
                <div className='flex flex-row space-x-1 items-center'>
                  <img className='rotate-180' src='/static/assets/icons/arrow_up.svg' alt='' />
                  <span>-67%</span>
                </div>
              </div>
              <p className='text-xs text-[#4A2502]'>Total earnings</p>
            </CardContent>
          </Card>
          <Card className='bg-[#F8E9CC] border-none w-full'>
            <CardContent className='text-[#372400] py-6 px-4'>
              <div className='flex flex-row justify-between items-center'>
                <div className='text-lg font-bold'>
                  <NumericFormat
                    displayType='text'
                    thousandSeparator=' '
                    decimalScale={0}
                    prefix={'$'}
                    value={ordersTotalsActive}
                  />
                </div>
                <div className='flex flex-row space-x-1 items-center'>
                  <img className='rotate-180' src='/static/assets/icons/arrow_up.svg' alt='' />
                  <span>-2%</span>
                </div>
              </div>
              <p className='text-xs text-[#4A2502]'>Active orders</p>
            </CardContent>
          </Card>
          <Card className='bg-[#F8E9CC] border-none w-full'>
            <CardContent className='text-[#372400] py-6 px-4'>
              <div className='flex flex-row justify-between items-center'>
                <div className='text-lg font-bold'>
                  <NumericFormat
                    displayType='text'
                    thousandSeparator=' '
                    decimalScale={0}
                    prefix={'$'}
                    value={ordersTotalsCompleted}
                  />
                </div>
                <div className='flex flex-row space-x-1 items-center'>
                  <img src='/static/assets/icons/arrow_up.svg' alt='' />
                  <span>8%</span>
                </div>
              </div>
              <p className='text-xs text-[#4A2502]'>Completed orders</p>
            </CardContent>
          </Card>
        </section>
        <section id='chart' className='w-full flex flex-col space-y-6'>
          <div className='flex flex-row justify-between items-center w-full'>
            <div className='text-xl font-semibold'>Total earnings in the last 6 {range}s</div>
            <Tabs defaultValue='month' className=''>
              <TabsList className='border border-[#F0D399] rounded-full bg-white'>
                <button type='button' onClick={() => setRange('week')}>
                  <TabsTrigger
                    className='rounded-full data-[state=active]:text-[#372400] text-[#A59280] data-[state=active]:bg-[#F0D399] px-5'
                    value='week'
                    data-state={range === 'week' ? 'active' : ''}
                  >
                    Weeks
                  </TabsTrigger>
                </button>
                <button type='button' onClick={() => setRange('month')}>
                  <TabsTrigger
                    className='rounded-full data-[state=active]:text-[#372400] text-[#A59280] data-[state=active]:bg-[#F0D399] px-5'
                    value='month'
                    data-state={range === 'month' ? 'active' : ''}
                  >
                    Months
                  </TabsTrigger>
                </button>
                <button type='button' onClick={() => setRange('year')}>
                  <TabsTrigger
                    className='rounded-full data-[state=active]:text-[#372400] text-[#A59280] data-[state=active]:bg-[#F0D399] px-5'
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
        <section id='last_orders' className='w-full rounded-t-xl border border-[#F8E9CC]'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-[#FFFBF2] bg-[#FFFBF2] [&>th]:text-[#A59280] [&>th]:font-semibold border-[#F8E9CC]'>
                <TableHead className='w-16 rounded-tl-xl'>№</TableHead>
                <TableHead className='w-28'>Status</TableHead>
                <TableHead className='min-w-fit max-w-fit'>Products</TableHead>
                <TableHead className='text-center'>Delivered</TableHead>
                <TableHead className='text-center'>Total</TableHead>
                <TableHead className='rounded-tr-xl text-center'>Customer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id} className='border-[#F8E9CC] hover:bg-[#fffdf8]'>
                  <TableCell className='w-16'>{order.id}</TableCell>
                  <TableCell className=''>
                    <div className='flex flex-row space-x-2 items-center'>
                      <div
                        className={`${
                          order.status === 'delivered' || order.status === 'completed'
                            ? 'bg-green-500'
                            : order.status === 'delivering' ||
                              order.status === 'processing' ||
                              order.status === 'pending' ||
                              order.status === 'payment received'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        } w-2 h-2 rounded-full shrink-0`}
                      ></div>
                      <div>{order.status}</div>
                    </div>
                  </TableCell>
                  <TableCell className='flex -space-x-1 overflow-hidden min-w-fit max-w-fit'>
                    {order.orderItems.slice(0, 2).map(item => (
                      <div key={item.id}>
                        <img className='w-10 h-10 rounded-md ring-[3px] ring-white' src={item.product.image} alt='' />
                      </div>
                    ))}
                    {order.orderItems.length >= 3 &&
                      (order.orderItems.length === 3 ? (
                        <div key={order.orderItems[2].id}>
                          <img
                            className='w-10 h-10 rounded-md ring-[3px] ring-white'
                            src={order.orderItems[2].product.image}
                            alt=''
                          />
                        </div>
                      ) : (
                        <div className='flex justify-center items-center w-10 h-10 rounded-md ring-[3px] ring-white bg-[#F0D399]'>
                          +{order.orderItems.length - 2}
                        </div>
                      ))}
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className='flex justify-center items-center space-x-2'>
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
                  <TableCell className='text-center'>${order.total}</TableCell>
                  <TableCell className='text-center'>{order.user.username}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
      <div className='w-2/6 pr-12 flex flex-col space-y-10'>
        <section id='sales_hits'>
          <h1 className='text-xl font-extrabold mb-2'>Sale Hits</h1>
          {orderHits.map((product, index) => (
            <Card key={index} className='border-0 shadow-none'>
              <CardContent className='text-[#372400] py-4 px-0'>
                <div className='flex flex-row space-x-4 items-center'>
                  <img className='w-12 h-12 rounded-sm' src={product.image} alt='' />
                  <div className='flex flex-col grow'>
                    <div className='text-xs font-normal  text-[#A59280]'>{product.category.name}</div>
                    <div className='text-sm font-semibold flex flex-row space-x-1 items-center'>
                      {product.title.charAt(0).toUpperCase() + product.title.slice(1)}
                    </div>
                    <div className='text-xs font-bold'>
                      ${product.price} / <span className='text-[#A59280]'>250 g.</span>
                    </div>
                  </div>
                  <div className='flex flex-col space-y-1 text-right text-sm'>
                    <div className='font-semibold'>
                      <NumericFormat
                        displayType='text'
                        thousandSeparator=' '
                        decimalScale={0}
                        prefix={'$'}
                        value={product.price}
                      />
                    </div>
                    <div>x {product.hits}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        <section id='last_messages'>
          <h1 className='text-xl font-extrabold mb-2'>Last messages </h1>
          {messages.map((message, index) => (
            <Card key={index} className='border-0 shadow-none'>
              <CardContent className='text-[#372400] py-4 px-0'>
                <div className='text-xs text-[#A59280]'>{dayjs(message.createdAt).format('DD MMM YYYY')}</div>
                <div className='text-sm font-bold flex flex-row space-x-1 items-center'>{message.name}</div>
                <div className='text-sm font-medium'>
                  {message.phone}, {message.email}
                </div>
                <div className='text-sm font-bold text-[#A59280] line-clamp-2'>{message.body}</div>
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
