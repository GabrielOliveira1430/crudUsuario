import { FootballProvider } from "../../football/football.provider";
import { EloEngine } from "../engines/elo.engine";

export class EloService {

  private static eloMap: Map<string, number> | null = null;

  // ======================================
  // BUILD
  // ======================================

  static async build() {

    const data = await FootballProvider.getLiveMatches();

    const matches = data.matches || [];

    this.eloMap = EloEngine.init(matches);

    return this.eloMap;
  }

  // ======================================
  // GET MAP
  // ======================================

  static async getMap() {

    if (!this.eloMap) {
      await this.build();
    }

    return this.eloMap!;
  }

  // ======================================
  // PREDICT
  // ======================================

  static async predict(home: string, away: string) {

    const map = await this.getMap();

    return EloEngine.predict(map, home, away);
  }
}