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

  static async run(
    history: string[]
  ) {

    console.log(
      '🚀 ORCHESTRATOR START'
    );

    const start =
      Date.now();

    // ==========================================
    // VALIDATION
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
    // FAST SYSTEMS
    // ==========================================

    console.log(
      '📊 ANALYTICS'
    );

    const analytics =
      AnalyticsService.getStats(
        history.map(Number)
      );

    console.log(
      '🧠 HEALTH'
    );

    const health =
      SystemHealthEngine.analyze();

    console.log(
      '⚖️ BALANCE'
    );

    const balance =
      ExplorationBalanceEngine.analyze();

    console.log(
      '☠️ RETIREMENT'
    );

    const retirement =
      StrategyRetirementEngine.analyze();

    // ==========================================
    // PARALLEL ENGINES
    // ==========================================

    console.log(
      '⚡ RUNNING PARALLEL ENGINES'
    );

    const [

      evolution,
      mutations,
      generated,
      learning

    ] = await Promise.all([

      StrategyEvolutionEngine.analyze(),

      MutationFactoryEngine
        .createMutations(),

      GeneratorService.generate({

        quantity: 20,

        size: 4,

        exploration:
          balance.exploration,

        exploitation:
          balance.exploitation,

        mode:
          balance.mode
      }),

      LearningEngine.learn(
        history
      )
    ]);

    // ==========================================
    // STRATEGIES
    // ==========================================

    console.log(
      '🎯 STRATEGIES'
    );

    const strategies =
      StrategyService.runAll(
        history
      );

    // ==========================================
    // DECISION
    // ==========================================

    console.log(
      '🧠 DECISION'
    );

    const decision =
      DecisionService.decide(
        history
      );

    // ==========================================
    // SUMMARY
    // ==========================================

    const bestRanking =
      decision.ranking?.[0];

    const alertLevel =

      health.status === 'critical'
        ? 'HIGH'

      : health.status === 'warning'
        ? 'MEDIUM'

      : 'LOW';

    console.log(
      '✅ ORCHESTRATOR FINISHED IN:',
      Date.now() - start,
      'ms'
    );

    // ==========================================
    // OUTPUT
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

      evolution,

      mutations,

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