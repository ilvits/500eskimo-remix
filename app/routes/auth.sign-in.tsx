import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { EMAIL_PASSWORD_STRATEGY, authenticator } from '~/auth/authenticator.server';
import { Link, Links, Meta, Scripts, useLoaderData, useRouteError, useSearchParams } from '@remix-run/react';
import { ValidatedForm, validationError } from 'remix-validated-form';

import { Button } from '~/components/ui/custom/Button';
import type { GetUserByEmailAuth } from '~/common/authSchema';
import { Input } from '~/components/ui/custom/Input';
import { authSchemaWithoutUsername } from '~/common/authSchema';
import { json } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';

const validator = withZod(authSchemaWithoutUsername);

export const loader: LoaderFunction = async () => {
  const defaultValues: GetUserByEmailAuth = {
    email: '',
    password: '',
  };
  return json({ defaultValues });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const fieldValues = await validator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  return await authenticator.authenticate(EMAIL_PASSWORD_STRATEGY, request, {
    successRedirect: '/account',
    // failureRedirect: "/auth/sign-in?error=unauthorised",
    context: { formData },
  });
};

export default function SigninPage() {
  const { defaultValues } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <ValidatedForm className='w-96 space-y-4' method='POST' validator={validator} defaultValues={defaultValues}>
        <Input name='email' label='Email' placeholder='Your email...' />
        <Input name='password' label='Password' type='password' placeholder='Your password...' />
        {searchParams.get('error') && (
          <p className='text-sm text-red-600 dark:text-red-500'>Email or password is incorrect</p>
        )}
        <div className='flex items-center space-x-4'>
          <Button type='submit' label='Login' />
          <Link to={'/auth/sign-up'} className='font-medium text-blue-600 dark:text-blue-500 hover:underline'>
            Go to Register
          </Link>
        </div>
      </ValidatedForm>
    </div>
  );
}
export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className='w-screen h-screen flex items-center justify-center'>
          <ValidatedForm className='w-96 space-y-4' method='POST' validator={validator}>
            <Input name='email' label='Email' placeholder='Your email...' />
            <Input name='password' label='Password' type='password' placeholder='Your password...' />
            {error instanceof Error ? (
              <pre>{error?.message}</pre>
            ) : (
              <p className='text-sm text-red-600 dark:text-red-500'>Email or password is incorrect</p>
            )}
            <div className='flex items-center space-x-4'>
              <Button type='submit' label='Login' />
              <Link to={'/auth/sign-up'} className='font-medium text-blue-600 dark:text-blue-500 hover:underline'>
                Go to Register
              </Link>
            </div>
          </ValidatedForm>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
