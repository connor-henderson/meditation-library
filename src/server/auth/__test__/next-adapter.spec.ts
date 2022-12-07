import type { Adapter } from "next-auth/adapters";
import { createHash, randomUUID } from "crypto";
import NextAuthAdapter from "../next-adapter";
import User from "../../../db/models/user";
import Session from "../../../db/models/session";
import Account from "../../../db/models/account";
import VerificationToken from "../../../db/models/verification-token";
import knex from "../../../db";

// UTILS
function hashToken(token: string) {
  return createHash("sha256").update(`${token}anything`).digest("hex");
}

const ONE_WEEK_FROM_NOW = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
const FIFTEEN_MINUTES_FROM_NOW = new Date(Date.now() + 15 * 60 * 1000);
const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;
const ONE_MONTH_FROM_NOW = new Date(Date.now() + ONE_MONTH);

interface TestOptions {
  adapter: Adapter;
  db: {
    /** Generates UUID v4 by default. Use it to override how the test suite should generate IDs, like user id. */
    id?: () => string;
    /**
     * Manually disconnect database after all tests have been run,
     * if your adapter doesn't do it automatically
     */
    disconnect?: () => Promise<any>;
    /**
     * Manually establishes a db connection before all tests,
     * if your db doesn't do this automatically
     */
    connect?: () => Promise<any>;
    /** A simple query function that returns a session directly from the db. */
    session: (sessionToken: string) => any;
    /** A simple query function that returns a user directly from the db. */
    user: (id: string) => any;
    /** A simple query function that returns an account directly from the db. */
    account: (providerAccountId: {
      provider: string;
      providerAccountId: string;
    }) => any;
    /**
     * A simple query function that returns an verification token directly from the db,
     * based on the user identifier and the verification token (hashed).
     */
    verificationToken: (params: { identifier: string; token: string }) => any;
  };
}

const objectionAdapter = NextAuthAdapter(knex);

const options: TestOptions = {
  adapter: objectionAdapter,
  db: {
    session: Session.getBySessionToken,
    user: User.get,
    account: async ({ provider, providerAccountId }) =>
      Account.getByProviderAccountId(provider, providerAccountId),
    verificationToken: async ({ identifier, token }) =>
      VerificationToken.get(identifier, token),
  },
};

const clearDatabase = async () => {
  await Promise.all([
    User.query().delete(),
    Account.query().delete(),
    Session.query().delete(),
    VerificationToken.query().delete(),
  ]);
};

