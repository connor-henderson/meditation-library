import type { Adapter } from "next-auth/adapters";
import Account from "../../db/models/account";
import Session from "../../db/models/session";
import User from "../../db/models/user";
import VerificationToken from "../../db/models/verification-token";

export default function NextAuthAdapter(_client): Adapter {
  return {
    async createUser(user) {
      const createdUser = await User.create(user);
      return { ...createdUser };
    },
    async getUser(id) {
      const returnedUser = await User.get(id);
      return returnedUser ? { ...returnedUser } : null;
    },
    async getUserByEmail(email) {
      const returnedUser = await User.getByEmail(email);
      return returnedUser ? { ...returnedUser } : null;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await Account.getByProviderAccountId(
        providerAccountId,
        provider
      );
      return account && account.user ? { ...account.user } : null;
    },
    async updateUser(user) {
      const updatedUser = await User.update(user);
      return Object.assign(updatedUser);
    },
    async deleteUser(userId) {
      await User.delete(userId);
    },
    async linkAccount(account) {
      Account.toNextAuthJson(await Account.create(account));
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await Account.deleteByProviderAccountId(providerAccountId, provider);
    },
    async createSession(data) {
      return Session.create(data);
    },
    async getSessionAndUser(sessionToken) {
      const userAndSession = await Session.getBySessionToken(sessionToken);

      if (!userAndSession) return null;

      const { user, ...session } = userAndSession;
      return {
        user: { ...user },
        session,
      };
    },
    async updateSession(data) {
      return Session.update(data);
    },
    async deleteSession(sessionToken) {
      await Session.delete(sessionToken);
    },
    async createVerificationToken(data) {
      const { id, ...verificationToken } = await VerificationToken.create(data);

      return verificationToken;
    },
    async useVerificationToken({ identifier, token }) {
      const verificationToken = await VerificationToken.get(identifier, token);
      await VerificationToken.delete(identifier, token);

      return verificationToken ?? null;
    },
  };
}
