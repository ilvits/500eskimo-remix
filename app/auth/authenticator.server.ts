import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { getAccountByEmail } from "~/domain/account.server";
import { sessionStorage } from "~/auth/storage.server";

interface User {
  userId: number;
  username: string;
  roleId: number;
}

export const EMAIL_PASSWORD_STRATEGY = "email-password-strategy";

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ context }) => {
    if (!context?.formData) {
      throw new Error("FormData must be provided in the Context");
    }

    const formData = context.formData as FormData;

    const email = formData.get("email");
    const password = formData.get("password");

    const result = await getAccountByEmail({ email, password });

    if (!result.success) {
      throw new Error("Failed to authenticate user");
      // return redirect("/auth/sign-in", 401);
    }

    const { username, roleId, id } = result.data[0];

    return { username, roleId, userId: id };
  }),
  EMAIL_PASSWORD_STRATEGY
);
