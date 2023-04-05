import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "types/request";
import { User, LNBits as LNBitsConfig } from ".prisma/client";
import { Prisma } from "@prisma/client";

const MAIN_DOMAIN = process.env.MAIN_DOMAIN || "hodl.ar";
const LNBITS_ENDPOINT =
  process.env.LNBITS_ENDPOINT || "https://legend.lnbits.com";

import z from "zod";

// Schema
const createUserRequestSchema = z.object({
  github: z.string().min(2),
});

// External Libraries
import GitHub from "@/lib/external/github";
import LNBits from "@/lib/external/lnbits";

// Create Prisma Client
const prisma = new PrismaClient();

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
  const result = createUserRequestSchema.safeParse(req.body);

  // Invalid Body Format
  if (!result.success) {
    res.status(400).json({ success: false, message: result.error.message });
    return result;
  }

  // Get body data
  const { github } = result.data;

  // Wrap any errors in a try/catch
  try {
    const githubProfile = await GitHub.getUserProfile(github);
    const userConfig = await GitHub.getConfigFromUserRepo(github);

    const { name, bio, twitter_username, email } = githubProfile;

    if (!userConfig?.username) {
      throw new Error("No username provided");
    }

    // TODO: Need to handle validation
    const user: User = {
      // id: Math.random().toString(36).substring(2, 15),
      id: userConfig.username,
      name,
      bio,
      twitter: twitter_username,
      email,
      github,
      nostr: userConfig.nostr?.npub || null,
      discord: null,
    };

    // Create User on Database
    await createUser(user);

    // Create LnBits User
    const lnbitsUser = await LNBits.createUser(user.id);
    const link = await LNBits.createLNURLp(lnbitsUser);

    console.info("LISTO: createLNURLp");

    // Add LnBits User to Database
    await prisma?.lNBits.create({
      data: {
        id: lnbitsUser.id,
        userId: user.id,
        adminKey: lnbitsUser.wallets[0].inkey,
        lnurlP: link.lnurl,
      },
    });

    // Success
    res.status(200).json({
      success: true,
      data: {
        username: user.id,
        handle: `${user.id}@${MAIN_DOMAIN}`,
        lnAddress: link.lnurl,
        lnbitUser: lnbitsUser.id,
        endpoint: LNBITS_ENDPOINT,
        walletUrl: `${LNBITS_ENDPOINT}/wallet?usr=${lnbitsUser.id}`,
        lndhub: {
          login: "admin",
          password: lnbitsUser.wallets[0].inkey,
          url: `${LNBITS_ENDPOINT}/lndhub/ext`,
        },
      },
    });
  } catch (e: any) {
    console.dir(e);
    res.status(500).json({ success: false, message: e.message });
    return;
  }
}

const createUser = async (data: Prisma.UserCreateInput) => {
  const newUser = await prisma.user.create({
    data: data,
  });

  console.dir(newUser);
  return newUser;
};
