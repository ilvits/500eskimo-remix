import { Link } from "@remix-run/react";

export function AdminSidebar() {
  return (
    <div className='p-4 bg-zinc-400 w-64 border-r h-screen'>
      <nav className=''>
        <ul className='flex flex-col space-y-4 w-full [&>li]:w-1/5 p-4'>
          <li>
            <Link to='./dashboard'>Dashboard</Link>
          </li>
          <li>
            <Link to='./orders'>Orders</Link>
          </li>
          <li>
            <Link to='./products'>Products</Link>
          </li>
          <li>
            <Link to='./users'>Users</Link>
          </li>
          <li>
            <Link to='./messages'>Messages</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
