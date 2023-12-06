import { type ActionFunctionArgs, type LoaderFunctionArgs, redirect, json } from '@remix-run/node';

import dayjs, { type ManipulateType } from 'dayjs';

import AdminDashboard from '~/features/admin/DashboardLayout';
import { getMessages } from '~/services/messages.server';
import {
  getAllOrdersOnlyTotalsByDateRange,
  getAllOrdersTotal,
  getOrderHits,
  getOrders,
  getOrdersTotalByStatus,
} from '~/services/orders.server';

const reduceTotals = async (ordersTotals: any, range: ManipulateType, format: string) => {
  let totalArray = [];
  for (let i = dayjs().subtract(5, range); i < dayjs(); i = i.add(1, range)) {
    totalArray.push({
      date: [i.format(format).toLocaleUpperCase() + (range === 'week' ? ' Week' : '')],
      totalPrice: ordersTotals.reduce((acc: number, orders: any) => {
        if (dayjs(orders.createdAt).isSame(i, range)) {
          acc += Number(orders.total);
        }
        return acc;
      }, 0),
    });
  }

  return totalArray;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const range = url.searchParams.get('chart') ? (url.searchParams.get('chart') as ManipulateType) : 'week';
  const endDate = dayjs().toDate();
  const startDate = dayjs()
    .subtract(6, range?.toString() as ManipulateType)
    .toDate();
  const orders = await getOrders();
  const totalEarned = await getAllOrdersTotal();
  const ordersTotals = await getAllOrdersOnlyTotalsByDateRange(startDate, endDate);

  const ordersTotalsCompleted = await getOrdersTotalByStatus('closed');
  const ordersTotalsActive = await getOrdersTotalByStatus('processing');
  const orderHits = await getOrderHits();
  const messages = await getMessages(4);
  // console.log('orders', orders);

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

  const totalArray = await reduceTotals(ordersTotals, range, format);

  return json({
    orders,
    totalEarned,
    ordersTotalsCompleted,
    ordersTotals,
    ordersTotalsActive,
    orderHits,
    messages,
    totalArray,
    range,
  });
}

export default function Dashboard() {
  return <AdminDashboard />;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const chart = formData.get('chart');
  return redirect(`?chart=${chart}`);
}
