import { LNBitsLink, LNBitsUser } from "types/lnbits";

const MAIN_DOMAIN = process.env.MAIN_DOMAIN || "hodl.ar";
const LNBITS_ENDPOINT = process.env.LNBITS_ENDPOINT || "";
const LNBITS_ADMIN_KEY = process.env.LNBITS_ADMIN_KEY || "";
const LNBITS_ADMIN_USER = process.env.LNBITS_ADMIN_USER || "";

const requestApi = async (
  path: string,
  method: string = "POST",
  apiKey: string,
  body?: any,
) => {
  const res = await fetch(`${LNBITS_ENDPOINT}/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(body),
  });

  return JSON.parse(await res.text());
};

const LNBits = {
  createUser: async (username: string): Promise<LNBitsUser> => {
    const user = await requestApi(
      "usermanager/api/v1/users",
      "POST",
      LNBITS_ADMIN_KEY,
      {
        admin_id: LNBITS_ADMIN_USER,
        user_name: username,
        wallet_name: username,
      },
    );

    return user;
  },
  createLNURLp: async (lnbitUser: LNBitsUser): Promise<LNBitsLink> => {
    const link = await requestApi(
      "lnurlp/api/v1/links",
      "POST",
      lnbitUser.wallets[0].inkey,
      {
        description: `${lnbitUser.name}@${MAIN_DOMAIN}`,
        min: 1,
        max: 100000000,
        comment_chars: 32,
      },
    );

    return link;
  },
};

export default LNBits;
