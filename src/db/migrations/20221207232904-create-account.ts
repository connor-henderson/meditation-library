"use strict";
/** @type {import('sequelize-cli').Migration} */
import { models } from "@next-auth/sequelize-adapter";
import { QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("Accounts", { ...models.Account });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("Accounts");
  },
};
