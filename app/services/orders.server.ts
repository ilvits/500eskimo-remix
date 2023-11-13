import { db } from '~/db/config.server';
import invariant from 'tiny-invariant';
import { orders } from '~/db/schema.server';
import { sql } from 'drizzle-orm';

export const getAllOrders = async () => {
  // const result = await db.select().from(orders);
  const result = await db.query.orders.findMany({
    limit: 50,
    with: {
      user: {
        columns: {
          username: true,
          email: true,
        },
      },
      orderItems: {
        with: {
          product: true,
        },
      },
    },
  });
  invariant(result, 'Unable to get all orders');

  return result;
};

export const totalOrders = async () => {
  const result = await db
    .select({
      count: sql<number>`cast(count(${orders.id}) as int)`,
    })
    .from(orders);
  invariant(result, 'Unable to get total orders');

  return result[0].count;
};
