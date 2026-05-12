// src/modules/football/football-api.provider.ts

import axios from "axios";
import { env } from "../../../config/env";

// ==========================================
// ⚽ TYPES
// ==========================================

export type LiveMatchAPI = {
  homeTeam: string;
  awayTeam: string;
  league: string;
  status: string;
  minute?: number;
  homeScore?: number;
  awayScore?: number;
};

// ==========================================
// ⚽ API PROVIDER (REAL DATA)
// ==========================================

export class FootballAPIProvider {

  private static BASE_URL = "https://v3.football.api-sports.io";

  // ==========================================
  // 🚀 HEADERS
  // ==========================================

  private static getHeaders() {
    return {
      "x-apisports-key": env.footballApiKey,
      "x-rapidapi-host": env.footballApiHost,
    };
  }

  // ==========================================
  // ⚽ LIVE MATCHES
  // ==========================================

  static async getLiveMatches(): Promise<LiveMatchAPI[]> {

    try {

      const response = await axios.get(
        `${this.BASE_URL}/fixtures?live=all`,
        {
          headers: this.getHeaders(),
          timeout: 10000,
        }
      );

      const data = response.data?.response || [];

      return data.map((item: any) => ({
        homeTeam: item.teams?.home?.name,
        awayTeam: item.teams?.away?.name,
        league: item.league?.name,
        status: item.fixture?.status?.short,
        minute: item.fixture?.status?.elapsed,
        homeScore: item.goals?.home,
        awayScore: item.goals?.away,
      }));

    } catch (error) {

      console.error("🔴 Football API error:", error);

      return [];
    }
  }

  // ==========================================
  // 📊 FIXTURES TODAY
  // ==========================================

  static async getTodayMatches() {

    try {

      const response = await axios.get(
        `${this.BASE_URL}/fixtures?date=${new Date()
          .toISOString()
          .split("T")[0]}`,
        {
          headers: this.getHeaders(),
        }
      );

      return response.data?.response || [];

    } catch (error) {

      console.error("🔴 Football API today error:", error);

      return [];
    }
  }
}