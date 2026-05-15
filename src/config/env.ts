import dotenv from "dotenv";

dotenv.config();

export const env = {

  // ==========================================
  // 🌍 NODE
  // ==========================================

  nodeEnv:
    process.env.NODE_ENV ||
    "development",

  port:
    Number(process.env.PORT || 3000),

  // ==========================================
  // 🔐 JWT
  // ==========================================

  jwtSecret:
    process.env.JWT_SECRET ||
    "secret",

  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET ||
    "refresh-secret",

  // ==========================================
  // 🔴 REDIS
  // ==========================================

  redisUrl:
    process.env.REDIS_URL ||
    "redis://localhost:6379",

  // ==========================================
  // ⚽ FOOTBALL API
  // ==========================================

  footballApiKey:
    process.env.API_FOOTBALL_KEY || "",

  footballApiHost:
    process.env.API_FOOTBALL_HOST ||
    "v3.football.api-sports.io",

  // ==========================================
  // 🌐 FRONT
  // ==========================================

  frontUrl:
    process.env.FRONT_URL ||
    "http://localhost:5173",

  // ==========================================
  // 🎲 SCRAPER
  // ==========================================

  scraperUrl:
    process.env.SCRAPER_URL ||
    "https://portalbrasil.net/jogodobicho/resultado-do-jogo-do-bicho/",

  // ==========================================
  // 🔥 FORCE PRO
  // ==========================================

  forcePro:
    process.env.FORCE_PRO === "true"
};