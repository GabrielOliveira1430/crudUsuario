// src/modules/self-improvement/mutation-factory.engine.ts

import {
  LearningMemory
} from '../auto-learning/learning.memory';

import {
  StrategyEvolutionEngine
} from './strategy-evolution.engine';


// ==========================================
// 🧬 MUTATION TYPE
// ==========================================

type MutationResult = {

  created: string[];

  skipped: string[];

  recommendations: string[];
};


// ==========================================
// 🧬 MUTATION FACTORY ENGINE
// ==========================================

export class MutationFactoryEngine {


  // ==========================================
  // 🚀 CREATE MUTATIONS
  // ==========================================

  static async createMutations():
    Promise<MutationResult> {

    const evolution =
      await StrategyEvolutionEngine
        .analyze();

    const created:
      string[] = [];

    const skipped:
      string[] = [];

    const recommendations:
      string[] = [];


    // ==========================================
    // 📊 NO BEST STRATEGIES
    // ==========================================

    if (
      !evolution.bestStrategies.length
    ) {

      recommendations.push(
        'Sem estratégias fortes suficientes'
      );

      return {

        created,

        skipped,

        recommendations
      };
    }


    // ==========================================
    // 🧬 CREATE HYBRIDS
    // ==========================================

    for (
      let i = 0;
      i < evolution.bestStrategies.length;
      i++
    ) {

      for (
        let j = i + 1;
        j < evolution.bestStrategies.length;
        j++
      ) {

        const mutation =

          `${evolution.bestStrategies[i]}-${evolution.bestStrategies[j]}`;


        // ==========================================
        // 🔍 EXISTS
        // ==========================================

        const exists =
          LearningMemory.get(
            mutation
          );

        if (exists) {

          skipped.push(
            mutation
          );

          continue;
        }


        // ==========================================
        // 🧠 CREATE STRATEGY
        // ==========================================

        await LearningMemory.initStrategy(
          mutation
        );


        // ==========================================
        // ⚖️ BOOST INITIAL
        // ==========================================

        const parentA =
          LearningMemory.get(
            evolution.bestStrategies[i]
          );

        const parentB =
          LearningMemory.get(
            evolution.bestStrategies[j]
          );

        const avgWeight =

          (
            (
              parentA?.weight || 1
            ) +

            (
              parentB?.weight || 1
            )
          ) / 2;


        // ==========================================
        // 🚀 UPDATE BOOST
        // ==========================================

        await LearningMemory.update(
          mutation,
          Math.floor(avgWeight)
        );

        created.push(
          mutation
        );
      }
    }


    // ==========================================
    // 📊 RECOMMENDATIONS
    // ==========================================

    if (created.length) {

      recommendations.push(
        'Novas mutações criadas'
      );
    }

    if (skipped.length) {

      recommendations.push(
        'Algumas mutações já existiam'
      );
    }


    // ==========================================
    // 📊 LOG
    // ==========================================

    console.log(

      `🧬 MutationFactory | Created: ${created.length} | Skipped: ${skipped.length}`
    );


    // ==========================================
    // 🚀 RESULT
    // ==========================================

    return {

      created,

      skipped,

      recommendations
    };
  }
}