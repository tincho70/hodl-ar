import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import NextCors from "nextjs-cors";

// export the default function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // CORS
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method !== "GET" || !req.query.userId) {
    res.status(405).json("Method not allowed");
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.query.userId?.toString(),
    },
  });

  if (!user) {
    res.status(404).json("Not found");
    return;
  }
  console.info("TODY: users");
  console.dir(user);
  res.status(200).json({
    id: user.id,
    name: user.name,
    github: user.github,
    npub: user.nostr,
  });
}
