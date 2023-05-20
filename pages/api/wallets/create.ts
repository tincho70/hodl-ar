import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "types/request";
import OTToken from "@/lib/models/OTToken";
import prisma from "@/lib/prisma";

const MAIN_DOMAIN = process.env.MAIN_DOMAIN || "hodl.ar";
const LNBITS_ENDPOINT =
  process.env.LNBITS_ENDPOINT || "https://legend.lnbits.com";

import z from "zod";

// Schema
const createWalletRequestSchema = z.object({
  otToken: z.string(),
});

// External Libraries
import LNBits from "@/lib/external/lnbits";
import NextCors from "nextjs-cors";
import { createMockWallet } from "@/lib/mock";

// export the default function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseDataType>,
) {
  // CORS
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  // Only allow POST
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Must be POST" });
    return;
  }

  // Parse for correct Post body
  const result = createWalletRequestSchema.safeParse(req.body);

  // Invalid Body Format
  if (!result.success) {
    res.status(400).json({ success: false, message: result.error.message });
    return result;
  }

  // Get body data
  const { otToken } = result.data;

  const provider = "github";

  // Wrap any errors in a try/catch
  try {
    if (provider !== "github") {
      throw new Error("Only GitHub is supported");
    }

    // Get User

    // Validate token
    const username = await OTToken.get(otToken);
    if (!username) {
      throw new Error("Token not found");
    }

    // Burn token
    // TODO: remove comment
    // await OTToken.burn(otToken);

    // Create LnBits User
    const lnbitsUser = await LNBits.createUser(username);

    // Create Link
    const link = await LNBits.createLNURLp(lnbitsUser);

    console.info("LINK");
    console.dir(link);

    console.info("USERNAME:", username);
    await Promise.all([
      // Add LnBits User to Database
      await prisma.lNBits.create({
        data: {
          id: lnbitsUser.id,
          userId: username,
          adminKey: lnbitsUser.wallets[0].inkey,
        },
      }),
      // Add LNURLp to database
      await prisma.lNURL.create({
        data: {
          tag: "payRequest",
          callback: `${LNBITS_ENDPOINT}/lnurlp/api/v1/lnurl/cb/${link.id}`,
          minSendable: link.min * 1000,
          maxSendable: link.max * 1000,
          metadata: `[[\"text/plain\", \"${link.description}\"]]`,
          commentAllowed: link.comment_chars,
          id: link.id,
          userId: username,
        },
      }),
      // Set LNURLp to user
      await prisma.user.update({
        where: {
          id: username,
        },
        data: {
          lud06: link.lnurl,
        },
      }),
    ]);

    // Create OTToken for NOSTR
    const token = await OTToken.create(username, 1440);

    // TODO: Replace this
    const mockData: any = createMockWallet();
    (mockData.nextOtToken = token.id),
      // Success
      res.status(200).json({
        success: true,
        data: mockData,
        // data: {
        //   username: username,
        //   handle: `${username}@${MAIN_DOMAIN}`,
        //   lnAddress: link.lnurl,
        //   lnbitUser: lnbitsUser.id,
        //   endpoint: LNBITS_ENDPOINT,
        //   walletUrl: `${LNBITS_ENDPOINT}/wallet?usr=${lnbitsUser.id}`,
        //   lndhub: {
        //     login: "admin",
        //     password: lnbitsUser.wallets[0].inkey,
        //     url: `${LNBITS_ENDPOINT}/lndhub/ext/`,
        //   },
        //   nextOtToken: token.id,
        // },
      });
  } catch (e: any) {
    console.dir(e);
    res.status(500).json({ success: false, message: e.message });
    return;
  }
}
