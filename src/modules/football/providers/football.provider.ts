import { FootballAPIProvider } from "../providers/football-api.client";
import { ScorebatProvider } from "../providers/scorebat.provider";
import { MockProvider } from "../providers/mock.provider";
import { FootballMatch } from "../providers/football.types";

export class FootballProvider {

  private static cache: any = null;
  private static CACHE_TTL = 30000;

  static async getLiveMatches() {

    // =========================
    // CACHE
    // =========================
    if (
      this.cache &&
      Date.now() - this.cache.timestamp < this.CACHE_TTL
    ) {
      return this.cache.data;
    }

    let matches: FootballMatch[] = [];
    let source = "mock";

    // =========================
    // 1. API REAL
    // =========================
    const api = await FootballAPIProvider.getLiveMatches();

    if (api.length > 0) {
      matches = api;
      source = "api";
    }

    // =========================
    // 2. SCOREBAT
    // =========================
    if (matches.length === 0) {
      const sb = await ScorebatProvider.getLiveMatches();

      if (sb.length > 0) {
        matches = sb;
        source = "scorebat";
      }
    }

    // =========================
    // 3. MOCK
    // =========================
    if (matches.length === 0) {
      matches = MockProvider.getLiveMatches();
      source = "mock";
    }

    const result = {
      success: true,
      source,
      total: matches.length,
      matches,
    };

    this.cache = {
      timestamp: Date.now(),
      data: result,
    };

    return result;
  }

  static clearCache() {
    this.cache = null;
  }
}