describe("Next Adapter for Objection", () => {
  beforeAll(async () => {
    await options.db.connect?.();
    await clearDatabase();
  });

  const { adapter } = options;

  afterAll(async () => {
    await clearDatabase();
    await options.db.disconnect?.();
  });

  let user: any = {
    email: "fill@murray.com",
  };

  const session: any = {
    sessionToken: randomUUID(),
    expires: ONE_WEEK_FROM_NOW,
  };

  const account: any = {
    provider: "github",
    providerAccountId: randomUUID(),
    type: "oauth",
    access_token: randomUUID(),
    expires_at: ONE_MONTH,
    id_token: randomUUID(),
    refresh_token: randomUUID(),
    token_type: "bearer",
    scope: "user",
    session_state: randomUUID(),
  };

  test("Required (User, Account, Session) methods exist", () => {
    const requiredMethods = [
      "createUser",
      "getUser",
      "getUserByEmail",
      "getUserByAccount",
      "updateUser",
      "linkAccount",
      "createSession",
      "getSessionAndUser",
      "updateSession",
      "deleteSession",
    ];
    requiredMethods.forEach((method) => {
      expect(adapter).toHaveProperty(method);
    });
  });

  test("createUser", async () => {
    const { id } = await adapter.createUser(user);
    const dbUser = await User.get(id);
    expect(dbUser).toMatchObject({ ...user, id });
    user = dbUser;
    session.userId = dbUser?.id;
    account.userId = dbUser?.id;
  });

  test("getUser", async () => {
    expect(await adapter.getUser(randomUUID())).toBeNull();
    expect(await adapter.getUser(user.id)).toMatchObject(user);
  });

  test("getUserByEmail", async () => {
    expect(await adapter.getUserByEmail("non-existent-email")).toBeNull();
    expect(await adapter.getUserByEmail(user.email)).toMatchObject(user);
  });

  test("createSession", async () => {
    const { sessionToken } = await adapter.createSession(session);
    const dbSession = await Session.getBySessionToken(sessionToken);

    expect(dbSession).toMatchObject({ ...session, id: dbSession?.id });
    session.userId = dbSession?.userId;
    session.id = dbSession?.id;
  });

  test("getSessionAndUser", async () => {
    let sessionAndUser = await adapter.getSessionAndUser(randomUUID());
    expect(sessionAndUser).toBeNull();

    sessionAndUser = await adapter.getSessionAndUser(session.sessionToken);
    if (!sessionAndUser) {
      throw new Error("Session and User was not found, but they should exist");
    }
    expect(sessionAndUser).toMatchObject({
      user,
      session,
    });
  });

  test("updateUser", async () => {
    const newEmailVerified = new Date();
    const returnedUser = await adapter.updateUser({
      id: user.id,
      emailVerified: newEmailVerified,
    });
    expect(returnedUser.emailVerified).toEqual(newEmailVerified);

    const dbUser = await User.get(user.id);
    expect(dbUser?.emailVerified).toEqual(newEmailVerified);
    user.emailVerified = newEmailVerified;
  });

  test("updateSession", async () => {
    let dbSession = await Session.getBySessionToken(session.sessionToken);

    expect(dbSession?.expires.valueOf()).not.toBe(ONE_MONTH_FROM_NOW.valueOf());

    await adapter.updateSession({
      sessionToken: session.sessionToken,
      expires: ONE_MONTH_FROM_NOW,
    });

    dbSession = await Session.getBySessionToken(session.sessionToken);
    expect(dbSession?.expires.valueOf()).toBe(ONE_MONTH_FROM_NOW.valueOf());
  });

  test("linkAccount", async () => {
    await adapter.linkAccount(account);
    const fetchedDbAccount = await Account.getByProviderAccountId(
      account.providerAccountId,
      account.provider
    );
    if (!fetchedDbAccount) throw Error("No account found in database");
    const dbAccount = Account.toNextAuthJson(fetchedDbAccount);
    expect(dbAccount).toMatchObject({ ...account, id: dbAccount.id });
  });

  test("getUserByAccount", async () => {
    let userByAccount = await adapter.getUserByAccount({
      provider: "invalid-provider",
      providerAccountId: "invalid-provider-account-id",
    });
    expect(userByAccount).toBeNull();

    userByAccount = await adapter.getUserByAccount({
      provider: account.provider,
      providerAccountId: account.providerAccountId,
    });
    expect(userByAccount).toEqual(user);
  });

  test("deleteSession", async () => {
    await adapter.deleteSession(session.sessionToken);
    const dbSession = await Session.getBySessionToken(session.sessionToken);
    expect(dbSession).toBeUndefined();
  });

  test("Verification Token methods exist", () => {
    const requiredMethods = ["createVerificationToken", "useVerificationToken"];
    requiredMethods.forEach((method) => {
      expect(adapter).toHaveProperty(method);
    });
  });

  test("createVerificationToken", async () => {
    const identifier = "info@example.com";
    const token = randomUUID();
    const hashedToken = hashToken(token);

    const verificationToken = {
      token: hashedToken,
      identifier,
      expires: FIFTEEN_MINUTES_FROM_NOW,
    };
    await adapter.createVerificationToken?.(verificationToken);

    const dbVerificationToken = await VerificationToken.get(
      identifier,
      hashedToken
    );

    expect(dbVerificationToken).toMatchObject(verificationToken);
  });

  test("useVerificationToken", async () => {
    const identifier = "info@example.com";
    const token = randomUUID();
    const hashedToken = hashToken(token);
    const verificationToken = {
      token: hashedToken,
      identifier,
      expires: FIFTEEN_MINUTES_FROM_NOW,
    };
    await adapter.createVerificationToken?.(verificationToken);

    const dbVerificationToken1 = await adapter.useVerificationToken?.({
      identifier,
      token: hashedToken,
    });

    if (!dbVerificationToken1) {
      throw new Error("Verification Token was not found, but it should exist");
    }

    expect(dbVerificationToken1).toMatchObject(verificationToken);

    const dbVerificationToken2 = await adapter.useVerificationToken?.({
      identifier,
      token: hashedToken,
    });

    expect(dbVerificationToken2).toBeNull();
  });

  test("Future methods exist", () => {
    const requiredMethods = ["unlinkAccount", "deleteUser"];
    requiredMethods.forEach((method) => {
      expect(adapter).toHaveProperty(method);
    });
  });

  test("unlinkAccount", async () => {
    const fetchedDbAccount = await Account.getByProviderAccountId(
      account.providerAccountId,
      account.provider
    );
    if (!fetchedDbAccount) throw Error("No account found in database");
    let dbAccount: any = Account.toNextAuthJson(fetchedDbAccount);
    expect(dbAccount).toMatchObject({ ...account, id: dbAccount.id });

    await adapter.unlinkAccount?.({
      provider: account.provider,
      providerAccountId: account.providerAccountId,
    });
    dbAccount = await Account.getByProviderAccountId(
      account.providerAccountId,
      account.provider
    );
    expect(dbAccount).toBeUndefined();
  });

  test("deleteUser", async () => {
    let dbUser = await User.get(user.id);
    expect(dbUser).toEqual(user);

    // Re-populate db with session and account
    delete session.id;
    await adapter.createSession(session);
    await adapter.linkAccount(account);

    await adapter.deleteUser?.(user.id);
    dbUser = await User.get(user.id);
    // User should not exist after it is deleted
    expect(dbUser).toBeUndefined();

    const dbSession = await Session.getBySessionToken(session.sessionToken);
    // Session should not exist after user is deleted
    expect(dbSession).toBeUndefined();

    const dbAccount = await Account.getByProviderAccountId(
      account.providerAccountId,
      account.provider
    );
    // Account should not exist after user is deleted
    expect(dbAccount).toBeUndefined();
  });
});
