import { NextApiRequest, NextApiResponse } from "next";

// export the default function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const username = req.query.name;
  // TODO: Look up the user from our database and return pubkey

  res.status(200).json({
    username,
    pubkey: "23423432342342342342",
  });
}
