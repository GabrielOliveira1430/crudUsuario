import {
  LearningMemory
} from '../auto-learning/learning.memory';

import {
  PredictionConfidenceEngine
} from '../prediction/prediction-confidence.engine';

import {
  HistoryMemory
} from '../history/history.memory';

import {
  ClusterCoverageEngine
} from './cluster-coverage.engine';

import {
  PatternDetectionEngine
} from '../pattern/pattern-detection.engine';

import {
  FrequencyAnalysisEngine
} from '../analytics/frequency-analysis.engine';

import {
  FootballProvider
} from '../football/football.provider';

import {
  FootballAnalytics
} from '../football/football.analytics';


// ==========================================
// 🎯 PARAMS
// ==========================================

type GenerateParams = {

  quantity: number;

  size?: number;

  exploration?: number;

  exploitation?: number;

  mode?: string;
};


// ==========================================
// 🎲 RESULT
// ==========================================

type GeneratedResult = {

  number: string;

  source: string;

  weight: number;

  confidence: number;

  cluster: string;

  patternScore: number;

  patternTags: string[];

  factors: {

    frequency: number;

    temporal: number;

    learning: number;

    diversity: number;

    recency: number;

    trend: number;
  };
};


// ==========================================
// 🧠 GENERATOR SERVICE
// ==========================================

export class GeneratorService {


  // ==========================================
  // 📊 STRATEGY WEIGHTS
  // ==========================================

  private static getWeights() {

    const memory =
      LearningMemory.getAll();

    return {

      hot:
        memory.find(
          m => m.name === 'hot'
        )?.weight || 1,

      cold:
        memory.find(
          m => m.name === 'cold'
        )?.weight || 1,

      random:
        memory.find(
          m => m.name === 'random'
        )?.weight || 1
    };
  }


  // ==========================================
  // 🔥 HOT NUMBER
  // ==========================================

  private static async generateHot() {

    const hot =

      await FrequencyAnalysisEngine
        .getHotNumbers(30);

    if (!hot.length) {

      return '1234';
    }

    return hot[
      Math.floor(
        Math.random() *
        hot.length
      )
    ].number;
  }


  // ==========================================
  // ❄️ COLD NUMBER
  // ==========================================

  private static async generateCold() {

    const cold =

      await FrequencyAnalysisEngine
        .getColdNumbers(30);

    if (!cold.length) {

      return '0000';
    }

    return cold[
      Math.floor(
        Math.random() *
        cold.length
      )
    ].number;
  }


  // ==========================================
  // 🎲 RANDOM CLUSTER
  // ==========================================

  private static async generateBalancedRandom() {

    const existingData =
      await HistoryMemory.getAll();

    const existing =
      existingData.map(
        h => h.number
      );

    const lightest =

      ClusterCoverageEngine
        .getLightestCluster(
          existing
        );

    const generated =

      ClusterCoverageEngine
        .generateInsideCluster(

          lightest.min,

          lightest.max
        );

    return {

      number:
        generated
          .toString()
          .padStart(4, '0'),

      cluster:
        lightest.cluster
    };
  }


  // ==========================================
  // 🚀 MAIN GENERATOR
  // ==========================================

