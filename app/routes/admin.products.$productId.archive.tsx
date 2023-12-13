import { redirect, type ActionFunctionArgs } from '@remix-run/node';
import { changeProductStatus } from '~/services/products.server';
import invariant from 'tiny-invariant';

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.productId, 'Missing categoryId param');
  try {
    await changeProductStatus(Number(params.productId), 'ARCHIVED');
  } catch (error) {
    console.log(error);
    throw error;
  }
  return redirect('/admin/products');
};
