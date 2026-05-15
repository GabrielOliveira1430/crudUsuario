// src/modules/football-ai/quantum/quantum-match.engine.ts

import type {
  FootballPrediction
} from '../../football/football.prediction.engine';

import type {
  QuantumSimulation,
  QuantumScenario,
  QuantumTimelineEvent,
  QuantumMarketSignal
} from '../quantum/football.quantum.types';

import type {
  Market
} from '../types/market.types';

// ======================================
// ⚛️ QUANTUM MATCH ENGINE
// ======================================

export class QuantumMatchEngine {

  // ======================================
  // SAFE
  // ======================================

  private static safe(
    value: number,
    min = 0,
    max = 100
  ) {

    return Number(
      Math.max(
        min,
        Math.min(max, value)
      ).toFixed(2)
    );
  }

  // ======================================
  // RANDOM
  // ======================================

  private static random() {

    return Math.random();
  }

  // ======================================
  // POISSON
  // ======================================

  private static poisson(
    lambda: number
  ) {

    const L =
      Math.exp(-lambda);

    let k = 0;

    let p = 1;

    do {

      k++;

      p *= this.random();

    } while (p > L);

    return k - 1;
  }

  // ======================================
  // MARKET SIGNAL
  // ======================================

  private static buildMarketSignal(
    prediction: FootballPrediction,
    confidence: number
  ): QuantumMarketSignal {

    const fairOdd =
      Number(
        (
          100 / Math.max(confidence, 1)
        ).toFixed(2)
      );

    const edge =
      Number(
        (
          confidence -
          prediction.risk
        ).toFixed(2)
      );

    let recommendation:
      | 'SKIP'
      | 'RISKY'
      | 'GOOD'
      | 'STRONG'
      | 'ELITE' =
      'RISKY';

    if (confidence >= 90) {

      recommendation = 'ELITE';

    } else if (confidence >= 80) {

      recommendation = 'STRONG';

    } else if (confidence >= 65) {

      recommendation = 'GOOD';

    } else if (confidence <= 45) {

      recommendation = 'SKIP';
    }

    return {

      market:
        prediction.market,

      confidence,

      edge,

      fairOdd,

      recommendation
    };
  }

  // ======================================
  // MARKET DETECTOR
  // ======================================

  private static detectBestMarket(
    prediction: FootballPrediction,
    totalGoals: number,
    bttsProbability: number
  ): Market {

    // ======================================
    // NO BET
    // ======================================

    if (
      prediction.confidence < 50
    ) {

      return 'NO_BET';
    }

    // ======================================
    // BTTS
    // ======================================

    if (
      bttsProbability >= 72
    ) {

      return 'BTTS';
    }

    // ======================================
    // GOALS
    // ======================================

    if (
      totalGoals >= 3.2
    ) {

      return 'OVER_2_5';
    }

    if (
      totalGoals >= 2
    ) {

      return 'OVER_1_5';
    }

    // ======================================
    // WINNERS
    // ======================================

    if (
      prediction.prediction === 'HOME'
    ) {

      return 'HOME_WIN';
    }

    if (
      prediction.prediction === 'AWAY'
    ) {

      return 'AWAY_WIN';
    }

    // ======================================
    // DRAW
    // ======================================

    return 'DRAW';
  }

  // ======================================
  // 🎯 SINGLE SIMULATION
  // ======================================

