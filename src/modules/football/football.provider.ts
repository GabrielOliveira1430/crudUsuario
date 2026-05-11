// src/modules/football/football.provider.ts

import axios from 'axios';


// ==========================================
// ⚽ TYPES
// ==========================================

export type FootballMatch = {

  homeTeam: string;

  awayTeam: string;

  league: string;

  date: string;

  status: string;

  homeScore?: number;

  awayScore?: number;
};


// ==========================================
// ⚽ FOOTBALL PROVIDER
// ==========================================

export class FootballProvider {


  // ==========================================
  // 📡 GET LIVE MATCHES
  // ==========================================

  static async getLiveMatches() {

    try {

      console.log(
        '⚽ Buscando partidas ao vivo...'
      );

      /**
       * API GRATUITA
       * https://www.scorebat.com/video-api/
       */

      const response =

        await axios.get(
          'https://www.scorebat.com/video-api/v3/'
        );

      const data =
        response.data?.response || [];

      const matches:
        FootballMatch[] = [];

      for (const item of data) {

        matches.push({

          homeTeam:
            item.title?.split(' - ')[0] || 'Unknown',

          awayTeam:
            item.title?.split(' - ')[1] || 'Unknown',

          league:
            item.competition || 'Unknown',

          date:
            item.date || new Date().toISOString(),

          status:
            'finished',

          homeScore:
            undefined,

          awayScore:
            undefined
        });
      }

      console.log(
        '🟢 Partidas carregadas:',
        matches.length
      );

      return {

        success: true,

        total:
          matches.length,

        matches
      };

    } catch (error) {

      console.error(
        '🔴 FootballProvider erro:',
        error
      );

      return {

        success: false,

        total: 0,

        matches: []
      };
    }
  }
}