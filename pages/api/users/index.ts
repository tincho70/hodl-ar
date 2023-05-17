import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

// export the default function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const _users = await prisma.user.findMany({});

  const users = _users.map((user) => {
    return {
      id: user.id,
      name: user.name,
      github: user.github,
    };
  });

  res.status(200).json(users);
}
