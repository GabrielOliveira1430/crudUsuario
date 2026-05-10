// src/modules/auto-learning/learning.memory.ts

import prisma from '../../database/prisma';


// ==========================================
// 🧠 MEMORY TYPE
// ==========================================

type StrategyMemory = {

  name: string;

  weight: number;

  hits: number;

  runs: number;

  successRate: number;

  lastUpdate: Date;

  streak: number;

  trend: number;
};


// ==========================================
// 🚀 LEARNING MEMORY
// ==========================================

export class LearningMemory {

  private static memory:
    Map<string, StrategyMemory> =
      new Map();


  // ==========================================
  // 🚀 INIT
  // ==========================================

  static async initialize() {

    const strategies =
      await prisma.strategyLearning.findMany();

    for (const strategy of strategies) {

      const successRate =

        strategy.runs > 0

          ? strategy.hits /
            strategy.runs

          : 0;

      this.memory.set(

        strategy.name,

        {

          name:
            strategy.name,

          weight:
            strategy.weight,

          hits:
            strategy.hits,

          runs:
            strategy.runs,

          successRate,

          lastUpdate:
            new Date(),

          streak: 0,

          trend: 0
        }
      );
    }

    console.log(

      `🧠 LearningMemory carregada: ${strategies.length} strategies`
    );
  }


  // ==========================================
  // 🔥 INIT STRATEGY
  // ==========================================

  static async initStrategy(
    name: string
  ) {

    if (!this.memory.has(name)) {

      const strategy: StrategyMemory = {

        name,

        weight: 1,

        hits: 0,

        runs: 0,

        successRate: 0,

        lastUpdate:
          new Date(),

        streak: 0,

        trend: 0
      };

      // RAM
      this.memory.set(
        name,
        strategy
      );

      // POSTGRES
      await prisma.strategyLearning.upsert({

        where: {
          name
        },

        update: {},

        create: {

          name,

          weight: 1,

          hits: 0,

          runs: 0
        }
      });

      console.log(
        '🧠 Nova strategy criada:',
        name
      );
    }
  }


  // ==========================================
  // 🚀 UPDATE LEARNING
  // ==========================================

  static async update(
    name: string,
    hits: number
  ) {

    await this.initStrategy(name);

    const data =
      this.memory.get(name)!;


    // ==========================================
    // 📊 RUNS
    // ==========================================

    data.runs += 1;

    data.hits += hits;


    // ==========================================
    // 📊 SUCCESS RATE
    // ==========================================

    data.successRate =

      data.runs > 0

        ? data.hits /
          data.runs

        : 0;


    // ==========================================
    // 🔥 STREAK SYSTEM
    // ==========================================

    if (hits > 0) {

      data.streak += 1;

    } else {

      data.streak -= 1;
    }


    // ==========================================
    // 📈 TREND
    // ==========================================

    data.trend =

      (
        data.successRate * 100
      ) +

      (
        data.streak * 2
      );


    // ==========================================
    // 🧠 ADAPTIVE WEIGHT
    // ==========================================

    const adaptiveWeight =

      (
        data.successRate * 10
      ) +

      (
        data.streak * 0.5
      ) +

      (
        data.trend * 0.05
      );


    data.weight = Math.max(

      0.1,

      Math.min(
        20,
        adaptiveWeight
      )
    );


    // ==========================================
    // 🕒 UPDATE TIME
    // ==========================================

    data.lastUpdate =
      new Date();


    // ==========================================
    // 💾 RAM
    // ==========================================

    this.memory.set(
      name,
      data
    );


    // ==========================================
    // 💾 DATABASE
    // ==========================================

    await prisma.strategyLearning.update({

      where: {
        name
      },

      data: {

        weight:
          data.weight,

        hits:
          data.hits,

        runs:
          data.runs
      }
    });


    // ==========================================
    // 📊 LOG
    // ==========================================

    console.log(

      `🧠 Strategy ${name} atualizada | ` +

      `Weight=${data.weight.toFixed(2)} | ` +

      `Hits=${data.hits} | ` +

      `Runs=${data.runs} | ` +

      `Streak=${data.streak}`
    );
  }


  // ==========================================
  // 🏆 BEST STRATEGIES
  // ==========================================

  static getBestStrategies(
    limit = 5
  ) {

    return Array.from(
      this.memory.values()
    )

      .sort(
        (a, b) =>
          b.weight - a.weight
      )

      .slice(0, limit);
  }


  // ==========================================
  // ⚠️ WORST STRATEGIES
  // ==========================================

  static getWorstStrategies(
    limit = 5
  ) {

    return Array.from(
      this.memory.values()
    )

      .sort(
        (a, b) =>
          a.weight - b.weight
      )

      .slice(0, limit);
  }


  // ==========================================
  // 📊 GLOBAL ANALYTICS
  // ==========================================

  static getAnalytics() {

    const strategies =
      Array.from(
        this.memory.values()
      );

    const totalRuns =

      strategies.reduce(
        (acc, s) =>
          acc + s.runs,
        0
      );

    const totalHits =

      strategies.reduce(
        (acc, s) =>
          acc + s.hits,
        0
      );

    const avgWeight =

      strategies.length > 0

        ? strategies.reduce(
            (acc, s) =>
              acc + s.weight,
            0
          ) / strategies.length

        : 0;

    return {

      totalStrategies:
        strategies.length,

      totalRuns,

      totalHits,

      averageWeight:
        Number(
          avgWeight.toFixed(2)
        ),

      bestStrategies:
        this.getBestStrategies(),

      worstStrategies:
        this.getWorstStrategies()
    };
  }


  // ==========================================
  // 📊 GET ALL
  // ==========================================

  static getAll() {

    return Array.from(
      this.memory.values()
    );
  }


  // ==========================================
  // 🔍 GET ONE
  // ==========================================

  static get(
    name: string
  ) {

    return this.memory.get(name);
  }
}