import { Transaction } from "objection";
import knex from "../../../db";
import User from "../user";

describe("User model", () => {
  let trx: Transaction;
  let inputUser: Partial<User>;
  let createdUser: User;

  beforeEach(async () => {
    trx = await knex.transaction();
    inputUser = {
      email: "test@gmail.com",
    };
    createdUser = await User.create(inputUser, trx);
  });

  afterEach(async () => {
    await trx.rollback();
  });

  afterAll(async () => {
    await trx.destroy();
  });

  describe("create", () => {
    it("Can create a user", async () => {
      expect(createdUser).toMatchObject(inputUser);
    });
  });

  describe("update", () => {
    it("Can update a user", async () => {
      const updatedUserInput = {
        id: createdUser.id,
        emailVerified: new Date(),
        email: "bob@bob.com",
      };

      const updatedUser = await User.update(updatedUserInput, trx);

      expect(updatedUser).toMatchObject(updatedUserInput);
    });
  });

  describe("get", () => {
    it("Can get user by id", async () => {
      const fetchedUser = await User.get(createdUser.id, trx);

      expect(fetchedUser).toMatchObject(createdUser);
    });
  });

  describe("getByEmail", () => {
    it("Can get user by email", async () => {
      const fetchedUser = await User.getByEmail(createdUser.email, trx);

      expect(fetchedUser).toMatchObject(createdUser);
    });
  });
});
