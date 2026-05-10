// src/modules/self-improvement/strategy-evolution.engine.ts

import {
  FeedbackMemory
} from '../feedback/feedback.memory';

import {
  LearningMemory
} from '../auto-learning/learning.memory';


// ==========================================
// 📊 EVOLUTION RESULT
// ==========================================

type EvolutionResult = {

  bestStrategies: string[];

  worstStrategies: string[];

  retiredStrategies: string[];

  boostedStrategies: string[];

  mutations: string[];

  recommendations: string[];
};


// ==========================================
// 🧬 STRATEGY EVOLUTION ENGINE
// ==========================================

export class StrategyEvolutionEngine {


  // ==========================================
  // 🚀 ANALYZE
  // ==========================================

  static async analyze():
    Promise<EvolutionResult> {

    const feedbacks =
      await FeedbackMemory.getAll();

    const learning =
      LearningMemory.getAll();


    // ==========================================
    // 📊 EMPTY
    // ==========================================

    if (!feedbacks.length) {

      return {

        bestStrategies: [],

        worstStrategies: [],

        retiredStrategies: [],

        boostedStrategies: [],

        mutations: [],

        recommendations: [
          'Sem feedback suficiente'
        ]
      };
    }


    // ==========================================
    // 📊 STRATEGY MAP
    // ==========================================

    const map:
      Record<string, number[]> = {};

    for (const item of feedbacks) {

      if (!map[item.strategy]) {

        map[item.strategy] = [];
      }

      map[item.strategy]
        .push(item.accuracy);
    }


    // ==========================================
    // 📊 AVG
    // ==========================================

    const averages =
      Object.entries(map).map(

        ([strategy, values]) => {

          const avg =

            values.reduce(
              (a, b) => a + b,
              0
            ) / values.length;

          return {

            strategy,

            avg
          };
        }
      );


    // ==========================================
    // 🏆 BEST
    // ==========================================

    const bestStrategies =

      averages
        .filter(
          s => s.avg >= 60
        )
        .map(
          s => s.strategy
        );


    // ==========================================
    // ☠️ WORST
    // ==========================================

    const worstStrategies =

      averages
        .filter(
          s => s.avg <= 20
        )
        .map(
          s => s.strategy
        );


    // ==========================================
    // 🚀 BOOSTED
    // ==========================================

    const boostedStrategies =
      learning

        .filter(
          s => s.weight >= 5
        )

        .map(
          s => s.name
        );


    // ==========================================
    // ☠️ RETIRED
    // ==========================================

    const retiredStrategies =
      worstStrategies.filter(

        strategy => {

          const strategyMemory =
            learning.find(
              l => l.name === strategy
            );

          return (
            strategyMemory?.runs || 0
          ) > 10;
        }
      );


    // ==========================================
    // 🧬 MUTATIONS
    // ==========================================

    const mutations:
      string[] = [];

    for (
      let i = 0;
      i < bestStrategies.length;
      i++
    ) {

      for (
        let j = i + 1;
        j < bestStrategies.length;
        j++
      ) {

        mutations.push(

          `${bestStrategies[i]}-${bestStrategies[j]}`
        );
      }
    }


    // ==========================================
    // 📊 RECOMMENDATIONS
    // ==========================================

    const recommendations:
      string[] = [];


    if (bestStrategies.length) {

      recommendations.push(
        'Boost estratégias vencedoras'
      );
    }

    if (retiredStrategies.length) {

      recommendations.push(
        'Aposentar estratégias fracas'
      );
    }

    if (mutations.length) {

      recommendations.push(
        'Criar estratégias híbridas'
      );
    }


    // ==========================================
    // 🚀 RESULT
    // ==========================================

    return {

      bestStrategies,

      worstStrategies,

      retiredStrategies,

      boostedStrategies,

      mutations,

      recommendations
    };
  }
}