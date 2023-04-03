import YAML from "yaml";
import { Config } from "lacrypta-links/types/config";

const MAIN_DOMAIN = process.env.MAIN_DOMAIN || "hodl.ar";

export const getUserProfile = async (username: string) => {
  const res = await fetch(`https://api.github.com/users/${username}`);
  const data = await res.json();

  return data;
};

export const getConfigFromUserRepo = async (
  username: string,
): Promise<Config> => {
  const res = await fetch(
    `https://raw.githubusercontent.com/${username}/.${MAIN_DOMAIN}/main/config.yml`,
  );

  const data = await res.text();

  return YAML.parse(data);
};
