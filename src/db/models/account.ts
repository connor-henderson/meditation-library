import { Transaction } from "objection";
import { Account as NextAuthAccount } from "next-auth/core/types";
import { ProviderType } from "next-auth/providers";
import BaseModel from "./base-model";
import User from "./user";

export default class Account extends BaseModel {
  static hasPHI = true;

  static get tableName() {
    return "account";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [],
      properties: {
        id: { type: "uuid" },
        userId: { type: "uuid" },
        type: { type: "enum", values: ["email", "oauth", "credentials"] },
        provider: { type: "string" },
        providerAccountId: { type: "string" },
        refreshToken: { type: "string" },
        accessToken: { type: "string" },
        expiresAt: { type: "number" },
        tokenType: { type: "string" },
        scope: { type: "string" },
        idToken: { type: "string" },
        sessionState: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "account.userId",
          to: "user.id",
        },
      },
    };
  }

  static async create(account: Partial<Account>, trx?: Transaction) {
    return this.query(trx).insertAndFetch(account);
  }

  static async deleteByProviderAccountId(
    providerAccountId: string,
    provider: string,
    trx?: Transaction
  ) {
    return this.query(trx).where({ providerAccountId, provider }).delete();
  }

  static async getByProviderAccountId(
    providerAccountId: string,
    provider: string,
    trx?: Transaction
  ) {
    return this.query(trx)
      .findOne({ providerAccountId, provider })
      .withGraphFetched("user");
  }

  static toNextAuthJson(account: Account): NextAuthAccount {
    const {
      id,
      userId,
      type,
      provider,
      providerAccountId,
      refreshToken,
      accessToken,
      expiresAt,
      tokenType,
      scope,
      idToken,
      sessionState,
    } = account;
    return {
      id,
      userId,
      type,
      provider,
      providerAccountId,
      refresh_token: refreshToken,
      access_token: accessToken,
      expires_at: Number(expiresAt),
      token_type: tokenType,
      scope,
      id_token: idToken,
      session_state: sessionState,
    };
  }

  user: User;

  userId: string;

  type: ProviderType;

  provider: string;

  providerAccountId: string;

  expiresAt: number;

  accessToken: string;

  refreshToken: string;

  tokenType: string;

  scope: string;

  idToken: string;

  sessionState: string;
}
