// Schema

import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "types/request";
import { z } from "zod";

const createCardRequestSchema = z.object({
  uuid: z.string().min(2),
});

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

  try {
    // request post
    const uuid = createCardRequestSchema.parse(req.body);

    res.status(200).json({
      success: true,
      data: { uuid },
    });
  } catch (e: any) {
    res.status(400).json({
      success: true,
      message: e.message,
    });
  }
}
