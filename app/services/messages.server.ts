import { db } from "~/db/config.server";
import invariant from "tiny-invariant";
import { messages } from "~/db/schema.server";

export const getAllMessages = async () => {
  const result = await db.select().from(messages).limit(10);
  invariant(result, "Unable to get all messages");
  return result;
};
