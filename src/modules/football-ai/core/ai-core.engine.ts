// src/modules/football-ai/core/ai-core.engine.ts

import {
  EvolutionaryLoopEngine
} from './evolutionary-loop.engine';

import {
  PatternDiscoveryEngine
} from './pattern-discovery.engine';

// ======================================
// ENGINE
// ======================================

export class AICoreEngine {

  static process() {

    // ======================================
    // EVOLVE AI
    // ======================================

    const population =

      EvolutionaryLoopEngine
        .evolve();

    // ======================================
    // PATTERNS
    // ======================================

    const patterns =

      PatternDiscoveryEngine
        .analyze();

    // ======================================
    // BEST AI
    // ======================================

    const bestAI =

      EvolutionaryLoopEngine
        .best();

    return {

      bestAI,

      patterns,

      populationSize:
        population.length,

      evolvedAt:
        new Date().toISOString()
    };
  }
}