import { createHash, randomUUID } from "crypto";
import { Transaction } from "objection";
import knex from "../../../db";
import VerificationToken from "../verification-token";

function hashToken(token: string) {
  return createHash("sha256").update(`${token}anything`).digest("hex");
}

describe("Verification token model", () => {
  let trx: Transaction;
  const verificationToken = {
    token: hashToken(randomUUID()),
    identifier: "test@meditation.com",
    expires: new Date(),
  };

  beforeEach(async () => {
    trx = await knex.transaction();
    verificationToken.token = hashToken(randomUUID());
    verificationToken.identifier = "test@meditation.com";
    verificationToken.expires = new Date();
  });

  afterEach(async () => {
    await trx.rollback();
  });

  afterAll(async () => {
    await trx.destroy();
  });

  it("create", async () => {
    const createdToken = await VerificationToken.create(verificationToken, trx);

    expect(createdToken).toMatchObject(verificationToken);
  });

  it("get", async () => {
    await VerificationToken.create(verificationToken, trx);

    const fetchedToken = await VerificationToken.get(
      verificationToken.identifier,
      verificationToken.token,
      trx
    );

    expect(fetchedToken).toMatchObject(verificationToken);
  });

  it("delete", async () => {
    await VerificationToken.create(verificationToken, trx);

    await VerificationToken.delete(
      verificationToken.identifier,
      verificationToken.token,
      trx
    );

    const fetchedToken = await VerificationToken.get(
      verificationToken.identifier,
      verificationToken.token,
      trx
    );
    expect(fetchedToken).toBeUndefined();
  });
});
