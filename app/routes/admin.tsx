import { type MetaFunction } from "@remix-run/node";

import { AdminSidebar } from "~/components/AdminSidebar";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Admin Pages" }];
};

export default function Admin() {
  return (
    <main id='admin' className='flex flex-row'>
      <AdminSidebar />
      <Outlet />
    </main>
  );
}
