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

type error = {
  status: number;
  statusText: string;
  data: string;
  message: string;
};

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
    <html lang='en' className=''>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='text-primary-brown'>
        <Layout>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </Layout>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError() as Error | error;
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className='flex flex-col items-center justify-center w-full p-6 h-screen bg-secondary-50 text-primary-brown rounded border border-secondary-200'>
          <img src='/static/assets/eskimo_sad.svg' alt='' />
          <h1 className='text-3xl font-bold mb-8'>Oh no!</h1>
          {error instanceof Error ? (
            <pre>{error.message}</pre>
          ) : (
            <>
              <p className='text-xl'>
                {error?.status ? `${error?.status}: ` : ''}
                {error?.statusText}
              </p>
              <p>{error?.message}</p>
              <p>{`(${error?.data})`}</p>
            </>
          )}
        </div>
        <Scripts />
      </body>
    </html>
  );
}
