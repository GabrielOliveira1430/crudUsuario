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

  static async learn(
    history: string[]
  ) {

    const results =

      StrategyService.runAll(
        history
      );


    // ==========================================
    // 🕒 CURRENT HOUR
    // ==========================================

    const currentHour =
      new Date().getHours();


    // ==========================================
    // 📊 SUMMARY
    // ==========================================

    let totalHits = 0;

    let totalAccuracy = 0;


    // ==========================================
    // 🧠 LEARNING LOOP
    // ==========================================

    for (const r of results) {

      const hits =
        r.simulation.hits;

      const accuracy =
        r.simulation.accuracy;

      totalHits += hits;

      totalAccuracy += accuracy;


      // ==========================================
      // 🌍 GLOBAL MEMORY
      // ==========================================

      await LearningMemory.update(

        r.strategy,

        hits
      );


      // ==========================================
      // 🕒 TEMPORAL MEMORY
      // ==========================================

      await TemporalWeightEngine.update(

        r.strategy,

        hits,

        currentHour
      );
    }


    // ==========================================
    // 📊 AVERAGES
    // ==========================================

    const averageAccuracy =

      results.length > 0

        ? totalAccuracy / results.length

        : 0;


    // ==========================================
    // 🏆 BEST STRATEGY
    // ==========================================

    const best =

      results.sort(

        (a, b) =>

          b.simulation.accuracy -

          a.simulation.accuracy

      )[0];


    // ==========================================
    // 📊 OUTPUT
    // ==========================================

    return {

      success: true,

      message:
        'Learning atualizado com sucesso',

      processedStrategies:
        results.length,

      totalHits,

      averageAccuracy:
        Number(
          averageAccuracy.toFixed(2)
        ),

      bestStrategy:
        best?.strategy || null,

      bestAccuracy:
        best?.simulation.accuracy || 0,

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
        // ⚖️ FINAL WEIGHT
        // ==========================================

        const finalWeight =

          (
            (
              globalMemory?.weight || 1
            )

            +

            temporalWeight

          ) / 2;


        // ==========================================
        // 📊 SMART SCORE
        // ==========================================

        const smartScore =

          (
            r.simulation.accuracy *
            0.6
          )

          +

          (
            finalWeight * 10 *
            0.4
          );


        return {

          strategy:
            r.strategy,

          accuracy:
            Number(
              r.simulation.accuracy
                .toFixed(2)
            ),

          hits:
            r.simulation.hits,

          temporalWeight:
            Number(
              temporalWeight
                .toFixed(2)
            ),

          globalWeight:
            Number(
              (
                globalMemory?.weight || 1
              ).toFixed(2)
            ),

          finalWeight:
            Number(
              finalWeight.toFixed(2)
            ),

          smartScore:
            Number(
              smartScore.toFixed(2)
            )
        };
      });


    // ==========================================
    // 🏆 SORT
    // ==========================================

    return enriched.sort(

      (a, b) =>

        b.smartScore -

        a.smartScore
    );
  }


  // ==========================================
  // 🧠 GET DOMINANT STRATEGY
  // ==========================================

  static getDominantStrategy(
    history: string[]
  ) {

    const ranking =
      this.getSmartRanking(
        history
      );

    return ranking[0] || null;
  }


  // ==========================================
  // 📊 SYSTEM INSIGHTS
  // ==========================================

  static getInsights(
    history: string[]
  ) {

    const ranking =
      this.getSmartRanking(
        history
      );

    const dominant =
      ranking[0];

    const weakest =
      ranking[
        ranking.length - 1
      ];


    return {

      dominantStrategy:
        dominant?.strategy || null,

      dominantScore:
        dominant?.smartScore || 0,

      weakestStrategy:
        weakest?.strategy || null,

      weakestScore:
        weakest?.smartScore || 0,

      totalStrategies:
        ranking.length,

      averageScore:

        ranking.length > 0

          ? Number(

              (
                ranking.reduce(

                  (acc, item) =>

                    acc +
                    item.smartScore,

                  0
                )

                /

                ranking.length

              ).toFixed(2)
            )

          : 0
    };
  }
}