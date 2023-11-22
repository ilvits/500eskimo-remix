import { prisma } from '~/lib/prisma.server';

export const getMessagesCount = async () => {
  const result = await prisma.messages.count();
  return result;
};

export const getMessages = async (take = 10) => {
  const result = await prisma.messages.findMany({
    take,
  });
  return result;
};
