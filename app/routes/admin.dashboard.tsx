import { type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from '@remix-run/node';
import dayjs, { type ManipulateType } from 'dayjs';
import { getAllOrdersOnlyTotalsByDateRange, getAllOrdersTotal, getOrders } from '~/services/orders.server';

import AdminDashboard from '~/features/admin/DashboardLayout';
import invariant from 'tiny-invariant';

export async function loader({ request }: LoaderFunctionArgs) {
  // await new Promise(resolve => setTimeout(resolve, 1000));
  const url = new URL(request.url);
  const chart = url.searchParams.get('chart') || 'month';
  const endDate = dayjs().toDate();
  const startDate = dayjs()
    .subtract(6, chart?.toString() as ManipulateType)
    .toDate();

  const orders = await getOrders(8);
  invariant(orders, 'orders not found');
  const totalEarned = await getAllOrdersTotal();
  invariant(totalEarned, 'total not found');
  const ordersTotals = await getAllOrdersOnlyTotalsByDateRange(startDate, endDate);
  invariant(ordersTotals, 'ordersTotals not found');
  return { orders, totalEarned, ordersTotals };
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