  static async generate(
    params: GenerateParams
  ) {

    const {
      quantity,
      exploration = 50,
      exploitation = 50,
      mode = 'balanced'
    } = params;

    const weights =
      this.getWeights();

    const historyData =
      await HistoryMemory.getAll();

    const history =
      historyData.map(
        h => h.number
      );

    const results:
      GeneratedResult[] = [];


    // ==========================================
    // ⚽ FOOTBALL ANALYTICS
    // ==========================================

    let footballBoost = 0;

    try {

      const footballData =

        await FootballProvider
          .getLiveMatches();

      if (footballData.success) {

        const footballStats =

          FootballAnalytics.analyze(
            footballData.matches
          );

        footballBoost =

          footballStats.length > 0
            ? 5
            : 0;

        console.log(
          '⚽ Football analytics ativo'
        );
      }

    } catch (error) {

      console.log(
        '⚠️ Football analytics offline'
      );
    }

    const totalWeight =

      weights.hot +
      weights.cold +
      weights.random;


    // ==========================================
    // 🎲 GENERATION LOOP
    // ==========================================

    for (
      let i = 0;
      i < quantity;
      i++
    ) {

      let roll =
        Math.random() *
        totalWeight;

      // exploration
      if (
        mode === 'exploration'
      ) {

        roll +=
          weights.hot +
          weights.cold;
      }

      // exploitation
      if (
        mode === 'exploitation'
      ) {

        roll *= 0.6;
      }

      let number = '';

      let source = '';

      let weight = 1;

      let cluster = '';


      // ==========================================
      // 🔥 HOT
      // ==========================================

      if (
        roll < weights.hot
      ) {

        number =
          await this.generateHot();

        source = 'hot';

        weight =
          weights.hot;
      }


      // ==========================================
      // ❄️ COLD
      // ==========================================

      else if (

        roll <

        (
          weights.hot +
          weights.cold
        )
      ) {

        number =
          await this.generateCold();

        source = 'cold';

        weight =
          weights.cold;
      }


      // ==========================================
      // 🎲 RANDOM
      // ==========================================

      else {

        const balanced =

          await this.generateBalancedRandom();

        number =
          balanced.number;

        cluster =
          balanced.cluster;

        source = 'random';

        weight =
          weights.random;
      }


      // ==========================================
      // 📊 CLUSTER DETECTION
      // ==========================================

      if (!cluster) {

        const detected =

          ClusterCoverageEngine
            .analyze([number])[0];

        cluster =
          detected.cluster;
      }


      // ==========================================
      // 🧠 PATTERN ANALYSIS
      // ==========================================

      const pattern =

        PatternDetectionEngine
          .analyze(number);


      // ==========================================
      // 📊 CONFIDENCE
      // ==========================================

      const confidenceData =

        await PredictionConfidenceEngine
          .calculate(

            number,

            history,

            source
          );


      // ==========================================
      // 🧠 FINAL SCORE
      // ==========================================

      const finalConfidence =

        Math.max(

          0,

          Math.min(

            100,

            (

              confidenceData.confidence *

              (
                pattern.score / 100
              )

            ) + footballBoost
          )
        );


      // ==========================================
      // 📊 RESULT
      // ==========================================

      results.push({

        number,

        source,

        weight,

        cluster,

        confidence:
          Number(
            finalConfidence.toFixed(2)
          ),

        patternScore:
          pattern.score,

        patternTags:
          pattern.tags,

        factors:
          confidenceData.factors
      });
    }


    // ==========================================
    // 🏆 SORT
    // ==========================================

    results.sort(
      (a, b) =>
        b.confidence -
        a.confidence
    );


    // ==========================================
    // 📊 COVERAGE
    // ==========================================

    const coverage =

      ClusterCoverageEngine
        .analyze(

          results.map(
            r => r.number
          )
        );


    // ==========================================
    // 📊 PATTERN SUMMARY
    // ==========================================

    const patternSummary = {

      repetitive:

        results.filter(r =>

          r.patternTags.includes(
            'repetitive'
          )

        ).length,

      sequential:

        results.filter(r =>

          r.patternTags.includes(
            'sequential'
          )

        ).length,

      mirrored:

        results.filter(r =>

          r.patternTags.includes(
            'mirrored'
          )

        ).length,

      highDiversity:

        results.filter(r =>

          r.patternTags.includes(
            'high-diversity'
          )

        ).length
    };


    // ==========================================
    // 🚀 FINAL
    // ==========================================

    return {

      total:
        results.length,

      numbers:
        results,

      weights,

      exploration,

      exploitation,

      mode,

      coverage,

      patternSummary
    };
  }
}