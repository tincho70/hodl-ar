import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const referer = req.headers.referer;
  const url = new URL(referer as string);

  const githubUser = url.pathname.split("/", 2)[1];

  const destination = `https://${githubUser}.links.hodl.ar`;
  res.status(303).redirect(destination);
}

export const config = {
  runtime: "edge",
};
