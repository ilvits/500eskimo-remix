import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';

import { AdminSidebar } from '~/features/admin/AdminSidebar';
import { Outlet } from '@remix-run/react';
import { authenticator } from '~/auth/authenticator.server';
import { getAllOrdersCount } from '~/services/orders.server';
import { getMessagesCount } from '~/services/messages.server';
import { getTotalCategories, getTotalProducts } from '~/services/products.server';
// import { getAllOrdersCount } from '~/services/orders.server';
// import { totalMessages } from '~/services/messages.server';

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Pages' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/sign-in',
  });
  const ordersCount = await getAllOrdersCount();
  // console.log('ordersCount: ', ordersCount);

  const messagesCount = await getMessagesCount();
  // console.log('messagesCount: ', messagesCount);

  const totalCategories = await getTotalCategories();
  // console.log('totalCategories: ', totalCategories);

  const totalProducts = await getTotalProducts();

  return { ordersCount, messagesCount, totalCategories, totalProducts };
};

export default function ProtectedLayout() {
  return (
    <main id='admin' className='flex flex-row mb-12 max-w-[1440px] w-full mx-auto px-16'>
      <AdminSidebar />
      <section className='w-full'>
        <Outlet />
      </section>
    </main>
  );
}
