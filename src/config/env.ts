// src/config/env.ts

import dotenv from "dotenv";

dotenv.config();

// ==========================================
// 🌍 ENV CONFIG
// ==========================================

function required(
  value: string | undefined,
  name: string
) {

  if (!value) {

    console.warn(
      `⚠️ ENV ausente: ${name}`
    );

    return "";
  }

  return value;
}

// ==========================================
// 🚀 ENV
// ==========================================

export const env = {

  // ==========================================
  // 🕷️ SCRAPER
  // ==========================================

  scraperUrl:
    process.env.SCRAPER_URL ||
    "https://portalbrasil.net/jogodobicho/resultado-do-jogo-do-bicho/",

  // ==========================================
  // ⚽ FOOTBALL API
  // ==========================================

  footballApiKey:
    process.env.FOOTBALL_API_KEY ||
    "be6537ab4263715fffbf832875a5e386",

  footballApiHost:
    process.env.FOOTBALL_API_HOST ||
    "v3.football.api-sports.io",

  // ==========================================
  // 🔐 JWT
  // ==========================================

  jwtSecret:
    process.env.JWT_SECRET ||
    "secret",

  // ==========================================
  // 🌍 NODE
  // ==========================================

  nodeEnv:
    process.env.NODE_ENV ||
    "development",
};