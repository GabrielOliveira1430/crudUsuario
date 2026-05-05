import axios from "axios";
import { env } from "../config/env";

export async function getNumbersFromPage(): Promise<string> {
  const { data } = await axios.get(env.scraperUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  return data;
}