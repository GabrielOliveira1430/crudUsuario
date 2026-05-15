// src/modules/football-ai/engines/smart-money.engine.ts

import type {
  FootballMatch
} from '../../football/football.provider';

import type {
  FootballPrediction
} from '../../football/football.prediction.engine';

// ======================================
// TYPES
// ======================================

export type SmartMoneySignal = {

  match: string;

  homeTeam: string;

  awayTeam: string;

  publicBias: number;

  sharpMoney: number;

  marketMove:
    | 'UP'
    | 'DOWN'
    | 'STABLE';

  openingOdd?: number;

  currentOdd?: number;

  oddMovement?: number;

  liquidityScore: number;

  volatilityScore: number;

  isTrap: boolean;

  valueDetected: boolean;

  reverseLineMovement: boolean;

  confidence: number;

  edge: number;

  recommendation:
    | 'STRONG_VALUE'
    | 'VALUE'
    | 'NO_VALUE'
    | 'AVOID';

  reasons: string[];

  updatedAt: number;
};

// ======================================
// ENGINE
// ======================================

export class SmartMoneyEngine {

  // ======================================
  // HELPERS
  // ======================================

  private static clamp(
    value: number,
    min = 0,
    max = 100
  ) {

    return Math.max(
      min,
      Math.min(max, value)
    );
  }

  private static safe(
    value: number,
    fallback = 0
  ) {

    if (
      Number.isNaN(value) ||
      !Number.isFinite(value)
    ) {
      return fallback;
    }

    return value;
  }

  // ======================================
  // ANALYZE SINGLE
  // ======================================

