import { db } from "~/db/config.server";
import invariant from "tiny-invariant";

export const getAllOrders = async () => {
  // const result = await db.select().from(orders);
  const result = await db.query.orders.findMany({
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
  invariant(result, "Unable to get all orders");

  console.log(result);

  return result;
};
