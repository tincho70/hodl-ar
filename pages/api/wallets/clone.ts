import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "types/request";
import OTToken from "@/lib/models/OTToken";
import prisma from "@/lib/prisma";

const MAIN_DOMAIN = process.env.MAIN_DOMAIN || "hodl.ar";
const LNBITS_ENDPOINT =
  process.env.LNBITS_ENDPOINT || "https://legend.lnbits.com";

import z from "zod";

// Schema
const cloneWalletRequestSchema = z.object({
  username: z.string().min(2),
  address: z.string().min(2),
  otToken: z.string(),
});

// External Libraries
import NextCors from "nextjs-cors";
import { generateLNURLpAddress } from "@/lib/utils";

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
  const result = cloneWalletRequestSchema.safeParse(req.body);

  // Invalid Body Format
  if (!result.success) {
    res.status(400).json({ success: false, message: result.error.message });
    return result;
  }

  // Get body data
  const { username, address, otToken } = result.data;

  // Wrap any errors in a try/catch
  try {
    // Validate token
    const tokenFoundId = await OTToken.get(otToken);
    if (!tokenFoundId) {
      throw new Error("Token not found");
    }

    // Burn token
    await OTToken.burn(tokenFoundId);

    const { callback, min, max, metadata, comment_chars, payerData } =
      await getLNURLp(address);
    // Add LNURLp to database
    await prisma.lNURL.create({
      data: {
        tag: "payRequest",
        callback,
        minSendable: min,
        maxSendable: max,
        metadata: metadata,
        commentAllowed: comment_chars,
        id: 0,
        userId: username,
        payerData,
      },
    });

    // Success
    res.status(200).json({
      success: true,
      data: {
        username: username,
        handle: `${username}@${MAIN_DOMAIN}`,
      },
    });
  } catch (e: any) {
    console.dir(e);
    res.status(500).json({ success: false, message: e.message });
    return;
  }
}

const getLNURLp = async (address: string) => {
  const url = generateLNURLpAddress(address);
  const res = await fetch(url);

  if (res.status !== 200) {
    throw new Error("Github user not found");
  }
  const data = await res.json();

  return data;
};
