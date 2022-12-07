import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex; // Apply migration
}

export async function down(knex: Knex) {
  return knex; // Rollback migration
}
