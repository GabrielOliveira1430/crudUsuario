// src/modules/self-improvement/system-health.engine.ts

import {
  LearningMemory
} from '../auto-learning/learning.memory';


// ==========================================
// 📊 HEALTH RESULT
// ==========================================

export type SystemHealthResult = {

  health: number;

  status: string;

  metrics: {

    averageWeight: number;

    strategyCount: number;

    lowStrategies: number;

    highStrategies: number;

    stability: number;
  };

  alerts: string[];

  recommendations: string[];
};


// ==========================================
// 🧠 SYSTEM HEALTH ENGINE
// ==========================================

export class SystemHealthEngine {


  // ==========================================
  // 🚀 MAIN ANALYSIS
  // ==========================================

  static analyze(): SystemHealthResult {

    const memory =
      LearningMemory.getAll();

    if (memory.length === 0) {

      return {

        health: 0,

        status: 'empty',

        metrics: {

          averageWeight: 0,

          strategyCount: 0,

          lowStrategies: 0,

          highStrategies: 0,

          stability: 0
        },

        alerts: [
          'no_strategies'
        ],

        recommendations: [
          'initialize_strategies'
        ]
      };
    }


    // ==========================================
    // 📊 METRICS
    // ==========================================

    const totalWeight =

      memory.reduce(
        (acc, item) =>
          acc + item.weight,
        0
      );

    const averageWeight =

      totalWeight /
      memory.length;

    const lowStrategies =

      memory.filter(
        s => s.weight < 3
      ).length;

    const highStrategies =

      memory.filter(
        s => s.weight > 7
      ).length;


    // ==========================================
    // 📈 STABILITY
    // ==========================================

    const stability =

      Math.max(
        0,
        100 -
        (
          lowStrategies * 15
        )
      );


    // ==========================================
    // 🧠 HEALTH SCORE
    // ==========================================

    let health =

      (
        averageWeight * 10
      ) +
      stability;

    health = Math.min(
      100,
      Math.max(0, health)
    );


    // ==========================================
    // 🚨 ALERTS
    // ==========================================

    const alerts: string[] = [];

    if (lowStrategies > 0) {

      alerts.push(
        'low_performing_strategies'
      );
    }

    if (averageWeight < 4) {

      alerts.push(
        'weak_learning'
      );
    }

    if (highStrategies === 0) {

      alerts.push(
        'no_dominant_strategy'
      );
    }


    // ==========================================
    // 💡 RECOMMENDATIONS
    // ==========================================

    const recommendations: string[] = [];

    if (lowStrategies >= 2) {

      recommendations.push(
        'mutate_low_strategies'
      );
    }

    if (averageWeight < 5) {

      recommendations.push(
        'increase_exploration'
      );
    }

    if (highStrategies === 0) {

      recommendations.push(
        'boost_hot_strategy'
      );
    }


    // ==========================================
    // 📊 STATUS
    // ==========================================

    let status = 'stable';

    if (health < 40) {

      status = 'critical';

    } else if (health < 70) {

      status = 'warning';
    }


    // ==========================================
    // ✅ FINAL
    // ==========================================

    return {

      health:
        Number(
          health.toFixed(2)
        ),

      status,

      metrics: {

        averageWeight:
          Number(
            averageWeight.toFixed(2)
          ),

        strategyCount:
          memory.length,

        lowStrategies,

        highStrategies,

        stability:
          Number(
            stability.toFixed(2)
          )
      },

      alerts,

      recommendations
    };
  }
}