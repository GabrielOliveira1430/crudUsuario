// src/modules/evolution/evolution-pressure.engine.ts

import {
  EcosystemBalancerEngine
} from './ecosystem-balancer.engine';

import {
  LearningMemory
} from '../auto-learning/learning.memory';


// ==========================================
// 🧬 PRESSURE TARGET
// ==========================================

type PressureTarget = {

  strategy: string;

  currentWeight: number;

  pressure: number;

  mutationBoost: number;

  crossoverBoost: number;

  risk: 'low' | 'medium' | 'high';
};


// ==========================================
// 📊 PRESSURE REPORT
// ==========================================

type EvolutionPressureReport = {

  globalPressure: number;

  mutationRate: number;

  crossoverRate: number;

  stagnationDetected: boolean;

  targets: PressureTarget[];

  ecosystemState:
    'stable' |
    'adaptive' |
    'critical';
};


// ==========================================
// 🚀 EVOLUTION PRESSURE ENGINE
// ==========================================

export class EvolutionPressureEngine {


  // ==========================================
  // 🚀 MAIN ANALYSIS
  // ==========================================

  static analyze():
    EvolutionPressureReport {

    const ecosystem =

      EcosystemBalancerEngine
        .balance();

    const memory =
      LearningMemory.getAll();

    const targets:
      PressureTarget[] = [];

    let stagnationDetected =
      false;


    // ==========================================
    // 📊 GLOBAL PRESSURE
    // ==========================================

    let globalPressure =

      ecosystem.mutationPressure;


    // ==========================================
    // 🧠 STRATEGY ANALYSIS
    // ==========================================

    for (
      const strategy
      of memory
    ) {

      const efficiency =

        strategy.runs > 0

          ? strategy.hits /
            strategy.runs

          : 0;

      let pressure = 1;

      let mutationBoost = 1;

      let crossoverBoost = 1;

      let risk:
        'low' |
        'medium' |
        'high' = 'low';


      // ==========================================
      // 🚨 STAGNATION
      // ==========================================

      if (
        efficiency < 0.3
      ) {

        pressure += 2;

        mutationBoost += 1.5;

        crossoverBoost += 1;

        risk = 'high';

        stagnationDetected = true;
      }


      // ==========================================
      // ⚠️ LOW PERFORMANCE
      // ==========================================

      else if (
        efficiency < 0.6
      ) {

        pressure += 1;

        mutationBoost += 0.5;

        crossoverBoost += 0.5;

        risk = 'medium';
      }


      // ==========================================
      // 📊 TARGET
      // ==========================================

      targets.push({

        strategy:
          strategy.name,

        currentWeight:
          strategy.weight,

        pressure,

        mutationBoost,

        crossoverBoost,

        risk
      });


      // ==========================================
      // 🌎 GLOBAL PRESSURE
      // ==========================================

      globalPressure +=
        pressure * 0.1;
    }


    // ==========================================
    // 🧬 FINAL RATES
    // ==========================================

    const mutationRate =

      Number(
        (
          globalPressure * 1.2
        ).toFixed(2)
      );

    const crossoverRate =

      Number(
        (
          globalPressure * 0.8
        ).toFixed(2)
      );


    // ==========================================
    // 🌎 ECOSYSTEM STATE
    // ==========================================

    let ecosystemState:
      'stable' |
      'adaptive' |
      'critical' = 'stable';


    if (
      globalPressure >= 3
    ) {

      ecosystemState =
        'adaptive';
    }

    if (
      globalPressure >= 5
    ) {

      ecosystemState =
        'critical';
    }


    // ==========================================
    // 📊 FINAL
    // ==========================================

    return {

      globalPressure:
        Number(
          globalPressure
            .toFixed(2)
        ),

      mutationRate,

      crossoverRate,

      stagnationDetected,

      targets,

      ecosystemState
    };
  }
}