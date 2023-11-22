import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';

import { sessionStorage } from '~/auth/storage.server';
import { getAccountByEmail } from '~/services/account.server';

interface User {
  userId: number;
  username: string;
  email: string;
  role: string;
}

export const EMAIL_PASSWORD_STRATEGY = 'email-password-strategy';

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ context }) => {
    if (!context?.formData) {
      throw new Error('FormData must be provided in the Context');
    }

    const formData = context.formData as FormData;

    const email = formData.get('email');
    const password = formData.get('password');

    const result = await getAccountByEmail({ email, password });

    if (!result.success) {
      throw new Error('Failed to authenticate user');
      // return redirect("/auth/sign-in", 401);
    }

    const { id, username, role } = result.data;

    return { userId: id, username, role };
  }),
  EMAIL_PASSWORD_STRATEGY
);
