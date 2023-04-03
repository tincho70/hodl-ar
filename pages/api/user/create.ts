import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "types/request";
import { User } from ".prisma/client";
import { Prisma } from "@prisma/client";

import z from "zod";

const createUserRequestSchema = z.object({
  github: z.string().min(2),
});

import { getConfigFromUserRepo, getUserProfile } from "@/lib/external/github";

// export the default function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseDataType>,
) {
  // Only allow POST
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Must be POST" });
    return;
  }

  // Parse for correct Post body

  console.dir(req.body);
  const result = createUserRequestSchema.safeParse(req.body);

  // Invalid Body Format
  if (!result.success) {
    res.status(400).json({ success: false, message: result.error.message });
    return result;
  }

  const { github } = result.data;

  // Wrap any errors in a try/catch
  try {
    const githubProfile = await getUserProfile(github);
    const userConfig = await getConfigFromUserRepo(github);

    const { name, bio, twitter_username } = githubProfile;

    if (!userConfig?.nostr?.handle) {
      throw new Error("No nostr.handle provided");
    }

    // TODO: Need handle validation

    const user: User = {
      id: userConfig.nostr.handle,
      name,
      bio,
      twitter: twitter_username,
      email: null,
      github,
      nostr: userConfig.nostr?.npub || null,
      discord: null,
      lnbitsAdmin: null,
      lnurlP: null,
    };

    console.info("console.dir(user);");
    console.dir(user);

    // const createdUser = await createUser(user);

    // Success
    res.status(200).json({ success: true, data: user });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
    return;
  }
}

const createUser = async (data: Prisma.UserCreateInput) => {
  const prisma = new PrismaClient();

  const newUser = await prisma.user.create({
    data: data,
  });

  console.dir(newUser);
  return newUser;
};
