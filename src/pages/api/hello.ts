// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../db/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userToCreate = { email: "test@gmail.com", emailVerified: new Date() };
  const user = await User.create(userToCreate);
  res.status(200);
}
