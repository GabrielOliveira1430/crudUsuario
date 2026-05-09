// src/modules/evolution/dominance-detection.engine.ts

import {
  AISpeciesEngine
} from './ai-species.engine';

import {
  StrategyRegistry
} from '../strategy-engine/strategy.registry';


// ==========================================
// 👑 DOMINANCE ALERT
// ==========================================

type DominanceAlert = {

  species: string;

  populationShare: number;

  severity: 'low' | 'medium' | 'high';

  action: string;
};


// ==========================================
// 📊 DOMINANCE REPORT
// ==========================================

type DominanceReport = {

  ecosystemHealthy: boolean;

  dominantSpecies?: string;

  alerts: DominanceAlert[];

  totalStrategies: number;

  totalSpecies: number;

  diversityScore: number;
};


// ==========================================
// 🧠 DOMINANCE DETECTION ENGINE
// ==========================================

export class DominanceDetectionEngine {


  // ==========================================
  // 🚀 ANALYZE DOMINANCE
  // ==========================================

  static analyze(): DominanceReport {

    const ecosystem =
      AISpeciesEngine.analyze();

    const totalStrategies =

      StrategyRegistry
        .getAll()
        .length;

    const alerts:
      DominanceAlert[] = [];


    // ==========================================
    // 🧬 ANALYZE SPECIES
    // ==========================================

    for (
      const species
      of ecosystem.species
    ) {

      const share =

        totalStrategies > 0

          ? (
              species.population /
              totalStrategies
            ) * 100

          : 0;

      let severity:
        'low' |
        'medium' |
        'high' = 'low';

      let action =
        'stable';


      // ==========================================
      // ⚠️ MEDIUM DOMINANCE
      // ==========================================

      if (
        share >= 40
      ) {

        severity =
          'medium';

        action =
          'monitor_population';
      }


      // ==========================================
      // 🚨 HIGH DOMINANCE
      // ==========================================

      if (
        share >= 60
      ) {

        severity =
          'high';

        action =
          'apply_evolutionary_pressure';
      }


      // ==========================================
      // 📊 ALERT
      // ==========================================

      if (
        severity !== 'low'
      ) {

        alerts.push({

          species:
            species.name,

          populationShare:
            Number(
              share.toFixed(2)
            ),

          severity,

          action
        });
      }
    }


    // ==========================================
    // 🧠 DIVERSITY SCORE
    // ==========================================

    const diversityScore =

      ecosystem.totalSpecies > 0

        ? Number(
            (
              ecosystem.totalSpecies /
              totalStrategies
            )
            .toFixed(2)
          ) * 100

        : 0;


    // ==========================================
    // 🌱 HEALTH STATUS
    // ==========================================

    const ecosystemHealthy =

      alerts.length === 0 &&
      diversityScore >= 30;


    // ==========================================
    // 👑 DOMINANT SPECIES
    // ==========================================

    const dominantSpecies =

      alerts
        .sort(
          (
            a,
            b
          ) =>

            b.populationShare -
            a.populationShare
        )[0]
        ?.species;


    // ==========================================
    // 📊 FINAL
    // ==========================================

    return {

      ecosystemHealthy,

      dominantSpecies,

      alerts,

      totalStrategies,

      totalSpecies:
        ecosystem.totalSpecies,

      diversityScore
    };
  }
}