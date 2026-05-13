import axios from 'axios';

import {
  FootballMatch
} from './football.types';

export class FootballAPIProvider {

  private static API_KEY =
    process.env.FOOTBALL_API_KEY;

  private static BASE_URL =
    'https://api.football-data.org/v4';

  // ==========================================
  // ⚽ LIVE MATCHES
  // ==========================================

  static async getLiveMatches():
    Promise<FootballMatch[]> {

    try {

      if (!this.API_KEY) {

        console.log(
          '⚠️ FOOTBALL_API_KEY não configurada'
        );

        return [];
      }

      const response =
        await axios.get(

          `${this.BASE_URL}/matches?status=LIVE`,

          {

            headers: {

              'X-Auth-Token':
                this.API_KEY
            },

            timeout: 10000
          }
        );

      const matches =
        response.data?.matches || [];

      // ==========================================
      // 🔄 NORMALIZE
      // ==========================================

      return matches.map(
        (match: any) => ({

          homeTeam:
            match?.homeTeam?.name ||
            'Unknown Home',

          awayTeam:
            match?.awayTeam?.name ||
            'Unknown Away',

          league:
            match?.competition?.name ||
            'Unknown League',

          status:
            match?.status || 'LIVE',

          date:
            match?.utcDate ||
            new Date().toISOString(),

          minute:
            match?.minute || 0,

          homeScore:
            match?.score?.fullTime?.home ??
            0,

          awayScore:
            match?.score?.fullTime?.away ??
            0
        })
      );

    } catch (error: any) {

      console.log(
        '⚠️ API real falhou:',
        error?.message
      );

      return [];
    }
  }
}