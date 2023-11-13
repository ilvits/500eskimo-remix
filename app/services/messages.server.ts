import { db } from '~/db/config.server';
import invariant from 'tiny-invariant';
import { messages } from '~/db/schema.server';
import { sql } from 'drizzle-orm';

export const getAllMessages = async () => {
  const result = await db.select().from(messages).limit(10);
  invariant(result, 'Unable to get all messages');
  return result;
};

export const totalMessages = async () => {
  const result = await db
    .select({
      count: sql<number>`cast(count(${messages.id}) as int)`,
    })
    .from(messages);
  invariant(result, 'Unable to get total messages');

  return result[0].count;
};
