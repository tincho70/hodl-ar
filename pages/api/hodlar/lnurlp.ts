import { NextApiRequest, NextApiResponse } from "next";

// export the default function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const username = req.query.username;
  res.status(200).json({
    data: {
      welcome: "LNURL P",
      username: username,
    },
  });
}
