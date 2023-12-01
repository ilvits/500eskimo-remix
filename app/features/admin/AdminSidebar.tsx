import { NavLink, useLoaderData } from '@remix-run/react';

import type { loader } from '~/routes/admin';

export function AdminSidebar() {
  const { ordersCount, messagesCount } = useLoaderData<typeof loader>();

  return (
    <div className='bg-white'>
      <nav id='sidebar' className='w-[188px] pr-8 flex flex-col space-y-1'>
        <NavLink
          to='dashboard'
          className='flex items-center space-x-2.5 px-2 py-2.5 rounded-lg [&.active]:bg-secondary-50'
        >
          <img className='w-6 h-6' src='/static/assets/icons/menu/icecream.svg' alt='' />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to='products'
          className='flex items-center space-x-2.5 px-2 py-2.5 rounded-lg [&.active]:bg-secondary-50'
        >
          <img className='w-6 h-6' src='/static/assets/icons/menu/catalog.svg' alt='' />
          <span>Catalog</span>
        </NavLink>
        <NavLink
          to='orders'
          className='flex items-center justify-between px-2 py-2.5 rounded-lg [&.pending]:bg-secondary-50 [&.active]:bg-secondary-50'
        >
          <div className='flex items-center space-x-2.5'>
            <img className='w-6 h-6' src='/static/assets/icons/menu/bag.svg' alt='' />
            <span>Orders</span>
          </div>
          {ordersCount > 0 ? (
            <div className='w-4 h-4 flex items-center justify-center font-semibold'>{ordersCount}</div>
          ) : null}
        </NavLink>
        <NavLink
          to='messages'
          className='flex items-center justify-between px-2 py-2.5 rounded-lg [&.active]:bg-secondary-50'
        >
          <div className='flex items-center space-x-2.5'>
            <img className='w-6 h-6' src='/static/assets/icons/menu/mail.svg' alt='' />
            <span>Messages</span>
          </div>
          {messagesCount > 0 ? (
            <div className='w-4 h-4 flex items-center justify-center font-semibold'>{messagesCount}</div>
          ) : null}
        </NavLink>
      </nav>
    </div>
  );
}
