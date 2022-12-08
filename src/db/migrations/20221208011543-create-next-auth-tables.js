"use strict";
/** @type {import('sequelize-cli').Migration} */
const { models } = require("@next-auth/sequelize-adapter");

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable("Users", { ...models.User });
    await queryInterface.createTable("Accounts", { ...models.Account });
    await queryInterface.createTable("Sessions", { ...models.Session });
    await queryInterface.createTable("VerificationTokens", {
      ...models.VerificationToken,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Users");
    await queryInterface.dropTable("Accounts");
    await queryInterface.dropTable("Sessions");
    await queryInterface.createTable("VerificationTokens", {
      ...models.VerificationToken,
    });
  },
};
