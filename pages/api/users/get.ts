import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

// export the default function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await prisma.user.findFirst({
    where: {
      id: req.query.id?.toString(),
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
  });
}
