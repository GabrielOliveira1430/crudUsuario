// src/modules/self-improvement/exploration-balance.engine.ts

import {
  LearningMemory
} from '../auto-learning/learning.memory';

import {
  SystemHealthEngine
} from './system-health.engine';


// ==========================================
// 📊 RESULT
// ==========================================

export type ExplorationBalanceResult = {

  exploration: number;

  exploitation: number;

  mode: string;

  recommendations: string[];
};


// ==========================================
// 🧠 EXPLORATION BALANCE ENGINE
// ==========================================

export class ExplorationBalanceEngine {


  // ==========================================
  // 🚀 MAIN
  // ==========================================

  static analyze():
    ExplorationBalanceResult {

    const memory =
      LearningMemory.getAll();

    const health =
      SystemHealthEngine.analyze();


    // ==========================================
    // 📊 BASE VALUES
    // ==========================================

    let exploration = 50;

    let exploitation = 50;


    // ==========================================
    // 📉 LOW HEALTH
    // ==========================================

    if (
      health.health < 40
    ) {

      exploration += 30;

      exploitation -= 30;
    }


    // ==========================================
    // ⚠️ WARNING
    // ==========================================

    else if (
      health.health < 70
    ) {

      exploration += 15;

      exploitation -= 15;
    }


    // ==========================================
    // 🏆 STRONG STRATEGY
    // ==========================================

    const dominant =
      memory.find(
        m => m.weight > 8
      );

    if (dominant) {

      exploitation += 20;

      exploration -= 20;
    }


    // ==========================================
    // 🧠 LOW DIVERSITY
    // ==========================================

    const lowStrategies =
      memory.filter(
        m => m.weight < 3
      ).length;

    if (
      lowStrategies >= 2
    ) {

      exploration += 15;
    }


    // ==========================================
    // 🔒 LIMITS
    // ==========================================

    exploration =
      Math.max(
        0,
        Math.min(100, exploration)
      );

    exploitation =
      Math.max(
        0,
        Math.min(100, exploitation)
      );


    // ==========================================
    // ⚖️ NORMALIZE
    // ==========================================

    const total =

      exploration +
      exploitation;

    exploration =
      (exploration / total) * 100;

    exploitation =
      (exploitation / total) * 100;


    // ==========================================
    // 🎯 MODE
    // ==========================================

    let mode = 'balanced';

    if (
      exploration > 65
    ) {

      mode = 'exploration';

    } else if (

      exploitation > 65
    ) {

      mode = 'exploitation';
    }


    // ==========================================
    // 💡 RECOMMENDATIONS
    // ==========================================

    const recommendations:
      string[] = [];


    if (
      mode === 'exploration'
    ) {

      recommendations.push(
        'generate_new_patterns'
      );

      recommendations.push(
        'mutate_strategies'
      );

      recommendations.push(
        'increase_cluster_diversity'
      );
    }


    if (
      mode === 'exploitation'
    ) {

      recommendations.push(
        'boost_top_strategy'
      );

      recommendations.push(
        'focus_high_confidence'
      );
    }


    if (
      mode === 'balanced'
    ) {

      recommendations.push(
        'maintain_equilibrium'
      );
    }


    // ==========================================
    // ✅ FINAL
    // ==========================================

    return {

      exploration:
        Number(
          exploration.toFixed(2)
        ),

      exploitation:
        Number(
          exploitation.toFixed(2)
        ),

      mode,

      recommendations
    };
  }
}