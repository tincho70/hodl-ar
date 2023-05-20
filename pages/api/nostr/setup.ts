import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "types/request";
import OTToken from "@/lib/models/OTToken";
import prisma from "@/lib/prisma";

import z from "zod";

// Schema
const setupNostrRequestSchema = z.object({
  npub: z.string().min(2),
  otToken: z.string(),
});

// External Libraries
import NextCors from "nextjs-cors";

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
  const result = setupNostrRequestSchema.safeParse(req.body);

  // Invalid Body Format
  if (!result.success) {
    res.status(400).json({ success: false, message: result.error.message });
    return result;
  }

  // Get body data
  const { npub, otToken } = result.data;

  // Wrap any errors in a try/catch
  try {
    // Validate token
    const username = await OTToken.get(otToken);
    if (!username) {
      throw new Error("Token not found");
    }

    // Burn token
    // TODO: remove comment
    // await OTToken.burn(otToken);

    console.info("LINK");

    console.info("USERNAME:", username);
    // Set LNURLp to user
    await prisma.user.update({
      where: {
        id: username,
      },
      data: {
        npub,
      },
    });

    // Success
    res.status(200).json({
      success: true,
    });
  } catch (e: any) {
    console.dir(e);
    res.status(500).json({ success: false, message: e.message });
    return;
  }
}
