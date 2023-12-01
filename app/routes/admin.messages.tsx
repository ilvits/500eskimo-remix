import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import { getAllMessages } from 'tmp/services_old/messages.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const messages = await getAllMessages();
  return json({ messages });
};
export default function AdminMessages() {
  const { messages } = useLoaderData<typeof loader>();
  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-4'>Messages</h1>
      <ul className='grid grid-cols-2 gap-4 p-4'>
        {messages.map(message => (
          <li key={message.id}>
            <div className='text-sm text-gray-500'>{dayjs(message.createdAt).format('DD MMM YYYY hh:mm')}</div>
            <div className='text-xl font-bold'>{message.name}</div>
            <div className='flex space-x-4'>
              <div>{message.email}</div>, <div>{message.phone}</div>
            </div>
            <div className='text-lg font-bold'>{message.subject}</div>
            <div className='text-lg line-clamp-2'>{message.body}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