  static analyze(
    match: FootballMatch,
    prediction?: FootballPrediction
  ): SmartMoneySignal {

    const reasons: string[] = [];

    // ======================================
    // BASE DATA
    // ======================================

    const confidence =
      this.safe(
        prediction?.confidence ?? 50,
        50
      );

    const edge =
      this.safe(
        prediction?.edge ?? 0
      );

    const risk =
      this.safe(
        prediction?.risk ?? 50,
        50
      );

    const fairOdd =
      this.safe(
        prediction?.fairOdd ?? 2,
        2
      );

    // ======================================
    // PUBLIC BIAS
    // ======================================

    let publicBias = 50;

    // confiança
    publicBias +=
      (confidence - 50) * 0.55;

    // mercado popular
    if (
      prediction?.market ===
      'OVER_2_5'
    ) {

      publicBias += 6;
    }

    if (
      prediction?.market ===
      'HOME_WIN'
    ) {

      publicBias += 4;
    }

    // draw normalmente menos popular
    if (
      prediction?.prediction ===
      'DRAW'
    ) {

      publicBias -= 10;
    }

    // caos reduz consenso
    if (
      prediction?.chaosIndex &&
      prediction.chaosIndex >= 75
    ) {

      publicBias -= 8;

      reasons.push(
        'Mercado instável pela alta volatilidade'
      );
    }

    publicBias =
      Number(
        this.clamp(
          publicBias,
          5,
          95
        ).toFixed(2)
      );

    // ======================================
    // SHARP MONEY
    // ======================================

    let sharpMoney =
      (
        edge * 1.25
      ) +

      (
        confidence * 0.55
      ) -

      (
        risk * 0.35
      ) +

      (
        100 - publicBias
      ) * 0.45;

    // pressão ofensiva ajuda leitura sharp
    if (
      prediction?.pressure?.dangerous
    ) {

      sharpMoney += 6;

      reasons.push(
        'Fluxo sharp alinhado com pressão ofensiva'
      );
    }

    if (
      prediction?.pressure?.momentumShift
    ) {

      sharpMoney += 4;

      reasons.push(
        'Momentum favorecendo entrada institucional'
      );
    }

    sharpMoney =
      Number(
        this.clamp(
          sharpMoney,
          5,
          95
        ).toFixed(2)
      );

    // ======================================
    // ODDS
    // ======================================

    const openingOdd =
      Number(
        (
          fairOdd +

          (
            confidence >= 75
              ? 0.18
              : 0.08
          )
        ).toFixed(2)
      );

    const currentOdd =
      Number(
        fairOdd.toFixed(2)
      );

    const oddMovement =
      Number(
        (
          openingOdd -
          currentOdd
        ).toFixed(2)
      );

    // ======================================
    // MARKET MOVE
    // ======================================

    let marketMove:
      | 'UP'
      | 'DOWN'
      | 'STABLE' =
      'STABLE';

    if (
      oddMovement >= 0.12
    ) {

      marketMove = 'DOWN';

      reasons.push(
        'Odds sofrendo queda forte'
      );

    } else if (
      oddMovement <= -0.12
    ) {

      marketMove = 'UP';

      reasons.push(
        'Odds subindo rapidamente'
      );
    }

    // ======================================
    // REVERSE LINE MOVEMENT
    // ======================================

    const reverseLineMovement =

      publicBias >= 70 &&

      marketMove === 'UP';

    if (
      reverseLineMovement
    ) {

      reasons.push(
        'Reverse line movement detectado'
      );
    }

    // ======================================
    // TRAP DETECTION
    // ======================================

    const isTrap =

      publicBias >= 78 &&

      sharpMoney <= 42;

    if (
      isTrap
    ) {

      reasons.push(
        'Possível armadilha de mercado'
      );
    }

    // ======================================
    // VALUE DETECTION
    // ======================================

    const valueDetected =

      sharpMoney >=
        publicBias + 7 &&

      edge >= 6 &&

      confidence >= 62;

    if (
      valueDetected
    ) {

      reasons.push(
        'Smart money favorável'
      );
    }

    // ======================================
    // VOLATILITY
    // ======================================

    const volatilityScore =
      Number(
        this.clamp(
          Math.abs(
            publicBias -
            sharpMoney
          ) * 1.4,
          0,
          100
        ).toFixed(2)
      );

    // ======================================
    // LIQUIDITY
    // ======================================

    const liquidityScore =
      Number(
        this.clamp(
          100 -
          (
            volatilityScore * 0.55
          ),
          20,
          100
        ).toFixed(2)
      );

    // ======================================
    // FINAL CONFIDENCE
    // ======================================

    const finalConfidence =
      Number(
        this.clamp(
          52 +

          (
            Math.abs(
              sharpMoney -
              publicBias
            ) * 0.75
          ) +

          (
            valueDetected
              ? 8
              : 0
          ) -

          (
            isTrap
              ? 12
              : 0
          ),

          5,
          95
        ).toFixed(2)
      );

    // ======================================
    // RECOMMENDATION
    // ======================================

    let recommendation:
      | 'STRONG_VALUE'
      | 'VALUE'
      | 'NO_VALUE'
      | 'AVOID';

    if (
      isTrap
    ) {

      recommendation =
        'AVOID';

    } else if (

      valueDetected &&

      finalConfidence >= 82

    ) {

      recommendation =
        'STRONG_VALUE';

    } else if (
      valueDetected
    ) {

      recommendation =
        'VALUE';

    } else {

      recommendation =
        'NO_VALUE';
    }

    // ======================================
    // EXTRA REASONS
    // ======================================

    if (
      liquidityScore >= 80
    ) {

      reasons.push(
        'Mercado com boa liquidez'
      );
    }

    if (
      volatilityScore >= 70
    ) {

      reasons.push(
        'Mercado altamente volátil'
      );
    }

    // ======================================
    // RESULT
    // ======================================

    return {

      match:
        `${match.homeTeam} vs ${match.awayTeam}`,

      homeTeam:
        match.homeTeam,

      awayTeam:
        match.awayTeam,

      publicBias,

      sharpMoney,

      marketMove,

      openingOdd,

      currentOdd,

      oddMovement,

      liquidityScore,

      volatilityScore,

      isTrap,

      valueDetected,

      reverseLineMovement,

      confidence:
        finalConfidence,

      edge:
        Number(
          (
            sharpMoney -
            publicBias
          ).toFixed(2)
        ),

      recommendation,

      reasons,

      updatedAt:
        Date.now()
    };
  }

  // ======================================
  // ANALYZE MANY
  // ======================================

  static analyzeMany(
    predictions:
      FootballPrediction[]
  ) {

    return predictions.map(
      prediction =>

        this.analyze(
          {

            homeTeam:
              prediction.homeTeam,

            awayTeam:
              prediction.awayTeam,

            league:
              '',

            status:
              'LIVE'
          } as FootballMatch,

          prediction
        )
    );
  }
}

export const smartMoneyEngine =
  new SmartMoneyEngine();