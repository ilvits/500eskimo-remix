import { NavLink, useLoaderData } from '@remix-run/react';

import type { loader } from '~/routes/admin';
import numeral from 'numeral';

export function AdminSidebar() {
  const { ordersCount, messagesCount, totalCategories, totalProducts } = useLoaderData<typeof loader>();
  const ordersCountFormatted = numeral(ordersCount).format('0.a');
  const messagesCountFormatted = numeral(messagesCount).format('0.a');
  const totalCategoriesFormatted = numeral(totalCategories).format('0a');
  const totalProductsFormatted = numeral(totalProducts).format('0a');

  return (
    <div className='bg-white'>
      <nav id='sidebar' className='w-[240px] pr-8 flex flex-col space-y-1'>
        <NavLink
          to='dashboard'
          className='flex items-center space-x-2.5 px-2 py-2.5 rounded-lg [&.active]:bg-secondary-50'
        >
          <img className='w-6 h-6' src='/static/assets/icons/menu/icecream.svg' alt='' />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to='products'
          className='flex items-center justify-between px-2 py-2.5 rounded-lg [&.pending]:bg-secondary-50 [&.active]:bg-secondary-50'
        >
          <div className='flex items-center space-x-2.5'>
            <img className='w-6 h-6' src='/static/assets/icons/menu/catalog.svg' alt='' />
            <span>Catalog</span>
          </div>
          {totalCategories > 0 ? (
            <div className='flex items-center justify-center w-4 h-4 font-semibold'>{totalProductsFormatted}</div>
          ) : null}
        </NavLink>
        <NavLink
          to='categories'
          className='flex items-center justify-between px-2 py-2.5 rounded-lg [&.pending]:bg-secondary-50 [&.active]:bg-secondary-50'
        >
          <div className='flex items-center space-x-2.5'>
            <img className='w-6 h-6' src='/static/assets/icons/menu/cube.svg' alt='' />
            <span>Categories</span>
          </div>
          {totalCategories > 0 ? (
            <div className='flex items-center justify-center w-4 h-4 font-semibold'>{totalCategoriesFormatted}</div>
          ) : null}
        </NavLink>
        <NavLink
          to='sorts'
          className='flex items-center justify-between px-2 py-2.5 rounded-lg [&.pending]:bg-secondary-50 [&.active]:bg-secondary-50'
        >
          <div className='flex items-center space-x-2.5'>
            <img className='w-6 h-6' src='/static/assets/icons/menu/strawberry.svg' alt='' />
            <span>Sorts</span>
          </div>
          {ordersCount > 0 ? <div className='flex items-center justify-center w-4 h-4 font-semibold'>10</div> : null}
        </NavLink>
        <NavLink
          to='decorations'
          className='flex items-center justify-between px-2 py-2.5 rounded-lg [&.pending]:bg-secondary-50 [&.active]:bg-secondary-50'
        >
          <div className='flex items-center space-x-2.5'>
            <img className='w-6 h-6' src='/static/assets/icons/menu/flower.svg' alt='' />
            <span>Decorations</span>
          </div>
          {ordersCount > 0 ? <div className='flex items-center justify-center w-4 h-4 font-semibold'>12</div> : null}
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
            <div className='flex items-center justify-center w-4 h-4 font-semibold'>{ordersCountFormatted}</div>
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
            <div className='flex items-center justify-center w-4 h-4 font-semibold'>{messagesCountFormatted}</div>
          ) : null}
        </NavLink>
      </nav>
    </div>
  );
}
