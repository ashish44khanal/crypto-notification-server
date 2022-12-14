export type crypoTypes = {
  rank: number;
  name: string;
  code: string;
  image: string | undefined;
  price: string;
  market_cap: string;
  changeIn24: string;
  crypto_details_link: string | undefined;
}[];

export type User = {
  exp: number;
  full_name: string;
  iat: number;
  user_id: string;
};
