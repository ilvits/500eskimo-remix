import { Link } from "@remix-run/react";

export function AdminSidebar() {
  return (
    <div className='p-4 bg-white border-r h-screen'>
      <nav className=''>
        <ul className='flex flex-col space-y-4'>
          <li>
            <Link to='./dashboard'>Dashboard</Link>
          </li>
          <li>
            <Link to='./catalog'>Catalog</Link>
          </li>
          <li>
            <Link to='./users'>Users</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
