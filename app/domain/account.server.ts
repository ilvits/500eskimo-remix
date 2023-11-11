import { InputError, makeDomainFunction } from "domain-functions";
import { type NewUser, users } from "~/db/schema.server";
import { authSchema, authSchemaWithoutUsername } from "~/common/authSchema";
import { hash, verify } from "argon2";

import { db } from "~/db/config.server";
import { eq } from "drizzle-orm";

export const createAccount = makeDomainFunction(authSchema)(async (data) => {
  console.log("data: ", data);
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));

  if (result.length > 0) {
    console.log("result: ", result);
    throw new InputError("Email already taken", "email");
  }

  const { password, ...rest } = data;

  const hashedPassword = await hash(password);

  const newUser: NewUser = {
    ...rest,
    roleId: 2,
    password: hashedPassword,
  };

  const record = await db.insert(users).values(newUser).returning();

  if (!record || !record[0].id) {
    throw new Error("Unable to register a new user");
  }

  return record;
});

export const getAccountByEmail = makeDomainFunction(authSchemaWithoutUsername)(
  async (data) => {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email));

    if (!result || !result[0].email) {
      throw new InputError("Email does not exist", "email");
    }

    const isValidPassword = await verify(result[0].password, data.password);

    if (!isValidPassword) {
      throw new InputError("Password is not valid", "password");
    }

    return result;
  }
);

export const getAllUsers = async () => {
  // const result = await db.select().from(users);
  const result = await db.query.users.findMany({
    with: {
      role: true,
    },
  });
  if (!result) {
    throw new Error("Unable to get all users");
  }

  return result;
};

export const deleteUser = async (id: number) => {
  console.log("deleteAccount: ", id);

  const deletedUserIds: { deletedId: number }[] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ deletedId: users.id });

  console.log("deletedUser: ", deletedUserIds);

  return deletedUserIds;
};
