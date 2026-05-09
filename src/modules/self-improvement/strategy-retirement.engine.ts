// src/modules/self-improvement/strategy-retirement.engine.ts

import {
  LearningMemory
} from '../auto-learning/learning.memory';


// ==========================================
// 📊 RETIRED STRATEGY
// ==========================================

export type RetiredStrategy = {

  name: string;

  reason: string;

  weight: number;

  hits: number;

  runs: number;
};


// ==========================================
// 📊 RESULT
// ==========================================

export type RetirementResult = {

  retired: RetiredStrategy[];

  active: number;

  retiredCount: number;

  recommendations: string[];
};


// ==========================================
// 🧠 STRATEGY RETIREMENT ENGINE
// ==========================================

export class StrategyRetirementEngine {


  // ==========================================
  // 🚀 MAIN
  // ==========================================

  static analyze():
    RetirementResult {

    const memory =
      LearningMemory.getAll();

    const retired:
      RetiredStrategy[] = [];

    const recommendations:
      string[] = [];


    // ==========================================
    // 🔍 ANALYZE
    // ==========================================

    for (const strategy of memory) {

      let reason = '';


      // ==========================================
      // ❌ VERY LOW WEIGHT
      // ==========================================

      if (
        strategy.weight < 2 &&
        strategy.runs > 10
      ) {

        reason =
          'low_weight';
      }


      // ==========================================
      // ❌ BAD HIT RATE
      // ==========================================

      const averageHits =

        strategy.runs > 0

          ? strategy.hits /
            strategy.runs

          : 0;

      if (
        averageHits < 0.5 &&
        strategy.runs > 20
      ) {

        reason =
          'low_hit_rate';
      }


      // ==========================================
      // ❌ DEAD STRATEGY
      // ==========================================

      if (
        strategy.hits === 0 &&
        strategy.runs > 30
      ) {

        reason =
          'dead_strategy';
      }


      // ==========================================
      // 📊 RETIRE
      // ==========================================

      if (reason) {

        retired.push({

          name:
            strategy.name,

          reason,

          weight:
            Number(
              strategy.weight
                .toFixed(2)
            ),

          hits:
            strategy.hits,

          runs:
            strategy.runs
        });
      }
    }


    // ==========================================
    // 💡 RECOMMENDATIONS
    // ==========================================

    if (
      retired.length > 0
    ) {

      recommendations.push(
        'mutate_retired_strategies'
      );

      recommendations.push(
        'increase_exploration'
      );
    }


    if (
      retired.length >= 3
    ) {

      recommendations.push(
        'rebalance_system'
      );
    }


    // ==========================================
    // 📊 ACTIVE
    // ==========================================

    const active =

      memory.length -
      retired.length;


    // ==========================================
    // ✅ FINAL
    // ==========================================

    return {

      retired,

      active,

      retiredCount:
        retired.length,

      recommendations
    };
  }
}