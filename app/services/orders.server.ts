import { asc, between, desc, sql } from 'drizzle-orm';

import { db } from '~/db/config.server';
import invariant from 'tiny-invariant';
import { orders } from '~/db/schema.server';

export const getAllOrders = async () => {
  const result = await db.query.orders.findMany({
    limit: 10,
    orderBy: [asc(orders.createdAt)],
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

export const getOrders = async (limit: number) => {
  const result = await db.query.orders
    .findMany({
      limit: limit || 10,
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
      orderBy: [desc(orders.createdAt)],
    })
    .then(orders => orders.filter(order => order.orderItems.length > 0));
  invariant(result, 'Unable to get all orders');
  return result;
};

export const getAllOrdersOnlyTotalsByDateRange = async (startDate: Date, endDate: Date) => {
  const result = await db.query.orders.findMany({
    columns: {
      id: true,
      total: true,
      createdAt: true,
    },
    where: between(orders.createdAt, startDate, endDate),
    orderBy: [desc(orders.createdAt)],
  });
  invariant(result, 'Unable to get total orders');

  return result;
};

export const getAllOrdersCount = async () => {
  const result = await db
    .select({
      count: sql<number>`cast(count(${orders.id}) as int)`,
    })
    .from(orders);
  invariant(result, 'Unable to get total orders');

  return result[0].count;
};

export const getAllOrdersTotal = async () => {
  const result = await db
    .select({
      total: sql<number>`sum(${orders.total})`,
    })
    .from(orders);
  invariant(result, 'Unable to get total orders');

  return result[0].total;
};

export interface Order {
  id: number;
  userId: number;
  status: string;
  createdAt: Date; // Add the 'createdAt' property here
}

export interface OrderTotals {
  id: number;
  userId: number;
  status: string;
  createdAt: Date; // Add the 'createdAt' property here
}

export const getOrdersByDateRange = async (startDate: Date, endDate: Date) => {
  // await new Promise(resolve => setTimeout(resolve, 1000));
  const result = await db.query.orders
    .findMany({
      with: {
        orderItems: true,
      },
      orderBy: [asc(orders.createdAt)],
      where: between(orders.createdAt, startDate, endDate),
    })
    .then(orders => orders.filter(order => order.orderItems.length > 0));
  invariant(result, 'Unable to get last orders');
  return result;
};
