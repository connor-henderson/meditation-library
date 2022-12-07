import decode from "jwt-decode";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NextAuthAdapter from "../../../server/auth/next-adapter";
import knex from "../../../db";

export default NextAuth({
  secret: process.env.JWT_SECRET,
  session: { strategy: "jwt", maxAge: 100000 },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  adapter: NextAuthAdapter(knex),
});
