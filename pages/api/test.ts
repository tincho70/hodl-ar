import OTToken from "@/lib/models/OTToken";
import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "types/request";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseDataType>,
) {
  const token = await OTToken.create("agustin", 1000);
  res.status(200).json({ success: true, message: "Hello World", data: token });
}
