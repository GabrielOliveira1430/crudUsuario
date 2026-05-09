// src/modules/self-optimization/self-optimization.engine.ts

import {
  LearningMemory
} from '../auto-learning/learning.memory';

import {
  OptimizationResult,
  StrategyHealth
} from './self-optimization.types';


// ==========================================
// 🧠 SELF OPTIMIZATION ENGINE
// ==========================================

export class SelfOptimizationEngine {


  // ==========================================
  // 🚀 ANALYZE
  // ==========================================

  static analyze():
    OptimizationResult {

    const memory =
      LearningMemory.getAll();

    const strategies:
      StrategyHealth[] = [];

    const recommendations:
      string[] = [];


    // ==========================================
    // 🧠 ANALYZE EACH
    // ==========================================

    for (const item of memory) {

      const successRate =

        item.runs > 0

          ? item.hits / item.runs

          : 0;


      const health =
        Number(
          (
            successRate *
            item.weight *
            10
          ).toFixed(2)
        );


      let status:
        StrategyHealth['status'] =
          'stable';


      // ==========================================
      // 🏆 DOMINANT
      // ==========================================

      if (health >= 70) {

        status =
          'dominant';

        recommendations.push(
          `Aumentar uso da strategy "${item.name}"`
        );
      }


      // ==========================================
      // ☠️ DEAD
      // ==========================================

      else if (health <= 10) {

        status =
          'dead';

        recommendations.push(
          `Desativar strategy "${item.name}"`
        );
      }


      // ==========================================
      // ⚠️ WEAK
      // ==========================================

      else if (health <= 30) {

        status =
          'weak';

        recommendations.push(
          `Reduzir peso da strategy "${item.name}"`
        );
      }


      strategies.push({

        strategy:
          item.name,

        weight:
          Number(
            item.weight.toFixed(2)
          ),

        runs:
          item.runs,

        hits:
          item.hits,

        successRate:
          Number(
            (
              successRate * 100
            ).toFixed(2)
          ),

        health,

        status
      });
    }


    // ==========================================
    // 📊 SUMMARY
    // ==========================================

    return {

      totalStrategies:
        strategies.length,

      dominantStrategies:

        strategies.filter(
          s => s.status === 'dominant'
        ).length,

      weakStrategies:

        strategies.filter(
          s => s.status === 'weak'
        ).length,

      deadStrategies:

        strategies.filter(
          s => s.status === 'dead'
        ).length,

      recommendations,

      strategies
    };
  }
}