import { Transaction } from "objection";
import BaseModel from "./base-model";
import User from "./user";

export default class Session extends BaseModel {
  static hasPHI = false;

  static get tableName() {
    return "session";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["expires", "sessionToken"],
      properties: {
        id: { type: "uuid" },
        expires: { type: "date" },
        sessionToken: { type: "uuid" },
        userId: { type: "uuid" },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "session.userId",
          to: "user.id",
        },
      },
    };
  }

  static async create(session: Partial<Session>, trx?: Transaction) {
    return this.query(trx).insertAndFetch(session);
  }

  static async update(session: Partial<Session>, trx?: Transaction) {
    const currentSession = await this.query(trx).findOne({
      sessionToken: session.sessionToken,
    });
    if (currentSession)
      return currentSession.$query(trx).patchAndFetch(session);
  }

  static async delete(sessionToken: string, trx?: Transaction) {
    return this.query(trx).where({ sessionToken }).delete();
  }

  static async getBySessionToken(sessionToken: string, trx?: Transaction) {
    return this.query(trx).findOne({ sessionToken }).withGraphFetched("user");
  }

  id: string;

  expires: Date;

  sessionToken: string;

  userId: string;

  user: User;
}
