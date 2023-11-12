import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { getAllOrders } from "~/services/orders.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const orders = await getAllOrders();
  return json({ orders });
};
export default function AdminMessages() {
  const { orders } = useLoaderData<typeof loader>();
  console.log("orders: ", orders);
  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-4'>orders</h1>
      <ul className='grid grid-cols-2 gap-4 p-4'>
        {orders.map((order) => (
          <li key={order.id}>
            <div className='text-sm text-gray-500'>
              {dayjs(order.createdAt).format("DD MMM YYYY hh:mm")}
            </div>
            <div className='text-xl font-bold'>{order.user.username}</div>
            <div>{order.user.email}</div>
            {order.orderItems.map((item) => (
              <div key={item.id} className='flex'>
                <div>
                  <img className='w-12 h-12' src={item.product.image} alt='' />
                </div>
                <div>
                  {item.product.title} ({item.price}$) ({item.quantity} pcs.)
                </div>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
