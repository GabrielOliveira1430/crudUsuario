// src/modules/generator/generator.service.ts

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


// ==========================================
// 🎯 PARAMS
// ==========================================

type GenerateParams = {

  quantity: number;

  size: number;

  hotNumbers?: number[];

  coldNumbers?: number[];

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
  };
};


// ==========================================
// 🧠 ADAPTIVE GENERATOR
// ==========================================

export class GeneratorService {


  // ==========================================
  // 🎲 RANDOM BASE
  // ==========================================

  private static randomNumber(
    size: number
  ) {

    const max =
      Math.pow(10, size);

    return Math.floor(
      Math.random() * max
    )
      .toString()
      .padStart(size, '0');
  }


  // ==========================================
  // 🔥 HOT GENERATOR
  // ==========================================

  private static generateHot() {

    const hot = [

      '1234',
      '5678',
      '9999',
      '1111',
      '2222',
      '3333',
      '4444'
    ];

    return hot[
      Math.floor(
        Math.random() *
        hot.length
      )
    ];
  }


  // ==========================================
  // ❄️ COLD GENERATOR
  // ==========================================

  private static generateCold() {

    const cold = [

      '8080',
      '7070',
      '6060',
      '5050',
      '4040'
    ];

    return cold[
      Math.floor(
        Math.random() *
        cold.length
      )
    ];
  }


  // ==========================================
  // 🧠 STRATEGY WEIGHTS
  // ==========================================

  private static getWeights() {

    const memory =
      LearningMemory.getAll();

    const hot =
      memory.find(
        m => m.name === 'hot'
      )?.weight || 1;

    const cold =
      memory.find(
        m => m.name === 'cold'
      )?.weight || 1;

    const random =
      memory.find(
        m => m.name === 'random'
      )?.weight || 1;

    return {
      hot,
      cold,
      random
    };
  }


  // ==========================================
  // 🧠 BALANCED CLUSTER NUMBER
  // ==========================================

  private static generateBalancedRandom() {

    const existing =

      HistoryMemory
        .getAll()
        .map(h => h.number);

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

  static generate(
    params: GenerateParams
  ) {

    const {
      quantity,
      size,
      exploration = 50,
      exploitation = 50,
      mode = 'balanced'
    } = params;

    const weights =
      this.getWeights();

    const history =

      HistoryMemory
        .getAll()
        .map(h => h.number);

    const results:
      GeneratedResult[] = [];


    // ==========================================
    // 📊 TOTAL WEIGHT
    // ==========================================

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


      // ==========================================
      // 🚀 EXPLORATION BOOST
      // ==========================================

      if (
        mode === 'exploration'
      ) {

        // aumenta chance random
        roll +=
          weights.hot +
          weights.cold;
      }


      // ==========================================
      // 🎯 EXPLOITATION BOOST
      // ==========================================

      if (
        mode === 'exploitation'
      ) {

        // favorece melhores strategies
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
          this.generateHot();

        source =
          'hot';

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
          this.generateCold();

        source =
          'cold';

        weight =
          weights.cold;
      }


      // ==========================================
      // 🎲 BALANCED RANDOM
      // ==========================================

      else {

        const balanced =

          this.generateBalancedRandom();

        number =
          balanced.number;

        cluster =
          balanced.cluster;

        source =
          'random';

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
      // 🧠 CONFIDENCE
      // ==========================================

      const confidenceData =

        PredictionConfidenceEngine
          .calculate(

            number,

            history,

            source
          );


      // ==========================================
      // 🧠 FINAL CONFIDENCE
      // ==========================================

      const finalConfidence =

        Math.max(

          0,

          Math.min(

            100,

            confidenceData.confidence *

            (
              pattern.score / 100
            )
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
    // 🏆 SORT BY CONFIDENCE
    // ==========================================

    results.sort(
      (a, b) =>
        b.confidence -
        a.confidence
    );


    // ==========================================
    // 📊 COVERAGE ANALYTICS
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
    // 📊 FINAL
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