// src/modules/history/history.realtime.ts

import {
  HistoryMemory
} from './history.memory';

import {
  FakeDraw
} from './history.generator';


// ==========================================
// ⚡ REALTIME ENGINE
// ==========================================

export class HistoryRealtimeEngine {


  // ==========================================
  // 🎲 GERA NOVO DRAW
  // ==========================================

  static generateDraw(): FakeDraw {

    const hotNumbers = [
      '1234',
      '5678',
      '9999',
      '1111',
      '2222'
    ];

    let number: string;


    // 🔥 15% chance hot
    if (Math.random() < 0.15) {

      number =
        hotNumbers[
          Math.floor(
            Math.random() *
            hotNumbers.length
          )
        ];

    } else {

      number =
        Math.floor(
          Math.random() * 10000
        )
          .toString()
          .padStart(4, '0');
    }

    return {

      number,

      extractedAt: new Date(),

      source: [
        'PTM',
        'PT',
        'LOOK',
        'NACIONAL'
      ][
        Math.floor(
          Math.random() * 4
        )
      ]
    };
  }


  // ==========================================
  // 🚀 START ENGINE
  // ==========================================

  static start() {

    console.log(
      '⚡ Realtime Engine iniciado'
    );

    setInterval(() => {

      const draw =
        this.generateDraw();

      HistoryMemory.addDraw(draw);

      console.log(
        '🎲 Novo sorteio:',
        draw.number
      );

    }, 5000);
  }
}