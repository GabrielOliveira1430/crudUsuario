import { FootballMatch } from "../../football/providers/football.types";

type EloMap = Map<string, number>;

export class EloEngine {

  private static BASE = 1500;

  private static K = 32;

  // ======================================
  // INIT
  // ======================================

  static init(matches: FootballMatch[]): EloMap {

    const elo = new Map<string, number>();

    const get = (team: string) =>
      elo.get(team) || this.BASE;

    const set = (team: string, value: number) =>
      elo.set(team, value);

    for (const match of matches) {

      const home = match.homeTeam;
      const away = match.awayTeam;

      const homeElo = get(home);
      const awayElo = get(away);

      let homeScore = 0;
      let awayScore = 0;

      if ((match.homeScore || 0) > (match.awayScore || 0)) {
        homeScore = 1;
        awayScore = 0;
      } else if ((match.homeScore || 0) < (match.awayScore || 0)) {
        homeScore = 0;
        awayScore = 1;
      } else {
        homeScore = 0.5;
        awayScore = 0.5;
      }

      const expectedHome =
        1 / (1 + Math.pow(10, (awayElo - homeElo) / 400));

      const expectedAway = 1 - expectedHome;

      const newHome =
        homeElo + this.K * (homeScore - expectedHome);

      const newAway =
        awayElo + this.K * (awayScore - expectedAway);

      set(home, newHome);
      set(away, newAway);
    }

    return elo;
  }

  // ======================================
  // GET STRENGTH
  // ======================================

  static getStrength(
    eloMap: EloMap,
    team: string
  ) {
    return eloMap.get(team) || this.BASE;
  }

  // ======================================
  // PREDICT WIN PROBABILITY
  // ======================================

  static predict(
    eloMap: EloMap,
    home: string,
    away: string
  ) {

    const homeElo = this.getStrength(eloMap, home);
    const awayElo = this.getStrength(eloMap, away);

    const probability =
      1 / (1 + Math.pow(10, (awayElo - homeElo) / 400));

    return {
      homeWinProbability: Number((probability * 100).toFixed(2)),
      awayWinProbability: Number(((1 - probability) * 100).toFixed(2)),
    };
  }
}