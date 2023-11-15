import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';

import { AdminSidebar } from '~/features/admin/AdminSidebar';
import { Outlet } from '@remix-run/react';
import { authenticator } from '~/auth/authenticator.server';
import { getAllOrdersCount } from '~/services/orders.server';
import { totalMessages } from '~/services/messages.server';

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Pages' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/sign-in',
  });
  const ordersCount = await getAllOrdersCount();
  const messagesCount = await totalMessages();
  return { ordersCount, messagesCount };
};

export default function Admin() {
  return (
    <main id='admin' className='flex flex-row'>
      <AdminSidebar />
      <section className='ml-[260px] w-full'>
        <Outlet />
      </section>
    </main>
  );
}
