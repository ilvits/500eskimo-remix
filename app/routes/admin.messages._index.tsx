import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import { getMessages } from '~/services/messages.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const messages = await getMessages();
  return json({ messages });
};
export default function AdminMessages() {
  const { messages } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className='mb-4 text-3xl font-bold'>Messages</h1>
      <ul className='grid grid-cols-2 gap-x-10 gap-y-4'>
        {messages.map(message => (
          <li key={message.id} className='flex flex-col my-4 space-y-1'>
            <div className='text-xs text-secondary-500'>{dayjs(message.createdAt).format('DD MMM hh:mm')}</div>
            <div className='text-sm font-bold'>{message.name}</div>
            <div className='flex space-x-4 text-sm'>
              <div>{message.email}</div>, <div>{message.phone}</div>
            </div>
            <div className='font-bold'>{message.subject}</div>
            <div className='text-sm line-clamp-2'>{message.body}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
