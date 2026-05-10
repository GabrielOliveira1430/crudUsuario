// src/modules/draw-sync/providers/brasil-api.provider.ts

import axios from 'axios';

import {
  DrawData
} from '../draw-sync.types';


// ==========================================
// 🎯 API RESULT
// ==========================================

type FetchResult = {

  success: boolean;

  total: number;

  draws: DrawData[];
};


// ==========================================
// 🇧🇷 LOTERIA API PROVIDER
// ==========================================

export class BrasilApiProvider {

  // ==========================================
  // 🎰 FETCH MEGA-SENA
  // ==========================================

  static async fetchMegaSena():
    Promise<FetchResult> {

    try {

      const response =
        await axios.get(

          'https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena'

        );

      const data =
        response.data;


      // ==========================================
      // 🔢 DEZENAS
      // ==========================================

      const dezenas =
        data.listaDezenas || [];


      // ==========================================
      // 🎲 CONVERT TO DRAWS
      // ==========================================

      const draws: DrawData[] =

        dezenas.map(
          (dezena: string) => ({

            number:
              dezena.padStart(4, '0'),

            source:
              'mega-sena',

            extractedAt:
              new Date(),

            metadata: {

              concurso:
                data.numero,

              dataApuracao:
                data.dataApuracao
            }
          })
        );


      console.log(

        `🎰 Mega-Sena carregada: ${draws.length} dezenas`
      );


      return {

        success: true,

        total:
          draws.length,

        draws
      };

    } catch (error) {

      console.error(
        '🔴 BrasilApiProvider erro:',
        error
      );

      return {

        success: false,

        total: 0,

        draws: []
      };
    }
  }
}