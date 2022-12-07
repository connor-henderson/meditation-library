import { randomUUID } from "crypto";
import { Transaction } from "objection";
import knex from "../../../db";
import Session from "../session";

describe("Session model", () => {
  let trx: Transaction;
  const session = {
    sessionToken: randomUUID(),
    expires: new Date(),
  };

  beforeEach(async () => {
    trx = await knex.transaction();
    session.sessionToken = randomUUID();
    session.expires = new Date();
  });

  afterEach(async () => {
    await trx.rollback();
  });

  afterAll(async () => {
    await trx.destroy();
  });

  it("create", async () => {
    const createdSession = await Session.create(session, trx);

    expect(createdSession).toMatchObject(session);
  });

  it("getBySessionToken", async () => {
    await Session.create(session, trx);

    const fetchedSession = await Session.getBySessionToken(
      session.sessionToken,
      trx
    );

    expect(fetchedSession).toMatchObject(session);
  });

  it("update", async () => {
    await Session.create(session, trx);
    const sessionToUpdateTo = {
      sessionToken: session.sessionToken,
      expires: new Date(Date.now() + 1000),
    };

    const updatedSession = await Session.update(sessionToUpdateTo, trx);

    expect(updatedSession).toMatchObject(sessionToUpdateTo);
  });

  it("delete", async () => {
    await Session.create(session, trx);

    await Session.delete(session.sessionToken, trx);

    const fetchedSession = await Session.getBySessionToken(
      session.sessionToken
    );
    expect(fetchedSession).toBeUndefined();
  });
});
