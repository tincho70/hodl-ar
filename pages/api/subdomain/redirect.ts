import { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.dir(req);
  res.status(200).send(req.headers);
}
