import { Knex } from "knex";

export function applyTimestampFields(table: any, knex: Knex) {
  table.timestamp("created_at").defaultTo(knex.fn.now());
  table.timestamp("updated_at").defaultTo(knex.fn.now());
  table.timestamp("deleted_at");
}
