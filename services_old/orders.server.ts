// import { asc, between, desc, eq, sql } from 'drizzle-orm';

// import { db } from 'db_old/config.server';
// import invariant from 'tiny-invariant';
// import { orders } from 'db_old/schema.server';

// export const getAllOrders = async () => {
//   const result = await db.query.orders.findMany({
//     limit: 10,
//     // orderBy: [desc(orders.createdAt)],
//     with: {
//       user: {
//         columns: {
//           username: true,
//           email: true,
//         },
//       },
//       orderItems: {
//         columns: {
//           quantity: true,
//           price: true,
//         },
//         with: {
//           product: true,
//         },
//       },
//     },
//   });

//   invariant(result, 'Unable to get all orders');
//   return result;
// };

// export const getOrders = async (limit = 10) => {
//   const result = await db.query.orders
//     .findMany({
//       limit: limit,
//       with: {
//         user: {
//           columns: {
//             username: true,
//           },
//         },
//         orderItems: {
//           with: {
//             product: {
//               columns: {
//                 image: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: [desc(orders.createdAt)],
//     })
//     .then(orders => orders.filter(order => order.orderItems.length > 0));

//   invariant(result, 'Unable to get all orders');
//   return result;
// };

// export const getAllOrdersOnlyTotalsByDateRange = async (startDate: Date, endDate: Date) => {
//   const result = await db.query.orders.findMany({
//     columns: {
//       id: true,
//       total: true,
//       createdAt: true,
//     },
//     where: between(orders.createdAt, startDate, endDate),
//     orderBy: [desc(orders.createdAt)],
//   });
//   invariant(result, 'Unable to get total orders');

//   return result;
// };

// export const getAllOrdersCount = async () => {
//   const result = await db
//     .select({
//       count: sql<number>`cast(count(${orders.id}) as int)`,
//     })
//     .from(orders);
//   invariant(result, 'Unable to get total orders');
//   return result[0].count;
// };

// export const getAllOrdersTotal = async () => {
//   let result = await db
//     .select({
//       total: sql<number>`sum(${orders.total})`,
//     })
//     .from(orders);
//   invariant(result, 'Unable to get total orders');

//   return result[0].total;
// };

// export interface Order {
//   id: number;
//   userId: number;
//   status: string;
//   createdAt: Date; // Add the 'createdAt' property here
// }

// export interface OrderTotals {
//   id: number;
//   userId: number;
//   status: string;
//   createdAt: Date; // Add the 'createdAt' property here
// }

// export const getOrdersByDateRange = async (startDate: Date, endDate: Date) => {
//   // await new Promise(resolve => setTimeout(resolve, 1000));
//   const result = await db.query.orders
//     .findMany({
//       with: {
//         orderItems: true,
//       },
//       orderBy: [asc(orders.createdAt)],
//       where: between(orders.createdAt, startDate, endDate),
//     })
//     .then(orders => orders.filter(order => order.orderItems.length > 0));
//   invariant(result, 'Unable to get last orders');
//   return result;
// };

// export const getOrdersTotalByStatus = async (status: string) => {
//   let result = await db
//     .select({
//       total: sql<number>`sum(${orders.total}) as int`,
//     })
//     .from(orders)
//     .where(eq(orders.status, status));
//   console.log(result[0].total);

//   invariant(result, 'Unable to get total orders');

//   return result[0].total;
// };

// export const getOrderHits = async () => {
//   const data = await db.query.products.findMany({
//     columns: {
//       title: true,
//       image: true,
//       price: true,
//     },
//     with: {
//       category: {
//         columns: {
//           name: true,
//         },
//       },
//       orderItems: {
//         columns: {
//           id: true,
//         },
//       },
//     },
//   });
//   invariant(data, 'Unable to get total orders');
//   const result = data
//     .map(product => {
//       return {
//         ...product,
//         hits: product.orderItems.length,
//       };
//     })
//     .sort((a, b) => b.hits - a.hits)
//     .slice(0, 4);

//   return result;
// };
