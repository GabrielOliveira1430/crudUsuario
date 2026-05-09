// src/modules/simulator/simulator.service.ts

import {
  SimulationResult
} from './simulation.types';


// ==========================================
// 🎯 SERVICE DE SIMULAÇÃO
// ==========================================

export class SimulatorService {


  // ==========================================
  // 🔥 CALCULA ACERTOS
  // ==========================================

  static calculateHits(
    history: string[],
    generated: string[]
  ): number {

    let hits = 0;

    for (const gen of generated) {

      if (history.includes(gen)) {
        hits++;
      }
    }

    return hits;
  }


  // ==========================================
  // 📊 COBERTURA
  // ==========================================

  static calculateCoverage(
    generated: string[]
  ): number {

    const unique =
      new Set(generated).size;

    if (generated.length === 0) {
      return 0;
    }

    return Number(
      (
        (unique / generated.length) * 100
      ).toFixed(2)
    );
  }


  // ==========================================
  // 🌈 DIVERSIDADE
  // ==========================================

  static calculateDiversity(
    generated: string[]
  ): number {

    const prefixes =
      new Set(
        generated.map(
          n => n.substring(0, 2)
        )
      );

    if (generated.length === 0) {
      return 0;
    }

    return Number(
      (
        (prefixes.size / generated.length) * 100
      ).toFixed(2)
    );
  }


  // ==========================================
  // 🧠 SCORE GLOBAL
  // ==========================================

  static calculateScore(
    accuracy: number,
    coverage: number,
    diversity: number
  ): number {

    const score =
      (
        accuracy * 0.5 +
        coverage * 0.3 +
        diversity * 0.2
      );

    return Number(
      score.toFixed(2)
    );
  }


  // ==========================================
  // 🚀 SIMULAÇÃO PRINCIPAL
  // ==========================================

  static runSimulation(
    history: string[],
    generated: string[]
  ): SimulationResult {

    const hits =
      this.calculateHits(
        history,
        generated
      );

    const accuracy =
      generated.length > 0
        ? (hits / generated.length) * 100
        : 0;

    const coverage =
      this.calculateCoverage(
        generated
      );

    const diversity =
      this.calculateDiversity(
        generated
      );

    const score =
      this.calculateScore(
        accuracy,
        coverage,
        diversity
      );

    return {

      totalGenerated:
        generated.length,

      totalHistory:
        history.length,

      hits,

      accuracy:
        Number(
          accuracy.toFixed(2)
        ),

      coverage,

      diversity,

      score
    };
  }


  // ==========================================
  // ⚔️ COMPARAÇÃO
  // ==========================================

  static compareStrategies(
    history: string[]
  ) {

    // 🎲 RANDOM
    const random =
      Array.from(
        { length: 100 },
        () =>
          Math.floor(
            Math.random() * 10000
          )
            .toString()
            .padStart(4, '0')
      );

    // 🔒 FIXA
    const fixed =
      Array.from(
        { length: 100 },
        () => '1234'
      );

    return {

      random:
        this.runSimulation(
          history,
          random
        ),

      fixed:
        this.runSimulation(
          history,
          fixed
        )
    };
  }
}