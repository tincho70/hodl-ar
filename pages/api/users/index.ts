import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";

// Create Prisma Client
const prisma = new PrismaClient();

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

  console.info("TODY: users");
  console.dir(users);
  res.status(200).json(users);
}
