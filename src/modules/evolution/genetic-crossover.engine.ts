// src/modules/evolution/genetic-crossover.engine.ts

import {
  Strategy,
  StrategyDNA
} from '../strategy-engine/strategy.types';

import {
  StrategyRegistry
} from '../strategy-engine/strategy.registry';

import {
  DNAFactory
} from './dna.factory';


// ==========================================
// 🧬 CROSSOVER RESULT
// ==========================================

type CrossoverResult = {

  created: string[];

  totalStrategies: number;
};


// ==========================================
// 🧠 GENETIC CROSSOVER ENGINE
// ==========================================

export class GeneticCrossoverEngine {


  // ==========================================
  // 🧬 EXECUTE CROSSOVER
  // ==========================================

  static evolve(): CrossoverResult {

    const strategies =
      StrategyRegistry
        .getAll()
        .filter(
          s => s.dna
        );

    const created: string[] = [];


    // precisa de pelo menos 2
    if (
      strategies.length < 2
    ) {

      return {

        created,

        totalStrategies:
          strategies.length
      };
    }


    // ==========================================
    // 🧬 RANDOM PAIRS
    // ==========================================

    for (
      let i = 0;
      i < 2;
      i++
    ) {

      const parentA =
        this.randomStrategy(
          strategies
        );

      const parentB =
        this.randomStrategy(
          strategies
        );

      if (
        !parentA ||
        !parentB
      ) {
        continue;
      }

      if (
        parentA.name ===
        parentB.name
      ) {
        continue;
      }


      // ==========================================
      // 🧬 CHILD DNA
      // ==========================================

      const childDNA =
        this.crossoverDNA(

          parentA.dna!,

          parentB.dna!
        );


      // ==========================================
      // 👶 CHILD NAME
      // ==========================================

      const childName =

        `${parentA.name}_${parentB.name}_hybrid_${Date.now()}_${i}`;


      // evita duplicação
      if (
        StrategyRegistry.get(
          childName
        )
      ) {
        continue;
      }


      // ==========================================
      // 🧠 CHILD STRATEGY
      // ==========================================

      const child: Strategy = {

        name: childName,

        dna: childDNA,

        lineage: {

          generation: Math.max(

            parentA.lineage?.generation || 1,

            parentB.lineage?.generation || 1

          ) + 1,

          parent:

            `${parentA.name} + ${parentB.name}`,

          species:
            'hybrid'
        },


        execute(context) {

          const history =
            context.history;

          const results = [];

          for (
            let x = 0;
            x < 10;
            x++
          ) {

            const base =

              history[
                Math.floor(
                  Math.random() *
                  history.length
                )
              ];

            if (!base) {
              continue;
            }

            const dna =
              childDNA;

            const roll =
              Math.random();

            let number =
              base.number;


            // HOT BIAS
            if (
              roll <
              dna.hotBias
            ) {

              number =
                '9' +
                number.slice(1);
            }


            // COLD BIAS
            else if (

              roll <
              (
                dna.hotBias +
                dna.coldBias
              )
            ) {

              number =
                '0' +
                number.slice(1);
            }


            // RANDOMNESS
            if (
              Math.random() <
              dna.randomness
            ) {

              number =
                Math.floor(
                  Math.random() * 10000
                )
                .toString()
                .padStart(4, '0');
            }


            results.push({

              number,

              strategy:
                childName,

              score:
                dna.aggressiveness * 100,

              tags: [

                'hybrid',

                parentA.name,

                parentB.name
              ]
            });
          }

          return results;
        }
      };


      // ==========================================
      // 🧬 REGISTER
      // ==========================================

      StrategyRegistry.register(
        child
      );

      created.push(
        childName
      );
    }


    // ==========================================
    // 📊 RESULT
    // ==========================================

    return {

      created,

      totalStrategies:

        StrategyRegistry
          .getAll()
          .length
    };
  }


  // ==========================================
  // 🧬 DNA CROSSOVER
  // ==========================================

  private static crossoverDNA(

    a: StrategyDNA,

    b: StrategyDNA

  ): StrategyDNA {

    const pick = (
      v1: number,
      v2: number
    ) => {

      return Math.random() > 0.5
        ? v1
        : v2;
    };

    return DNAFactory.mutate({

      aggressiveness:
        pick(
          a.aggressiveness,
          b.aggressiveness
        ),

      randomness:
        pick(
          a.randomness,
          b.randomness
        ),

      hotBias:
        pick(
          a.hotBias,
          b.hotBias
        ),

      coldBias:
        pick(
          a.coldBias,
          b.coldBias
        ),

      mutationRate:
        pick(
          a.mutationRate,
          b.mutationRate
        ),

      confidenceBias:
        pick(
          a.confidenceBias,
          b.confidenceBias
        ),

      explorationRate:
        pick(
          a.explorationRate,
          b.explorationRate
        ),

      clusterPreference:

        Math.random() > 0.5

          ? a.clusterPreference

          : b.clusterPreference
    });
  }


  // ==========================================
  // 🎲 RANDOM STRATEGY
  // ==========================================

  private static randomStrategy(
    strategies: Strategy[]
  ) {

    return strategies[
      Math.floor(
        Math.random() *
        strategies.length
      )
    ];
  }
}