import dotenv from "dotenv";

dotenv.config();

export const env = {
  scraperUrl:
    process.env.SCRAPER_URL ||
    "https://portalbrasil.net/jogodobicho/resultado-do-jogo-do-bicho/",
};