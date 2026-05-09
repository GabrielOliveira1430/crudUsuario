// src/modules/evolution/ai-species.engine.ts

import {
  StrategyRegistry
} from '../strategy-engine/strategy.registry';

import {
  Strategy
} from '../strategy-engine/strategy.types';


// ==========================================
// 🧬 SPECIES
// ==========================================

type Species = {

  name: string;

  population: number;

  averageGeneration: number;

  strategies: string[];

  dominant: boolean;

  extinctRisk: boolean;
};


// ==========================================
// 📊 SPECIES REPORT
// ==========================================

type SpeciesReport = {

  totalSpecies: number;

  dominantSpecies?: string;

  endangeredSpecies: string[];

  species: Species[];
};


// ==========================================
// 🧠 AI SPECIES ENGINE
// ==========================================

export class AISpeciesEngine {


  // ==========================================
  // 🚀 ANALYZE ECOSYSTEM
  // ==========================================

  static analyze(): SpeciesReport {

    const strategies =
      StrategyRegistry.getAll();

    const grouped =
      new Map<string, Strategy[]>();


    // ==========================================
    // 🧬 GROUP BY SPECIES
    // ==========================================

    for (const strategy of strategies) {

      const species =

        strategy.lineage?.species ||

        this.detectSpecies(
          strategy.name
        );

      if (
        !grouped.has(species)
      ) {

        grouped.set(
          species,
          []
        );
      }

      grouped
        .get(species)!
        .push(strategy);
    }


    // ==========================================
    // 📊 BUILD REPORT
    // ==========================================

    const speciesList: Species[] = [];

    for (
      const [name, items]
      of grouped.entries()
    ) {

      const population =
        items.length;

      const generations =

        items.map(
          s =>
            s.lineage?.generation || 1
        );

      const averageGeneration =

        generations.reduce(
          (a, b) => a + b,
          0
        ) / generations.length;

      speciesList.push({

        name,

        population,

        averageGeneration:
          Number(
            averageGeneration
              .toFixed(2)
          ),

        strategies:

          items.map(
            s => s.name
          ),

        dominant:
          population >= 5,

        extinctRisk:
          population <= 1
      });
    }


    // ==========================================
    // 👑 DOMINANT
    // ==========================================

    speciesList.sort(
      (a, b) =>
        b.population -
        a.population
    );

    const dominant =
      speciesList[0];


    // ==========================================
    // ⚠️ ENDANGERED
    // ==========================================

    const endangered =

      speciesList
        .filter(
          s => s.extinctRisk
        )
        .map(
          s => s.name
        );


    // ==========================================
    // 📊 FINAL
    // ==========================================

    return {

      totalSpecies:
        speciesList.length,

      dominantSpecies:
        dominant?.name,

      endangeredSpecies:
        endangered,

      species:
        speciesList
    };
  }


  // ==========================================
  // 🧠 DETECT SPECIES
  // ==========================================

  private static detectSpecies(
    name: string
  ) {

    const lower =
      name.toLowerCase();


    if (
      lower.includes('hot')
    ) {
      return 'hot-family';
    }

    if (
      lower.includes('cold')
    ) {
      return 'cold-family';
    }

    if (
      lower.includes('cluster')
    ) {
      return 'cluster-family';
    }

    if (
      lower.includes('random')
    ) {
      return 'random-family';
    }

    if (
      lower.includes('hybrid')
    ) {
      return 'hybrid-family';
    }

    if (
      lower.includes('mutation')
    ) {
      return 'mutation-family';
    }

    return 'unknown-family';
  }
}