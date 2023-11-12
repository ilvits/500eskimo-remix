import { Link, useLoaderData } from "@remix-run/react";

import type { loader } from "~/root";

export default function MainNavigation() {
  const user = useLoaderData<typeof loader>();
  // console.log("mainNav: ", user);

  return (
    <div className='p-4 sticky top-0 bg-emerald-600/50 backdrop-blur-md border-b'>
      <nav className='flex justify-between items-center'>
        <h1>Logo</h1>
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
          {user?.roleId === 1 && (
            <li>
              <Link to='/admin'>Admin</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
