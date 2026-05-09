// src/modules/history/history.memory.ts

import {
  FakeDraw,
  HistoryGenerator
} from './history.generator';


// ==========================================
// 🧠 HISTORY MEMORY
// ==========================================

export class HistoryMemory {

  private static history:
    FakeDraw[] = [];


  // ==========================================
  // 🚀 INIT
  // ==========================================

  static init() {

    if (
      this.history.length === 0
    ) {

      console.log(
        '🧠 Gerando histórico inicial...'
      );

      this.history =
        HistoryGenerator.generate(
          10000
        );

      console.log(
        '✅ Histórico carregado:',
        this.history.length
      );
    }
  }


  // ==========================================
  // 📋 GET ALL
  // ==========================================

  static getAll() {

    this.init();

    return this.history;
  }


  // ==========================================
  // ➕ ADD DRAW
  // ==========================================

  static addDraw(
    draw: FakeDraw
  ) {

    this.history.push(draw);
  }


  // ==========================================
  // 🔢 GET NUMBERS ONLY
  // ==========================================

  static getNumbers() {

    this.init();

    return this.history.map(
      h => h.number
    );
  }
}