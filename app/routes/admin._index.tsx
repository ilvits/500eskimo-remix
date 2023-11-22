import { type LoaderFunction, redirect } from '@remix-run/node';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  if (url.pathname === '/admin' || url.pathname === '/admin/') {
    return redirect('/admin/dashboard');
  }
  return null;
};
