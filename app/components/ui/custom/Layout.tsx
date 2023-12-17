import AdminNavigation from './AdminNavigation';
import type { LoaderFunctionArgs } from '@remix-run/node';
import MainNavigation from './MainNavigation';
import { authenticator } from '~/auth/authenticator.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/sign-in',
  });
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();

  return (
    <main className='flex flex-col'>
      {!data.role.includes('ADMIN') ? <MainNavigation /> : <AdminNavigation />}
      <section className='mt-6'>{children}</section>
    </main>
  );
}
