import { Link, NavLink, useLoaderData } from '@remix-run/react';

import type { loader } from '~/root';

export default function MainNavigation() {
  const user = useLoaderData<typeof loader>();

  return (
    <div className='h-[116px] w-full px-[70px] sticky top-0 backdrop-blur-md flex justify-between items-center z-50'>
      <img src='/static/assets/logo/logo_main.svg' alt='' />
      <nav className='flex justify-between items-center'>
        <ul className='flex space-x-4'>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/catalog'>Catalog</Link>
          </li>
          <li>
            <Link to='/cart'>Cart</Link>
          </li>
          {user ? (
            <li>
              <Link to='/account'>Account</Link>
            </li>
          ) : (
            <li>
              <Link to='/auth/sign-in'>Sign In</Link>
            </li>
          )}
          {user?.role === 'ADMIN' && (
            <div className='flex space-x-6'>
              <Link to='/notifications'>
                <img src='/static/assets/icons/bell.svg' alt='' />
              </Link>
              <Link to='/search'>
                <img src='/static/assets/icons/search.svg' alt='' />
              </Link>
              <li>
                <NavLink to='/admin' className='flex space-x-2 items-center active:bg-[#FFFBF2]'>
                  <img src='/static/assets/icons/account.svg' alt='' />
                  <div>Admin</div>
                </NavLink>
              </li>
            </div>
          )}
        </ul>
      </nav>
    </div>
  );
}
