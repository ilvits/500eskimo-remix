import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react";
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";

import MainNavigation from "./components/MainNavigation";
import { authenticator } from "./auth/authenticator.server";
import styles from "./styles/tailwind.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json(await authenticator.isAuthenticated(request));
};

export function useRootLoaderData() {
  return useRouteLoaderData<typeof loader>("root");
}

export default function App() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <MainNavigation />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
