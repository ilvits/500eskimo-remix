// import { desc, sql } from 'drizzle-orm';

// import { db } from 'db_old/config.server';
// import invariant from 'tiny-invariant';
// import { messages } from 'db_old/schema.server';

// export const getAllMessages = async () => {
//   const result = await db.select().from(messages).limit(10);
//   invariant(result, 'Unable to get all messages');
//   return result;
// };

// export const getMessages = async (limit = 4) => {
//   const result = await db.select().from(messages).limit(limit).orderBy(desc(messages.createdAt));
//   invariant(result, 'Unable to get messages');
//   return result;
// };

// export const totalMessages = async () => {
//   const result = await db
//     .select({
//       count: sql<number>`cast(count(${messages.id}) as int)`,
//     })
//     .from(messages);
//   invariant(result, 'Unable to get total messages');

//   return result[0].count;
// };
