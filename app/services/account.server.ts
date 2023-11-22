import { InputError, makeDomainFunction } from 'domain-functions';
import { authSchema, authSchemaWithoutUsername } from '~/common/authSchema';
import { hash, verify } from 'argon2';

import invariant from 'tiny-invariant';
import { prisma } from '~/lib/prisma.server';

export const createAccount = makeDomainFunction(authSchema)(async data => {
  const result = await prisma.users.findFirst({
    where: {
      email: data.email,
    },
  });

  if (result) {
    throw new InputError('Email already taken', 'email');
  }

  const record = await prisma.users.create({
    data: {
      username: data.username,
      email: data.email,
      password: await hash(data.password),
    },
    select: {
      id: true,
    },
  });

  invariant(record, 'Unable to register a new user');
  return record;
});

export const getAccountByEmail = makeDomainFunction(authSchemaWithoutUsername)(async data => {
  const result = await prisma.users.findFirst({
    where: {
      email: data.email,
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      role: true,
    },
  });
  if (!result || !result.email) {
    throw new InputError('Email does not exist', 'email');
  }

  const isValidPassword = await verify(result.password, data.password);

  if (!isValidPassword) {
    throw new InputError('Password is not valid', 'password');
  }

  return result;
});

export const getAllUsers = async () => {
  const result = await prisma.users.findMany();
  return result;
};

export const deleteUser = async (id: number) => {
  const deletedUserId: { id: number } = await prisma.users.delete({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  console.log('deletedUser: ', deletedUserId);

  return deletedUserId;
};