  static simulate(
    prediction: FootballPrediction
  ): QuantumSimulation {

    const simulations = 10000;

    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;

    let totalHomeGoals = 0;
    let totalAwayGoals = 0;

    let bttsHits = 0;

    const scenarios:
      QuantumScenario[] = [];

    const timeline:
      QuantumTimelineEvent[] = [];

    // ======================================
    // BASE
    // ======================================

    const homeBase =
      Math.max(
        0.35,
        prediction.expectedGoalsHome
      );

    const awayBase =
      Math.max(
        0.35,
        prediction.expectedGoalsAway
      );

    // ======================================
    // 🧪 MONTE CARLO
    // ======================================

    for (
      let i = 0;
      i < simulations;
      i++
    ) {

      const homeGoals =
        Math.min(
          this.poisson(homeBase),
          8
        );

      const awayGoals =
        Math.min(
          this.poisson(awayBase),
          8
        );

      totalHomeGoals +=
        homeGoals;

      totalAwayGoals +=
        awayGoals;

      if (homeGoals > awayGoals) {

        homeWins++;

      } else if (
        awayGoals > homeGoals
      ) {

        awayWins++;

      } else {

        draws++;
      }

      if (
        homeGoals >= 1 &&
        awayGoals >= 1
      ) {

        bttsHits++;
      }

      if (i < 15) {

        const totalGoals =
          homeGoals + awayGoals;

        const dangerous =
          totalGoals >= 4;

        scenarios.push({

          score:
            `${homeGoals}x${awayGoals}`,

          probability:
            Number(
              (
                Math.random() * 100
              ).toFixed(2)
            ),

          minute:
            Math.floor(
              Math.random() * 90
            ),

          nextGoalTeam:

            homeGoals >= awayGoals

              ? prediction.homeTeam

              : prediction.awayTeam,

          momentumShift:
            Math.random() > 0.7,

          dangerous,

          intensity:

            dangerous
              ? 'EXTREME'
              : totalGoals >= 3
                ? 'HIGH'
                : totalGoals >= 2
                  ? 'MEDIUM'
                  : 'LOW'
        });
      }
    }

    // ======================================
    // EXPECTED GOALS
    // ======================================

    const expectedGoalsHome =
      Number(
        (
          totalHomeGoals /
          simulations
        ).toFixed(2)
      );

    const expectedGoalsAway =
      Number(
        (
          totalAwayGoals /
          simulations
        ).toFixed(2)
      );

    const totalExpectedGoals =
      Number(
        (
          expectedGoalsHome +
          expectedGoalsAway
        ).toFixed(2)
      );

    // ======================================
    // WIN %
    // ======================================

    const winProbabilityHome =
      Number(
        (
          (
            homeWins /
            simulations
          ) * 100
        ).toFixed(2)
      );

    const winProbabilityAway =
      Number(
        (
          (
            awayWins /
            simulations
          ) * 100
        ).toFixed(2)
      );

    const drawProbability =
      Number(
        (
          (
            draws /
            simulations
          ) * 100
        ).toFixed(2)
      );

    // ======================================
    // BTTS %
    // ======================================

    const bttsProbability =
      Number(
        (
          (
            bttsHits /
            simulations
          ) * 100
        ).toFixed(2)
      );

    // ======================================
    // NEXT GOAL
    // ======================================

    const baseNext =
      50 +
      (
        prediction.edge * 0.25
      );

    const nextGoalProbabilityHome =
      this.safe(
        baseNext,
        5,
        95
      );

    const nextGoalProbabilityAway =
      this.safe(
        100 - baseNext,
        5,
        95
      );

    // ======================================
    // CHAOS
    // ======================================

    const chaosLevel =
      this.safe(
        (
          (
            Math.abs(
              homeWins -
              awayWins
            ) /
            simulations
          ) * 100 +
          (
            prediction.chaosIndex *
            0.35
          )
        )
      );

    // ======================================
    // VOLATILITY
    // ======================================

    const volatilityIndex =
      this.safe(
        (
          drawProbability * 0.4 +
          chaosLevel * 0.6
        )
      );

    // ======================================
    // MARKET CONFIDENCE
    // ======================================

    const marketConfidence =
      this.safe(
        (
          prediction.confidence * 0.7 +
          (
            100 -
            volatilityIndex
          ) * 0.3
        )
      );

    // ======================================
    // VALUE RATING
    // ======================================

    let valueRating:
      | 'LOW'
      | 'MEDIUM'
      | 'HIGH'
      | 'ELITE' =
      'LOW';

    if (marketConfidence >= 88) {

      valueRating = 'ELITE';

    } else if (
      marketConfidence >= 75
    ) {

      valueRating = 'HIGH';

    } else if (
      marketConfidence >= 60
    ) {

      valueRating = 'MEDIUM';
    }

    // ======================================
    // TIMELINE
    // ======================================

    timeline.push({

      minute: 15,

      type: 'PRESSURE',

      probability:
        nextGoalProbabilityHome,

      team:
        prediction.homeTeam,

      description:
        'Pressão ofensiva inicial'
    });

    if (
      prediction.chaosIndex >= 70
    ) {

      timeline.push({

        minute: 65,

        type: 'CHAOS',

        probability:
          prediction.chaosIndex,

        description:
          'Partida altamente volátil'
      });
    }

    if (
      prediction.matchIntensity ===
      'EXTREME'
    ) {

      timeline.push({

        minute: 78,

        type: 'MOMENTUM',

        probability:
          prediction.confidence,

        description:
          'Momento explosivo detectado'
      });
    }

    // ======================================
    // MARKET FIX
    // ======================================

    const detectedMarket =
      this.detectBestMarket(
        prediction,
        totalExpectedGoals,
        bttsProbability
      );

    prediction.market =
      detectedMarket;

    // ======================================
    // MARKET SIGNAL
    // ======================================

    const bestMarket =
      this.buildMarketSignal(
        prediction,
        marketConfidence
      );

    // ======================================
    // RESULT
    // ======================================

    return {

      match:
        `${prediction.homeTeam} vs ${prediction.awayTeam}`,

      homeTeam:
        prediction.homeTeam,

      awayTeam:
        prediction.awayTeam,

      simulations,

      expectedGoalsHome,

      expectedGoalsAway,

      totalExpectedGoals,

      winProbabilityHome,

      winProbabilityAway,

      drawProbability,

      nextGoalProbabilityHome,

      nextGoalProbabilityAway,

      chaosLevel,

      volatilityIndex,

      confidence:
        prediction.confidence,

      marketConfidence,

      dominantTeam:
        prediction.winner,

      valueRating,

      momentumTrend:

        prediction.pressure
          ?.momentumShift
            ? 'UP'
            : 'STABLE',

      pressureTrend:

        prediction.matchIntensity ===
        'EXTREME'
          ? 'EXPLODING'
          : prediction.matchIntensity ===
            'HIGH'
              ? 'RISING'
              : 'STABLE',

      bestMarket,

      marketSignals: [
        bestMarket
      ],

      scenarios:
        scenarios.sort(
          (a, b) =>
            b.probability -
            a.probability
        ),

      timeline,

      dangerousMoments:

        scenarios.filter(
          s => s.dangerous
        ).length,

      explosivePotential:
        this.safe(
          prediction.chaosIndex
        ),

      comebackProbability:
        this.safe(
          volatilityIndex * 0.7
        ),

      collapseProbability:
        this.safe(
          chaosLevel * 0.6
        ),

      generatedAt:
        new Date().toISOString()
    };
  }

  // ======================================
  // 🚀 MULTI
  // ======================================

  static simulateMany(
    predictions: FootballPrediction[]
  ): QuantumSimulation[] {

    return predictions

      .map(
        prediction =>
          this.simulate(
            prediction
          )
      )

      .sort(
        (a, b) =>
          b.marketConfidence! -
          a.marketConfidence!
      );
  }
}

export const quantumMatchEngine =
  new QuantumMatchEngine();