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

  quantumScore: number;

  eventScore: number;

  pressureScore: number;

  volatilityScore: number;

  safeEntry: boolean;

  trend:
    | 'BULLISH'
    | 'BEARISH'
    | 'NEUTRAL';

  expectedGoals: number;

  dangerLevel:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'EXTREME';
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
                Math.max(
                  0,
                  100 -

                  (
                    item.volatilityScore * 0.7
                  )
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
          // SAFE ENTRY
          // ==================================

          const safeEntry =

            item.quantumScore >= 75 &&

            item.riskLevel === 'LOW';

          // ==================================
          // TREND
          // ==================================

          let trend:
            | 'BULLISH'
            | 'BEARISH'
            | 'NEUTRAL';

          if (
            item.pressureScore >= 75
          ) {

            trend = 'BULLISH';

          } else if (
            item.pressureScore <= 40
          ) {

            trend = 'BEARISH';

          } else {

            trend = 'NEUTRAL';
          }

          // ==================================
          // EXPECTED GOALS
          // ==================================

          const expectedGoals =
            Number(
              (
                (
                  item.pressureScore / 35
                ) +

                (
                  item.eventScore / 80
                )
              ).toFixed(2)
            );

          // ==================================
          // DANGER LEVEL
          // ==================================

          let dangerLevel:
            | 'LOW'
            | 'MEDIUM'
            | 'HIGH'
            | 'EXTREME';

          if (
            item.volatilityScore >= 85
          ) {

            dangerLevel =
              'EXTREME';

          } else if (
            item.volatilityScore >= 65
          ) {

            dangerLevel =
              'HIGH';

          } else if (
            item.volatilityScore >= 40
          ) {

            dangerLevel =
              'MEDIUM';

          } else {

            dangerLevel =
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

          // ==================================
          // REASONS
          // ==================================

          const reasons = [
            ...item.reasons
          ];

          if (safeEntry) {

            reasons.push(
              'Entrada considerada segura pelo ranking'
            );
          }

          if (
            trend === 'BULLISH'
          ) {

            reasons.push(
              'Pressão ofensiva crescente'
            );
          }

          if (
            dangerLevel ===
            'EXTREME'
          ) {

            reasons.push(
              'Alta volatilidade detectada'
            );
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

            reasons,

            quantumScore:
              item.quantumScore,

            eventScore:
              item.eventScore,

            pressureScore:
              item.pressureScore,

            volatilityScore:
              item.volatilityScore,

            safeEntry,

            trend,

            expectedGoals,

            dangerLevel
          };
        }
      );

    // ======================================
    // SORT
    // ======================================

    ranked.sort(
      (a, b) => {

        if (
          b.score !== a.score
        ) {

          return (
            b.score - a.score
          );
        }

        return (
          b.heatIndex -
          a.heatIndex
        );
      }
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

  // ======================================
  // SAFE ENTRIES
  // ======================================

  static safeEntries(
    ranked: RankedMatch[],
    limit = 5
  ) {

    return ranked
      .filter(
        item =>
          item.safeEntry
      )
      .slice(0, limit);
  }

  // ======================================
  // HOT MATCHES
  // ======================================

  static hotMatches(
    ranked: RankedMatch[],
    limit = 5
  ) {

    return ranked

      .sort(
        (a, b) =>
          b.heatIndex -
          a.heatIndex
      )

      .slice(0, limit);
  }

  // ======================================
  // EXTREME VOLATILITY
  // ======================================

  static chaosMatches(
    ranked: RankedMatch[],
    limit = 5
  ) {

    return ranked

      .filter(
        item =>
          item.dangerLevel ===
          'EXTREME'
      )

      .slice(0, limit);
  }
}

export const rankingEngine =
  new RankingEngine();