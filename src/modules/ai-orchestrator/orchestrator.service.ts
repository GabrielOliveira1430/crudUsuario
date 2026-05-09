// src/modules/ai-orchestrator/orchestrator.service.ts

import {
  LearningEngine
} from '../auto-learning/learning.engine';

import {
  StrategyService
} from '../strategy-engine/strategy.service';

import {
  DecisionService
} from '../decision-engine/decision.service';

import {
  GeneratorService
} from '../generator/generator.service';

import {
  AnalyticsService
} from '../analytics/analytics.service';

import {
  SystemHealthEngine
} from '../self-improvement/system-health.engine';

import {
  ExplorationBalanceEngine
} from '../self-improvement/exploration-balance.engine';

import {
  StrategyRetirementEngine
} from '../self-improvement/strategy-retirement.engine';


// ==========================================
// 🧠 AI ORCHESTRATOR
// ==========================================

export class OrchestratorService {


  // ==========================================
  // 🚀 PIPELINE CENTRAL
  // ==========================================

  static run(
    history: string[]
  ) {

    if (
      !history ||
      !Array.isArray(history)
    ) {

      throw new Error(
        'History inválido'
      );
    }


    // ==========================================
    // 📊 1. ANALYTICS
    // ==========================================

    const analytics =
      AnalyticsService.getStats(
        history.map(Number)
      );


    // ==========================================
    // 🔥 HOT/COLD CONTEXT
    // ==========================================

    const hotNumbers =

      analytics.hotNumbers?.map(
        n => n.number
      ) || [];

    const coldNumbers =

      analytics.coldNumbers?.map(
        n => n.number
      ) || [];


    // ==========================================
    // 🧠 2. SYSTEM HEALTH
    // ==========================================

    const health =
      SystemHealthEngine.analyze();


    // ==========================================
    // ⚖️ 3. EXPLORATION BALANCE
    // ==========================================

    const balance =
      ExplorationBalanceEngine.analyze();


    // ==========================================
    // ☠️ 4. STRATEGY RETIREMENT
    // ==========================================

    const retirement =
      StrategyRetirementEngine.analyze();


    // ==========================================
    // 🎲 5. GENERATOR
    // ==========================================

    const generated =
      GeneratorService.generate({

        quantity: 50,

        size: 4,

        hotNumbers,

        coldNumbers,

        exploration:
          balance.exploration,

        exploitation:
          balance.exploitation,

        mode:
          balance.mode
      });


    // ==========================================
    // 🧠 6. STRATEGIES
    // ==========================================

    const strategies =
      StrategyService.runAll(
        history
      );


    // ==========================================
    // 🧪 7. DECISION ENGINE
    // ==========================================

    const decision =
      DecisionService.decide(
        history
      );


    // ==========================================
    // 🤖 8. AUTO LEARNING
    // ==========================================

    const learning =
      LearningEngine.learn(
        history
      );


    // ==========================================
    // 📈 SUMMARY
    // ==========================================

    const bestRanking =
      decision.ranking[0];


    // ==========================================
    // 🚨 GLOBAL ALERT LEVEL
    // ==========================================

    const alertLevel =

      health.status === 'critical'
        ? 'HIGH'

      : health.status === 'warning'
        ? 'MEDIUM'

      : 'LOW';


    // ==========================================
    // 🔥 OUTPUT FINAL
    // ==========================================

    return {

      analytics,

      generated,

      strategies,

      decision,

      learning,

      health,

      balance,

      retirement,

      system: {

        status:
          health.status,

        alertLevel,

        alerts:
          health.alerts,

        recommendations: [

          ...health.recommendations,

          ...balance.recommendations,

          ...retirement.recommendations
        ]
      },

      summary: {

        bestStrategy:
          decision.bestStrategy,

        totalStrategies:
          strategies.length,

        bestScore:
          bestRanking?.score || 0,

        bestAccuracy:
          bestRanking?.accuracy || 0,

        bestCoverage:
          bestRanking?.coverage || 0,

        bestDiversity:
          bestRanking?.diversity || 0,

        systemHealth:
          health.health,

        exploration:
          balance.exploration,

        exploitation:
          balance.exploitation,

        mode:
          balance.mode,

        retiredStrategies:
          retirement.retiredCount
      }
    };
  }
}