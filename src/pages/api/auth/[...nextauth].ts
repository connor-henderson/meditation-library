import NextAuth from "next-auth";
import SequelizeAdapter from "@next-auth/sequelize-adapter";
import sequelize from "../../../db/config/config";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/providers/overview
  providers: [],
  adapter: SequelizeAdapter(sequelize),
});
