import { Knex } from "knex";
import { applyTimestampFields } from "../migration-utils";

export async function up(knex: Knex) {
  await knex.schema.raw(`CREATE EXTENSION "uuid-ossp";`);

  await knex.schema.createTable("user", (table) => {
    table.uuid("id").primary();
    table.string("email").unique();
    table.timestamp("email_verified");
    applyTimestampFields(table, knex);
  });
  await knex.schema.createTable("account", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table
      .uuid("user_id")
      .notNullable()
      .references("user.id")
      .onDelete("CASCADE");
    table.string("type").notNullable();
    table.string("provider").notNullable();
    table.string("provider_account_id").notNullable();
    table.text("refresh_token");
    table.text("access_token").unique();
    table.bigInteger("expires_at");
    table.string("token_type");
    table.string("scope");
    table.string("id_token");
    table.string("session_state");
    table.unique(["provider_account_id", "provider"]);
    applyTimestampFields(table, knex);
  });
  await knex.schema.createTable("session", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.timestamp("expires").notNullable();
    table.uuid("session_token").notNullable().unique();
    table.uuid("user_id").references("user.id").onDelete("CASCADE");
    applyTimestampFields(table, knex);
  });
  await knex.schema.createTable("verification_token", (table) => {
    table.string("identifier");
    table.string("token");
    table.timestamp("expires").notNullable();
    applyTimestampFields(table, knex);

    table.primary(["identifier", "token"]);
  });
  return knex;
}

export async function down(knex: Knex) {
  await knex.schema.dropTable("account");
  await knex.schema.dropTable("session");
  await knex.schema.dropTable("user");
  await knex.schema.dropTable("verification_token");
  return knex;
}
