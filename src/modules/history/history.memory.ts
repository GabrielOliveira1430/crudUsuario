// src/modules/history/history.memory.ts

import prisma from '../../database/prisma';

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

  static async init() {

    // ==========================================
    // 🚫 JÁ CARREGADO
    // ==========================================

    if (
      this.history.length > 0
    ) {
      return;
    }

    try {

      console.log(
        '🧠 Carregando histórico do PostgreSQL...'
      );


      // ==========================================
      // 🗄️ LOAD DATABASE
      // ==========================================

      const draws =

        await prisma.drawHistory.findMany({

          orderBy: {
            createdAt: 'asc'
          },

          take: 10000
        });


      // ==========================================
      // 🧠 DATABASE → RAM
      // ==========================================

      this.history = draws.map(draw => ({

        number:
          draw.number,

        extractedAt:
          draw.createdAt,

        source:
          draw.source || 'db'
      }));


      // ==========================================
      // 🚨 FALLBACK
      // ==========================================

      if (
        this.history.length === 0
      ) {

        console.log(
          '⚠️ Banco vazio, gerando fake history...'
        );

        this.history =
          HistoryGenerator.generate(
            10000
          );
      }

      console.log(
        '✅ Histórico carregado:',
        this.history.length
      );

    } catch (error) {

      console.error(
        '🔴 Erro ao carregar histórico:',
        error
      );

      // ==========================================
      // 🚨 FAILSAFE
      // ==========================================

      this.history =
        HistoryGenerator.generate(
          10000
        );
    }
  }


  // ==========================================
  // 📋 GET ALL
  // ==========================================

  static async getAll() {

    await this.init();

    return this.history;
  }


  // ==========================================
  // ➕ ADD DRAW
  // ==========================================

  static async addDraw(
    draw: FakeDraw
  ) {

    // ==========================================
    // 🧠 RAM
    // ==========================================

    this.history.push(draw);


    // ==========================================
    // 🗄️ POSTGRESQL
    // ==========================================

    try {

      await prisma.drawHistory.create({

        data: {

          number:
            draw.number,

          source:
            draw.source,

          metadata: {

            extractedAt:
              draw.extractedAt
          }
        }
      });

    } catch (error) {

      console.error(
        '🔴 Erro ao salvar draw:',
        error
      );
    }
  }


  // ==========================================
  // 🔢 GET NUMBERS ONLY
  // ==========================================

  static async getNumbers() {

    await this.init();

    return this.history.map(
      h => h.number
    );
  }
}