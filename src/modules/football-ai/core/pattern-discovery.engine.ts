// src/modules/football-ai/core/pattern-discovery.engine.ts

import {
  learningMemory
} from '../learning/learning.memory';

// ======================================
// ENGINE
// ======================================

export class PatternDiscoveryEngine {

  static analyze() {

    const data =
      learningMemory.getAll();

    const patterns = {

      strongLeagues:
        new Map(),

      weakMarkets:
        new Map(),

      highAccuracyHours:
        new Map()
    };

    for (const item of data) {

      // ======================================
      // LEAGUES
      // ======================================

      const league =
        patterns.strongLeagues.get(
          item.league
        ) || 0;

      if (
        item.result === 'WIN'
      ) {

        patterns.strongLeagues.set(
          item.league,
          league + 1
        );
      }

      // ======================================
      // MARKETS
      // ======================================

      const market =
        patterns.weakMarkets.get(
          item.market
        ) || 0;

      if (
        item.result === 'LOSS'
      ) {

        patterns.weakMarkets.set(
          item.market,
          market + 1
        );
      }
    }

    return patterns;
  }
}