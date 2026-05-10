// src/modules/draw-sync/draw-sync.service.ts

import prisma from '../../database/prisma';

import {
  BrasilApiProvider
} from './providers/brasil-api.provider';

import {
  DrawData
} from './draw-sync.types';

import {
  HistoryMemory
} from '../history/history.memory';


// ==========================================
// 🚀 DRAW SYNC SERVICE
// ==========================================

export class DrawSyncService {


  // ==========================================
  // 🔍 DRAW EXISTS
  // ==========================================

  private static async drawExists(
    number: string
  ) {

    const exists =

      await prisma.drawHistory.findFirst({

        where: {
          number
        }
      });

    return !!exists;
  }


  // ==========================================
  // 💾 SAVE DRAW
  // ==========================================

  private static async saveDraw(
    draw: DrawData
  ) {

    try {

      // ==========================================
      // 🚫 DUPLICATE CHECK
      // ==========================================

      const alreadyExists =

        await this.drawExists(
          draw.number
        );

      if (alreadyExists) {

        console.log(
          '🟡 Draw duplicado:',
          draw.number
        );

        return false;
      }


      // ==========================================
      // 💾 SAVE DATABASE
      // ==========================================

      await prisma.drawHistory.create({

        data: {

          number:
            draw.number,

          source:
            draw.source,

          metadata:
            draw.metadata || {}
        }
      });


      // ==========================================
      // 🧠 UPDATE MEMORY
      // ==========================================

      await HistoryMemory.addDraw({

        number:
          draw.number,

        extractedAt:
          draw.extractedAt,

        source:
          draw.source
      });


      console.log(
        '✅ Draw salvo:',
        draw.number
      );

      return true;

    } catch (error) {

      console.error(
        '🔴 Erro saveDraw:',
        error
      );

      return false;
    }
  }


  // ==========================================
  // 🇧🇷 SYNC MEGA-SENA
  // ==========================================

  static async syncMegaSena() {

    console.log(
      '📡 Sincronizando Mega-Sena...'
    );

    const result =

      await BrasilApiProvider
        .fetchMegaSena();


    if (!result.success) {

      console.log(
        '🔴 Falha sync Mega-Sena'
      );

      return {
        success: false,
        saved: 0
      };
    }


    let saved = 0;


    // ==========================================
    // 💾 SAVE DRAWS
    // ==========================================

    for (const draw of result.draws) {

      const ok =

        await this.saveDraw(
          draw
        );

      if (ok) {
        saved++;
      }
    }


    // ==========================================
    // ✅ FINAL
    // ==========================================

    console.log(

      `🚀 Mega-Sena sincronizada: ${saved} novos draws`
    );

    return {

      success: true,

      total:
        result.total,

      saved
    };
  }
}