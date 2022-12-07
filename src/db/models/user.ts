import { Transaction } from "objection";
import BaseModel from "./base-model";

export default class User extends BaseModel {
  static hasPHI = true;

  static get tableName() {
    return "user";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email"],
      properties: {
        id: { type: "uuid" },
        email: { type: "string", minLength: 1 },
        emailVerified: { type: "date" },
      },
    };
  }

  static async create(user: Partial<User>, trx?: Transaction): Promise<User> {
    return this.query(trx).insertAndFetch(user);
  }

  static async update(
    { id, ...user }: Partial<User>,
    trx?: Transaction
  ): Promise<User | undefined> {
    if (id) return this.query(trx).patchAndFetchById(id, user);
  }

  static async get(id: string, trx?: Transaction): Promise<User | undefined> {
    return this.query(trx).findById(id);
  }

  static async getByEmail(
    email: string,
    trx?: Transaction
  ): Promise<User | undefined> {
    return this.query(trx).findOne("email", email);
  }

  static async delete(id: string, trx?: Transaction) {
    return this.query(trx).where({ id }).delete();
  }

  id: string;

  email: string;

  emailVerified: Date | null;
}
