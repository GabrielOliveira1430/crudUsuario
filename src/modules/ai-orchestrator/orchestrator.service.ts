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

import {
  StrategyEvolutionEngine
} from '../self-improvement/strategy-evolution.engine';

import {
  MutationFactoryEngine
} from '../self-improvement/mutation-factory.engine';


// ==========================================
// 🧠 AI ORCHESTRATOR
// ==========================================

export class OrchestratorService {


  // ==========================================
  // 🚀 PIPELINE CENTRAL
  // ==========================================

  static async run(
    history: string[]
  ) {

    // ==========================================
    // ✅ VALIDATION
    // ==========================================

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
    // 🧬 5. STRATEGY EVOLUTION
    // ==========================================

    const evolution =
      await StrategyEvolutionEngine
        .analyze();


    // ==========================================
    // 🧬 6. MUTATION FACTORY
    // ==========================================

    const mutations =
      await MutationFactoryEngine
        .createMutations();


    // ==========================================
    // 🎲 7. GENERATOR
    // ==========================================

    const generated =
      await GeneratorService.generate({

        quantity: 50,

        size: 4,

        exploration:
          balance.exploration,

        exploitation:
          balance.exploitation,

        mode:
          balance.mode
      });


    // ==========================================
    // 🧠 8. STRATEGIES
    // ==========================================

    const strategies =
      StrategyService.runAll(
        history
      );


    // ==========================================
    // 🧪 9. DECISION ENGINE
    // ==========================================

    const decision =
      DecisionService.decide(
        history
      );


    // ==========================================
    // 🤖 10. AUTO LEARNING
    // ==========================================

    const learning =
      await LearningEngine.learn(
        history
      );


    // ==========================================
    // 📈 SUMMARY
    // ==========================================

    const bestRanking =
      decision.ranking?.[0];


    // ==========================================
    // 🚨 ALERT LEVEL
    // ==========================================

    const alertLevel =

      health.status === 'critical'
        ? 'HIGH'

      : health.status === 'warning'
        ? 'MEDIUM'

      : 'LOW';


    // ==========================================
    // 🚀 FINAL OUTPUT
    // ==========================================

    return {

      // ==========================================
      // 📊 CORE
      // ==========================================

      analytics,

      generated,

      strategies,

      decision,

      learning,


      // ==========================================
      // 🧠 AI SYSTEMS
      // ==========================================

      health,

      balance,

      retirement,

      evolution,

      mutations,


      // ==========================================
      // 🖥 SYSTEM
      // ==========================================

      system: {

        status:
          health.status,

        alertLevel,

        alerts:
          health.alerts,

        recommendations: [

          ...health.recommendations,

          ...balance.recommendations,

          ...retirement.recommendations,

          ...evolution.recommendations,

          ...mutations.recommendations
        ]
      },


      // ==========================================
      // 📈 SUMMARY
      // ==========================================

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
          retirement.retiredCount,

        evolvedStrategies:
          evolution.bestStrategies.length,

        mutationsCreated:
          mutations.created.length
      }
    };
  }
}