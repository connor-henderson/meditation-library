import { Transaction } from "objection";
import BaseModel from "./base-model";

export default class VerificationToken extends BaseModel {
  static hasPHI = false;

  static get idColumn() {
    return ["identifier", "token"];
  }

  static get tableName() {
    return "verification_token";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["identifier", "token", "expires"],
      properties: {
        identifier: { type: "string" },
        token: { type: "string" },
        expires: { type: "date" },
      },
    };
  }

  static async create(
    verificationToken: Partial<VerificationToken>,
    trx?: Transaction
  ) {
    return this.query(trx).insertAndFetch(verificationToken);
  }

  static async get(identifier: string, token: string, trx?: Transaction) {
    return this.query(trx).findById([identifier, token]);
  }

  static async delete(identifier: string, token: string, trx?: Transaction) {
    return this.query(trx).where({ identifier, token }).delete();
  }

  identifier: string;

  token: string;

  expires: Date;
}
