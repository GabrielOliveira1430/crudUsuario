// src/modules/evolution/extinction-prevention.engine.ts

import {
  AISpeciesEngine
} from './ai-species.engine';

import {
  DominanceDetectionEngine
} from './dominance-detection.engine';

import {
  StrategyRegistry
} from '../strategy-engine/strategy.registry';


// ==========================================
// 🌱 PROTECTED SPECIES
// ==========================================

type ProtectedSpecies = {

  species: string;

  population: number;

  risk: 'low' | 'medium' | 'high';

  action: string;

  boost: number;
};


// ==========================================
// 📊 EXTINCTION REPORT
// ==========================================

type ExtinctionReport = {

  protectedSpecies:
    ProtectedSpecies[];

  extinctRiskCount: number;

  ecosystemStability: number;

  actions: string[];
};


// ==========================================
// 🧠 EXTINCTION PREVENTION ENGINE
// ==========================================

export class ExtinctionPreventionEngine {


  // ==========================================
  // 🚀 ANALYZE ECOSYSTEM
  // ==========================================

  static analyze():
    ExtinctionReport {

    const ecosystem =
      AISpeciesEngine.analyze();

    const dominance =
      DominanceDetectionEngine
        .analyze();

    const totalStrategies =

      StrategyRegistry
        .getAll()
        .length;

    const protectedSpecies:
      ProtectedSpecies[] = [];

    const actions:
      string[] = [];


    // ==========================================
    // 🌱 CHECK SPECIES RISK
    // ==========================================

    for (
      const species
      of ecosystem.species
    ) {

      const populationShare =

        totalStrategies > 0

          ? (
              species.population /
              totalStrategies
            ) * 100

          : 0;

      let risk:
        'low' |
        'medium' |
        'high' = 'low';

      let action =
        'none';

      let boost = 1;


      // ==========================================
      // 🚨 HIGH RISK
      // ==========================================

      if (
        populationShare <= 10
      ) {

        risk =
          'high';

        action =
          'forced_mutation_boost';

        boost =
          3;
      }


      // ==========================================
      // ⚠️ MEDIUM RISK
      // ==========================================

      else if (
        populationShare <= 20
      ) {

        risk =
          'medium';

        action =
          'reproduction_boost';

        boost =
          2;
      }


      // ==========================================
      // 🌱 PROTECTION
      // ==========================================

      if (
        risk !== 'low'
      ) {

        protectedSpecies.push({

          species:
            species.name,

          population:
            species.population,

          risk,

          action,

          boost
        });

        actions.push(

          `${species.name}:${action}`
        );
      }
    }


    // ==========================================
    // 🧠 STABILITY SCORE
    // ==========================================

    let ecosystemStability = 100;


    // 🚨 penalidade por dominância
    if (
      dominance.alerts.length > 0
    ) {

      ecosystemStability -=
        dominance.alerts.length * 15;
    }


    // 🚨 penalidade por extinção
    ecosystemStability -=

      protectedSpecies.length * 10;


    // ==========================================
    // 🔒 LIMITS
    // ==========================================

    ecosystemStability = Math.max(
      0,
      ecosystemStability
    );


    // ==========================================
    // 📊 FINAL
    // ==========================================

    return {

      protectedSpecies,

      extinctRiskCount:
        protectedSpecies.length,

      ecosystemStability,

      actions
    };
  }
}