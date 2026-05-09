// src/modules/decision-engine/decision.service.ts

import {
  StrategyService
} from '../strategy-engine/strategy.service';

import {
  LearningMemory
} from '../auto-learning/learning.memory';

import {
  StrategyScoreEngine
} from '../strategy-engine/strategy.score';


// ==========================================
// 🧠 ITEM DE RANKING
// ==========================================

type RankingItem = {

  strategy: string;

  accuracy: number;

  hits: number;

  weight: number;

  coverage: number;

  diversity: number;

  score: number;
};


// ==========================================
// 🎯 RESULTADO FINAL
// ==========================================

type DecisionResult = {

  bestStrategy: string;

  ranking: RankingItem[];
};


// ==========================================
// 🧠 DECISION ENGINE
// ==========================================

export class DecisionService {


  // ==========================================
  // 🔥 ESCOLHE MELHOR STRATEGY
  // ==========================================

  static decide(
    history: string[]
  ): DecisionResult {

    const results =
      StrategyService.runAll(
        history
      );


    // ==========================================
    // 🧠 RANKING
    // ==========================================

    const ranking: RankingItem[] =

      results.map(r => {

        // 🧠 memória da strategy
        const memory =
          LearningMemory.get(
            r.strategy
          );

        const weight =
          memory?.weight || 1;


        // 📊 score completo
        const scoreData =
          StrategyScoreEngine.evaluate(

            r.generated,

            r.simulation.accuracy,

            weight
          );

        return {

          strategy:
            r.strategy,

          accuracy:
            scoreData.accuracy,

          hits:
            r.simulation.hits,

          weight,

          coverage:
            scoreData.coverage,

          diversity:
            scoreData.diversity,

          score:
            scoreData.finalScore
        };
      })


      // 🔥 ordena por score
      .sort(
        (a, b) =>
          b.score - a.score
      );


    // ==========================================
    // 🏆 MELHOR
    // ==========================================

    const best =
      ranking[0];


    return {

      bestStrategy:
        best?.strategy || 'none',

      ranking
    };
  }
}