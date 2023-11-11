import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { getAllUsers } from "~/domain/account.server";
import { useRootLoaderData } from "~/root";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const users = json(await getAllUsers());
  return users;
};

export default function AdminUsers() {
  const users = useLoaderData<typeof loader>();
  const rootLoaderData = useRootLoaderData();
  console.log("users: ", users);
  console.log("currentUser: ", rootLoaderData);

  return (
    <div className='w-screen h-screen flex  justify-center p-4'>
      <div className='w-full'>
        <h1 className='text-3xl'>Users</h1>
        <div className='flex flex-col'>
          <ul className='flex space-x-4 bg-slate-100 [&>li]:w-1/5'>
            <li>
              <div>User</div>
            </li>
            <li>
              <div>Email</div>
            </li>
            <li>
              <div>Role</div>
            </li>
            <li>
              <div>Created</div>
            </li>
            <li>
              <div></div>
            </li>
          </ul>
          {users.map((user) => (
            <ul key={user.id} className='flex space-x-4 w-full [&>li]:w-1/5'>
              <li>
                <div>{user.username}</div>
              </li>
              <li>
                <div>{user.email}</div>
              </li>
              <li>
                <div>{user.role.role}</div>
              </li>
              <li>
                <div>{dayjs(user.createdAt).format("DD/MM/YYYY")}</div>
              </li>
              <li>
                <Form
                  method='post'
                  action={user.id + "/delete"}
                  onSubmit={(event) => {
                    const response = confirm(
                      "Please confirm you want to delete this contact."
                    );
                    if (!response) {
                      event.preventDefault();
                    }
                  }}
                >
                  <button
                    className='text-red-600 disabled:opacity-50'
                    type='submit'
                    disabled={
                      user.role.role === "admin" ||
                      user.id === rootLoaderData?.userId
                    }
                  >
                    Delete
                  </button>
                </Form>
              </li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
