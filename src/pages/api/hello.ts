// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../db/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully.");

    res.status(200).json({ name: "John Doe" });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    res.status(500).json({ error });
  }
}
