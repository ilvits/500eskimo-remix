import { redirect, type ActionFunctionArgs } from '@remix-run/node';
import { deleteProduct } from '~/services/products.server';
import invariant from 'tiny-invariant';

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.productId, 'Missing categoryId param');
  try {
    await deleteProduct(Number(params.productId));
  } catch (error) {
    console.log(error);
    throw error;
  }
  return redirect('/admin/products');
};
