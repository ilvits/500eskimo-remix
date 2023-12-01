import type { ActionFunctionArgs } from '@remix-run/node';
import { deleteUser } from 'tmp/services_old/account.server';
import invariant from 'tiny-invariant';
import { redirect } from '@remix-run/node';

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.userId, 'Missing contactId param');
  await deleteUser(Number(params.userId));
  return redirect('/admin/users');
};
