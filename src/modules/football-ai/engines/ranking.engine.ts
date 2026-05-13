// src/modules/football-ai/engines/ranking.engine.ts

import type {
  QuantumAnalysis
} from './quantum-score.engine';

// ======================================
// TYPES
// ======================================

export type MatchPriority =

  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'MAXIMUM';

export type RankedMatch = {

  rank: number;

  match: string;

  score: number;

  signal: string;

  action: string;

  priority: MatchPriority;

  confidenceLevel: string;

  riskLevel: string;

  heatIndex: number;

  stabilityIndex: number;

  recommendation: string;

  reasons: string[];
};

// ======================================
// ENGINE
// ======================================

export class RankingEngine {

  // ======================================
  // ANALYZE
  // ======================================

  static analyze(
    quantumScores: QuantumAnalysis[]
  ): RankedMatch[] {

    const ranked =
      quantumScores.map(
        (item) => {

          // ==================================
          // HEAT INDEX
          // ==================================

          const heatIndex =
            Number(
              (
                item.quantumScore * 0.6 +

                item.eventScore * 0.3 +

                item.pressureScore * 0.1
              ).toFixed(2)
            );

          // ==================================
          // STABILITY
          // ==================================

          const stabilityIndex =
            Number(
              (
                100 -

                (
                  item.volatilityScore * 0.7
                )
              ).toFixed(2)
            );

          // ==================================
          // PRIORITY
          // ==================================

          let priority:
            MatchPriority;

          if (
            item.quantumScore >= 92
          ) {

            priority =
              'MAXIMUM';

          } else if (
            item.quantumScore >= 80
          ) {

            priority =
              'HIGH';

          } else if (
            item.quantumScore >= 60
          ) {

            priority =
              'MEDIUM';

          } else {

            priority =
              'LOW';
          }

          // ==================================
          // RECOMMENDATION
          // ==================================

          let recommendation =
            'WATCH';

          if (

            item.signal ===
              'GODLIKE' &&

            item.riskLevel ===
              'LOW'

          ) {

            recommendation =
              'AGGRESSIVE_ENTRY';
          }

          else if (

            item.signal ===
              'ELITE'

          ) {

            recommendation =
              'STRONG_ENTRY';
          }

          else if (

            item.signal ===
              'STRONG'

          ) {

            recommendation =
              'MODERATE_ENTRY';
          }

          else if (

            item.signal ===
              'WEAK'

          ) {

            recommendation =
              'AVOID';
          }

          return {

            rank: 0,

            match:
              item.match,

            score:
              item.quantumScore,

            signal:
              item.signal,

            action:
              item.action,

            priority,

            confidenceLevel:
              item.confidenceLevel,

            riskLevel:
              item.riskLevel,

            heatIndex,

            stabilityIndex,

            recommendation,

            reasons:
              item.reasons
          };
        }
      );

    // ======================================
    // SORT
    // ======================================

    ranked.sort(
      (a, b) =>
        b.score - a.score
    );

    // ======================================
    // RANKING
    // ======================================

    return ranked.map(
      (item, index) => ({

        ...item,

        rank:
          index + 1
      })
    );
  }

  // ======================================
  // TOP SIGNALS
  // ======================================

  static topSignals(
    ranked: RankedMatch[],
    limit = 5
  ) {

    return ranked
      .filter(
        item =>

          item.priority ===
            'MAXIMUM' ||

          item.priority ===
            'HIGH'
      )
      .slice(0, limit);
  }
}

export const rankingEngine =
  new RankingEngine();