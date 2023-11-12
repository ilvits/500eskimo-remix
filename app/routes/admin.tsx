import { type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";

import { AdminSidebar } from "~/components/AdminSidebar";
import { Outlet } from "@remix-run/react";
import { authenticator } from "~/auth/authenticator.server";

export const meta: MetaFunction = () => {
  return [{ title: "Admin Pages" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/sign-in",
  });
};

export default function Admin() {
  return (
    <main id='admin' className='flex flex-row'>
      <AdminSidebar />
      <Outlet />
    </main>
  );
}
