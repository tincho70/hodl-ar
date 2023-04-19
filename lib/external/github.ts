import YAML from "yaml";
import { Config } from "lacrypta-links/types/config";

const MAIN_DOMAIN = process.env.MAIN_DOMAIN || "hodl.ar";

const GitHub = {
  getUserProfile: async (username: string) => {
    const res = await fetch(`https://api.github.com/users/${username}`);

    if (res.status !== 200) {
      throw new Error("Github user not found");
    }
    const data = await res.json();

    return data;
  },

  getConfigFromUserRepo: async (username: string): Promise<Config> => {
    const res = await fetch(
      `https://raw.githubusercontent.com/${username}/.${MAIN_DOMAIN}/main/config.yml`,
    );

    if (res.status !== 200) {
      throw new Error("Repository not found");
    }

    const data = await res.text();

    return YAML.parse(data);
  },
};

export default GitHub;
