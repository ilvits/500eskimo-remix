import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { EMAIL_PASSWORD_STRATEGY, authenticator } from '~/auth/authenticator.server';
import { Link, useLoaderData, useSearchParams } from '@remix-run/react';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { json, redirect } from '@remix-run/node';

import { Button } from '~/components/ui/custom/Button';
import { Input } from '~/components/ui/custom/Input';
import type { RegisterAccountAuth } from '~/common/authSchema';
import { authSchema } from '~/common/authSchema';

import { withZod } from '@remix-validated-form/with-zod';
import { createAccount } from '~/services/account.server';

const validator = withZod(authSchema);

export const loader: LoaderFunction = () => {
  const defaultValues: RegisterAccountAuth = {
    username: '',
    email: '',
    password: '',
  };
  return json({ defaultValues });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  console.log(formData);

  const fieldValues = await validator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const result = await createAccount(fieldValues.data);

  if (!result || !result.success) return redirect('/auth/sign-up?error=exist');

  return await authenticator.authenticate(EMAIL_PASSWORD_STRATEGY, request, {
    successRedirect: '/account',
    context: { formData },
  });
};

export default function SignupPage() {
  const { defaultValues } = useLoaderData<typeof loader>();
  const [error] = useSearchParams();
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <ValidatedForm className='w-96 space-y-4' method='POST' validator={validator} defaultValues={defaultValues}>
        <Input name='username' label='Username' placeholder='Your username...' />
        <Input name='email' label='Email' placeholder='Your email...' />
        <Input name='password' label='Password' type='password' placeholder='Your password...' />
        {error.get('error') && <p className='text-sm text-red-600 dark:text-red-500'>Email already exist</p>}
        <div className='flex items-center space-x-4'>
          <Button type='submit' label='Register' />
          <Link to={'/auth/sign-in'} className='font-medium text-blue-600 dark:text-blue-500 hover:underline'>
            Go to Login
          </Link>
        </div>
      </ValidatedForm>
    </div>
  );
}
