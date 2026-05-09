// src/modules/auto-learning/learning.engine.ts

import {
  LearningMemory
} from './learning.memory';

import {
  StrategyService
} from '../strategy-engine/strategy.service';

import {
  TemporalWeightEngine
} from '../strategy-engine/temporal-weight.engine';


// ==========================================
// 🧠 AUTO LEARNING ENGINE
// ==========================================

export class LearningEngine {


  // ==========================================
  // 🚀 LEARN
  // ==========================================

  static learn(
    history: string[]
  ) {

    const results =
      StrategyService.runAll(
        history
      );


    // ==========================================
    // 🕒 HORA ATUAL
    // ==========================================

    const currentHour =
      new Date().getHours();


    // ==========================================
    // 🧠 LEARNING LOOP
    // ==========================================

    for (const r of results) {

      // ==========================================
      // 🌍 GLOBAL LEARNING
      // ==========================================

      LearningMemory.update(

        r.strategy,

        r.simulation.hits
      );


      // ==========================================
      // 🕒 TEMPORAL LEARNING
      // ==========================================

      TemporalWeightEngine.update(

        r.strategy,

        r.simulation.hits,

        currentHour
      );
    }


    // ==========================================
    // 📊 OUTPUT
    // ==========================================

    return {

      message:
        'Learning atualizado',

      globalMemory:
        LearningMemory.getAll(),

      temporalMemory:
        TemporalWeightEngine.getAll()
    };
  }


  // ==========================================
  // 🧠 SMART RANKING
  // ==========================================

  static getSmartRanking(
    history: string[]
  ) {

    const results =
      StrategyService.runAll(
        history
      );

    const currentHour =
      new Date().getHours();

    const memory =
      LearningMemory.getAll();


    // ==========================================
    // 📊 ENRICH
    // ==========================================

    const enriched =

      results.map(r => {

        const globalMemory =
          memory.find(
            m =>
              m.name ===
              r.strategy
          );

        const temporalWeight =

          TemporalWeightEngine.getWeight(

            r.strategy,

            currentHour
          );


        // ==========================================
        // ⚖️ WEIGHT FINAL
        // ==========================================

        const finalWeight =

          (
            (
              globalMemory?.weight || 1
            )
            +
            temporalWeight
          ) / 2;


        return {

          strategy:
            r.strategy,

          accuracy:
            r.simulation.accuracy,

          hits:
            r.simulation.hits,

          temporalWeight,

          globalWeight:
            globalMemory?.weight || 1,

          finalWeight
        };
      });


    // ==========================================
    // 🏆 SORT
    // ==========================================

    return enriched.sort(

      (a, b) =>

        (
          b.accuracy *
          b.finalWeight
        )

        -

        (
          a.accuracy *
          a.finalWeight
        )
    );
  }
}