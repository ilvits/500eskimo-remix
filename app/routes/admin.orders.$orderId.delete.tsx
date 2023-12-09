import type { ActionFunctionArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { redirect } from '@remix-run/node';

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.categoryId, 'Missing categoryId param');
  await deleteOrder(Number(params.orderId));
  return redirect('/admin/orders');
};
