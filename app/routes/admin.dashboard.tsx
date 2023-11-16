import { type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from '@remix-run/node';
import dayjs, { type ManipulateType } from 'dayjs';
import {
  getAllOrdersOnlyTotalsByDateRange,
  getAllOrdersTotal,
  getOrderHits,
  getOrders,
  getOrdersTotalByStatus,
} from '~/services/orders.server';

import AdminDashboard from '~/features/admin/DashboardLayout';
import invariant from 'tiny-invariant';
import { getMessages } from '~/services/messages.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // await new Promise(resolve => setTimeout(resolve, 1000));
  const url = new URL(request.url);
  const chart = url.searchParams.get('chart') ? (url.searchParams.get('chart') as ManipulateType) : 'week';
  const endDate = dayjs().toDate();
  const startDate = dayjs()
    .subtract(6, chart?.toString() as ManipulateType)
    .toDate();

  const orders = await getOrders();
  const ordersTotals = await getAllOrdersOnlyTotalsByDateRange(startDate, endDate);
  const totalEarned = await getAllOrdersTotal();
  const ordersTotalsCompleted = await getOrdersTotalByStatus('completed');
  const ordersTotalsActive = await getOrdersTotalByStatus('processing');
  const orderHits = await getOrderHits();
  const messages = await getMessages();
  invariant(orders, 'orders not found');
  invariant(totalEarned, 'total not found');
  invariant(ordersTotals, 'ordersTotals not found');
  invariant(ordersTotalsActive, 'ordersTotalsActive not found');
  invariant(ordersTotalsCompleted, 'ordersTotalsCompleted not found');
  invariant(orderHits, 'orderHits not found');
  invariant(messages, 'messages not found');

  return {
    orders,
    totalEarned,
    ordersTotalsCompleted,
    ordersTotals,
    ordersTotalsActive,
    orderHits,
    messages,
  };
}
export default function Dashboard() {
  return (
    <>
      <AdminDashboard />
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const chart = formData.get('chart');
  return redirect(`?chart=${chart}`);
}
