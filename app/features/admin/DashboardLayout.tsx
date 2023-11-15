import { Card, CardContent } from '~/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import dayjs, { type ManipulateType } from 'dayjs';
import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react';

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

  const { orders, totalEarned, ordersTotals } = useLoaderData<typeof loader>();
  const range = (searchParams.get('chart') as ManipulateType) || 'month';

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

  console.log('total(dl): ', totalArray);
  const fetcher = useFetcher();
  const setRange = (newRange: string) => {
    range !== newRange && fetcher.submit({ chart: newRange }, { method: 'post' });
  };
  console.log('orders: ', orders);

  return (
    <div className='flex flex-row w-full space-x-10'>
      <div className='w-3/5 space-y-10'>
        <section id='cards' className='flex flex-row space-x-4 justify-between'>
          <Card className='bg-[#F8E9CC] border-none w-full'>
            <CardContent className='text-[#372400] py-6 px-4'>
              <div className='flex flex-row justify-between items-center space-x-2'>
                <div className='text-lg font-bold'>${totalEarned}</div>
                <div className='flex flex-row space-x-1 items-center'>
                  <img src='/static/assets/icons/arrow_up.svg' alt='' />
                  <span>20%</span>
                </div>
              </div>
              <p className='text-xs text-[#4A2502]'>Total earnings</p>
            </CardContent>
          </Card>
          <Card className='bg-[#F8E9CC] border-none w-full'>
            <CardContent className='text-[#372400] py-6 px-4'>
              <div className='flex flex-row justify-between items-center'>
                <div className='text-lg font-bold'>$45,231.89</div>
                <div className='flex flex-row space-x-1 items-center'>
                  <img src='/static/assets/icons/arrow_up.svg' alt='' />
                  <span>20%</span>
                </div>
              </div>
              <p className='text-xs text-[#4A2502]'>Total earnings</p>
            </CardContent>
          </Card>
          <Card className='bg-[#F8E9CC] border-none w-full'>
            <CardContent className='text-[#372400] py-6 px-4'>
              <div className='flex flex-row justify-between items-center'>
                <div className='text-lg font-bold'>$45,231.89</div>
                <div className='flex flex-row space-x-1 items-center'>
                  <img src='/static/assets/icons/arrow_up.svg' alt='' />
                  <span>20%</span>
                </div>
              </div>
              <p className='text-xs text-[#4A2502]'>Total earnings</p>
            </CardContent>
          </Card>
        </section>
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
        <Table className='border border-[#F8E9CC]'>
          <TableHeader>
            <TableRow className='bg-[#FFFBF2] [&>th]:text-[#A59280] [&>th]:font-semibold border-[#F8E9CC]'>
              <TableHead className='w-16'>№</TableHead>
              <TableHead className='w-28'>Status</TableHead>
              <TableHead className='min-w-fit max-w-fit'>Products</TableHead>
              <TableHead className='text-center'>Delivered</TableHead>
              <TableHead className='text-center'>Total</TableHead>
              <TableHead className='rounded-tr-sm text-center'>Customer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id} className='border-[#F8E9CC]'>
                <TableCell className='w-16'>{order.id}</TableCell>
                <TableCell className=''>{order.status}</TableCell>
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
                <TableCell className='text-center'>{order.orderItems.length}</TableCell>
                <TableCell className='text-center'>${order.total}</TableCell>
                <TableCell className='text-center'>{order.user.username}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='w-2/5'>Hits</div>
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
