import { Link, NavLink, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';

import type { loader } from '~/root';

export default function AdminNavigation() {
  const user = useLoaderData<typeof loader>();
  const [show, setShow] = useState(false);
  const controlNavbar = () => {
    if (window.scrollY > 100) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, []);
  return (
    <div
      className={`h-[50px] transition-all text-accent w-full px-[70px] sticky top-0 backdrop-blur-md bg-secondary-500 flex justify-between items-center z-50 active ${
        show && 'translate-y-[-50px]'
      }`}
    >
      <nav className='flex items-center justify-between w-full'>
        <Link className='font-bold' to='/'>
          Back to Store
        </Link>
        <ul className='flex space-x-4'>
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
              <li>
                <NavLink to='/admin' className='flex items-center space-x-2 active:bg-secondary-50'>
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
