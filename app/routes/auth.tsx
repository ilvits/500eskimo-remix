import { type MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Auth Pages" }];
};

export default function AuthLayout() {
  return <Outlet />;
}
