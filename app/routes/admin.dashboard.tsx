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

export async function loader({ request }: LoaderFunctionArgs) {
  // await new Promise(resolve => setTimeout(resolve, 1000));
  const url = new URL(request.url);
  const chart = url.searchParams.get('chart') ? (url.searchParams.get('chart') as ManipulateType) : 'week';
  const endDate = dayjs().toDate();
  const startDate = dayjs()
    .subtract(6, chart?.toString() as ManipulateType)
    .toDate();
  const orders = await getOrders();
  const totalEarned = await getAllOrdersTotal();
  const ordersTotals = await getAllOrdersOnlyTotalsByDateRange(startDate, endDate);

  const ordersTotalsCompleted = await getOrdersTotalByStatus('closed');
  const ordersTotalsActive = await getOrdersTotalByStatus('processing');
  const orderHits = await getOrderHits();
  const messages = await getMessages(4);

  return json({
    orders,
    totalEarned,
    ordersTotalsCompleted,
    ordersTotals,
    ordersTotalsActive,
    orderHits,
    messages,
  });
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
