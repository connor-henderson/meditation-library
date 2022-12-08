import NextAuth from "next-auth";
import SequelizeAdapter from "@next-auth/sequelize-adapter";
import db from "../../../db/models";
import GoogleProvider from "next-auth/providers/google";

db.sequelize.sync();

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/providers/overview
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  adapter: SequelizeAdapter(db.sequelize),
});
