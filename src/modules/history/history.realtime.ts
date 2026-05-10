// src/modules/history/history.realtime.ts

import {
  HistoryMemory
} from './history.memory';

import {
  GeneratorService
} from '../generator/generator.service';


// ==========================================
// ⚡ REALTIME ENGINE
// ==========================================

export class HistoryRealtimeEngine {


  // ==========================================
  // 🚀 START ENGINE
  // ==========================================

  static start() {

    console.log(
      '⚡ Realtime Engine iniciado'
    );

    setInterval(async () => {

      try {

        // ==========================================
        // 🧠 GENERATE AI DRAW
        // ==========================================

        const generated =

          await GeneratorService.generate({

            quantity: 1,

            mode: 'balanced'
          });

        const result =
          generated.numbers[0];

        if (!result) {
          return;
        }


        // ==========================================
        // 💾 SAVE MEMORY
        // ==========================================

        await HistoryMemory.addDraw({

          number:
            result.number,

          extractedAt:
            new Date(),

          source:
            `AI-${result.source.toUpperCase()}`
        });


        // ==========================================
        // 📊 LOG
        // ==========================================

        console.log(

          '🎲 Novo sorteio IA:',

          result.number,

          '| conf:',

          result.confidence,

          '| strategy:',

          result.source
        );

      } catch (error) {

        console.error(
          '🔴 Erro realtime:',
          error
        );
      }

    }, 5000);
  }
}