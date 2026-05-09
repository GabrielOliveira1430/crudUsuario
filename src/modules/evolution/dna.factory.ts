// src/modules/evolution/dna.factory.ts

import {
  StrategyDNA
} from '../strategy-engine/strategy.types';


// ==========================================
// 🧬 DNA FACTORY
// ==========================================

export class DNAFactory {

  // ==========================================
  // 🎲 RANDOM DNA
  // ==========================================

  static random(): StrategyDNA {

    return {

      aggressiveness:
        Math.random(),

      randomness:
        Math.random(),

      hotBias:
        Math.random(),

      coldBias:
        Math.random(),

      mutationRate:
        Math.random(),

      confidenceBias:
        Math.random(),

      explorationRate:
        Math.random(),

      clusterPreference:
        this.randomCluster()
    };
  }


  // ==========================================
  // 🧬 MUTATE DNA
  // ==========================================

  static mutate(
    dna: StrategyDNA
  ): StrategyDNA {

    const mutation = (
      value: number
    ) => {

      return Math.min(
        1,
        Math.max(
          0,
          value +
          (
            (Math.random() - 0.5)
            * 0.2
          )
        )
      );
    };

    return {

      aggressiveness:
        mutation(
          dna.aggressiveness
        ),

      randomness:
        mutation(
          dna.randomness
        ),

      hotBias:
        mutation(
          dna.hotBias
        ),

      coldBias:
        mutation(
          dna.coldBias
        ),

      mutationRate:
        mutation(
          dna.mutationRate
        ),

      confidenceBias:
        mutation(
          dna.confidenceBias
        ),

      explorationRate:
        mutation(
          dna.explorationRate
        ),

      clusterPreference:
        dna.clusterPreference
    };
  }


  // ==========================================
  // 🎯 RANDOM CLUSTER
  // ==========================================

  private static randomCluster() {

    const clusters = [

      '0000-0999',
      '1000-1999',
      '2000-2999',
      '3000-3999',
      '4000-4999',
      '5000-5999',
      '6000-6999',
      '7000-7999',
      '8000-8999',
      '9000-9999'
    ];

    return clusters[
      Math.floor(
        Math.random() *
        clusters.length
      )
    ];
  }
}