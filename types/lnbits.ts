export interface LNBitsUser {
  id: string;
  name: string;
  admin: string;
  email: string;
  password: string;
  wallets: LNBitsWallet[];
}

export interface LNBitsWallet {
  id: string;
  admin: string;
  name: string;
  user: string;
  adminkey: string;
  inkey: string;
}

export interface LNBitsLink {
  id: number;
  wallet: string;
  description: string;
  min: number;
  served_meta: number;
  served_pr: number;
  webhook_url: string | null;
  webhook_headers: string | null;
  webhook_body: string | null;
  success_text: string | null;
  success_url: string | null;
  currency: string | null;
  comment_chars: number;
  max: number;
  fiat_base_multiplier: number;
  lnurl: string;
}
