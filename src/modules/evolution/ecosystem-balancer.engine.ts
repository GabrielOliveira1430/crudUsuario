// src/modules/evolution/ecosystem-balancer.engine.ts

import {
  DominanceDetectionEngine
} from './dominance-detection.engine';

import {
  ExtinctionPreventionEngine
} from './extinction-prevention.engine';

import {
  LearningMemory
} from '../auto-learning/learning.memory';


// ==========================================
// ⚖️ BALANCE ACTION
// ==========================================

type BalanceAction = {

  target: string;

  type:
    | 'nerf'
    | 'boost'
    | 'mutation'
    | 'protection';

  intensity: number;

  reason: string;
};


// ==========================================
// 📊 BALANCER REPORT
// ==========================================

type BalancerReport = {

  stability: number;

  actions: BalanceAction[];

  ecosystemHealthy: boolean;

  mutationPressure: number;

  diversityIndex: number;
};


// ==========================================
// 🌎 ECOSYSTEM BALANCER ENGINE
// ==========================================

export class EcosystemBalancerEngine {


  // ==========================================
  // 🚀 MAIN BALANCE
  // ==========================================

  static balance():
    BalancerReport {

    const dominance =
      DominanceDetectionEngine
        .analyze();

    const extinction =
      ExtinctionPreventionEngine
        .analyze();

    const actions:
      BalanceAction[] = [];


    // ==========================================
    // 👑 HANDLE DOMINANCE
    // ==========================================

    for (
      const alert
      of dominance.alerts
    ) {

      actions.push({

        target:
          alert.species,

        type: 'nerf',

        intensity:
          alert.severity === 'high'
            ? 0.5
            : 0.2,

        reason:
          'species_dominance'
      });


      // 🔥 aplica redução
      this.adjustSpeciesWeight(

        alert.species,

        alert.severity === 'high'
          ? -0.5
          : -0.2
      );
    }


    // ==========================================
    // 🌱 HANDLE EXTINCTION
    // ==========================================

    for (
      const species
      of extinction
        .protectedSpecies
    ) {

      actions.push({

        target:
          species.species,

        type: 'boost',

        intensity:
          species.boost,

        reason:
          'extinction_prevention'
      });


      // 🔥 aplica boost
      this.adjustSpeciesWeight(

        species.species,

        species.boost
      );
    }


    // ==========================================
    // 🧬 MUTATION PRESSURE
    // ==========================================

    const mutationPressure =

      this.calculateMutationPressure(

        dominance.diversityScore,

        extinction.ecosystemStability
      );


    // ==========================================
    // 🧠 ECOSYSTEM HEALTH
    // ==========================================

    const ecosystemHealthy =

      dominance.ecosystemHealthy &&

      extinction.ecosystemStability >= 60;


    // ==========================================
    // 📊 FINAL
    // ==========================================

    return {

      stability:
        extinction.ecosystemStability,

      actions,

      ecosystemHealthy,

      mutationPressure,

      diversityIndex:
        dominance.diversityScore
    };
  }


  // ==========================================
  // 🧠 ADJUST SPECIES WEIGHT
  // ==========================================

  private static adjustSpeciesWeight(
    species: string,
    amount: number
  ) {

    const memory =
      LearningMemory.getAll();

    for (
      const item
      of memory
    ) {

      if (
        item.name.includes(species)
      ) {

        item.weight =
          Math.max(
            0.1,
            item.weight + amount
          );
      }
    }
  }


  // ==========================================
  // 🧬 MUTATION PRESSURE
  // ==========================================

  private static calculateMutationPressure(

    diversity: number,

    stability: number
  ) {

    let pressure = 1;


    // baixa diversidade
    if (
      diversity < 30
    ) {

      pressure += 1.5;
    }


    // baixa estabilidade
    if (
      stability < 50
    ) {

      pressure += 2;
    }


    return Number(
      pressure.toFixed(2)
    );
  }
}