import { randomUUID } from "crypto";
import { Transaction } from "objection";
import knex from "../../../db";
import Account from "../account";
import User from "../user";
import { Account as NextAuthAccount } from "next-auth/core/types";

describe("User model", () => {
  let trx: Transaction;
  let user: User;
  let account: NextAuthAccount;
  let createdAccount: Account;

  beforeEach(async () => {
    trx = await knex.transaction();
    user = await User.create(
      {
        email: "fill@murray.com",
        emailVerified: new Date(),
      },
      trx
    );
    account = {
      provider: "github",
      providerAccountId: randomUUID(),
      type: "oauth",
      access_token: randomUUID(),
      expires_at: 0,
      id_token: randomUUID(),
      refresh_token: randomUUID(),
      token_type: "bearer",
      scope: "user",
      session_state: randomUUID(),
      userId: user.id,
    };

    createdAccount = await Account.create(account, trx);
  });

  afterEach(async () => {
    await trx.rollback();
  });

  afterAll(async () => {
    await trx.destroy();
  });

  describe("Step through user model", () => {
    it("create", async () => {
      expect(createdAccount).toMatchObject(account);
    });

    it("getByProviderAccountId", async () => {
      const fetchedAccount = await Account.getByProviderAccountId(
        account.providerAccountId,
        account.provider,
        trx
      );

      expect(
        fetchedAccount && Account.toNextAuthJson(fetchedAccount)
      ).toMatchObject(account);
    });

    it("deleteByProviderAccountId", async () => {
      await Account.deleteByProviderAccountId(
        account.providerAccountId,
        account.provider,
        trx
      );

      const deletedAccount = await Account.getByProviderAccountId(
        account.providerAccountId,
        account.provider,
        trx
      );
      expect(deletedAccount).toBeUndefined();
    });
  });
});
