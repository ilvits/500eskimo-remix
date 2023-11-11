import type { ActionFunction } from "@remix-run/node";
import { Button } from "~/components/Button";
import { Form } from "@remix-run/react";
import { authenticator } from "~/auth/authenticator.server";

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/auth/sign-in" });
};

export default function ProtectedMain() {
  return (
    <div className='space-y-4 mt-4'>
      <h1>Protected Main Page</h1>
      <small>This (nested) route is protected by the parent.</small>

      <Form method='POST'>
        <Button type='submit' label='Logout' />
      </Form>
    </div>
  );
}
