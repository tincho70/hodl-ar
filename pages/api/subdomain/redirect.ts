import { NextRequest, NextResponse } from "next/server";

export default function handler(req: NextRequest, res: NextResponse) {
  const referer = req.headers.get("referer");

  if (!referer) {
    return new NextResponse("No disponible para Brave", {
      status: 400,
    });
  }
  const githubUser = (
    referer.match(/^https\:\/\/github.com\/([\w-]+)/) as string[]
  )[1];

  const destination = `https://${githubUser}.github.hodl.ar`;
  return new NextResponse(
    JSON.stringify({
      message: "Hello, world!",
    }),
    {
      status: 303,
      headers: {
        Location: destination,
        "Content-Type": "text/plain",
      },
    },
  );
}

export const config = {
  runtime: "edge",
};
