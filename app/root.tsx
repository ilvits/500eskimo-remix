import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
} from '@remix-run/react';
import { cssBundleHref } from '@remix-run/css-bundle';

import { json, type LinksFunction, type LoaderFunctionArgs } from '@remix-run/node';

import { authenticator } from './auth/authenticator.server';
import styles from './styles/tailwind.css';
import Layout from './components/ui/custom/Layout';

import '@fontsource/hauora-sans/200.css';
import '@fontsource/hauora-sans/300.css';
import '@fontsource/hauora-sans/400.css';
import '@fontsource/hauora-sans/500.css';
import '@fontsource/hauora-sans/600.css';
import '@fontsource/hauora-sans/700.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];
export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json(await authenticator.isAuthenticated(request));
};

export function useRootLoaderData() {
  return useRouteLoaderData<typeof loader>('root');
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
      <body className='font-medium text-[#4A2502]'>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {error instanceof Error ? <pre>{error.message}</pre> : <pre>{JSON.stringify(error, null, 2)}</pre>}
        <Scripts />
      </body>
    </html>
  );
}
