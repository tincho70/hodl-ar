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
  try {
    // request post
    const uuid = createCardRequestSchema.parse(req.query);

    console.dir(uuid);

    res.status(200).json({
      success: true,
      data: {
        card_name: "Testeo",
        id: "1",
        k0: "f616c2f40278307736fe86598b4a64b8",
        k1: "f686c311299ab9b9f6f2c06f21c6da6e",
        k2: "b64e1a73116ecde8bb8b003a71f30090",
        k3: "f686c311299ab9b9f6f2c06f21c6da6e",
        k4: "b64e1a73116ecde8bb8b003a71f30090",
        lnurlw_base:
          "lnurlw://39ad255340.d.voltageapp.io/boltcards/api/v1/scan/kcgb7evxdykcg4xqfjcxya",
        protocol_name: "new_bolt_card_response",
        protocol_version: "1",
      },
    });
  } catch (e: any) {
    res.status(400).json({
      success: true,
      message: e.message,
    });
  }
}
