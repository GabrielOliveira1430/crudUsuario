// src/modules/strategy-engine/strategy.service.ts

import { StrategyRegistry } from './strategy.registry';

import { SimulatorService } from '../simulator/simulator.service';

import {
  DrawResult,
  GeneratedNumber,
  StrategyContext
} from './strategy.types';

import {
  SimulationResult
} from '../simulator/simulation.types';


// ==========================================
// 🎯 RESULTADO PADRÃO
// ==========================================

export type RunAllResult = {

  strategy: string;

  generated: GeneratedNumber[];

  simulation: SimulationResult;
};


// ==========================================
// 🧠 SERVICE CENTRAL DAS STRATEGIES
// ==========================================

export class StrategyService {


  // ==========================================
  // 🔥 CONVERTE HISTORY LEGADO
  // ==========================================

  private static normalizeHistory(
    history: string[]
  ): DrawResult[] {

    return history.map(number => ({
      number
    }));
  }


  // ==========================================
  // 🚀 RODA TODAS STRATEGIES
  // ==========================================

  static runAll(
    history: string[]
  ): RunAllResult[] {

    const strategies =
      StrategyRegistry.getAll();

    if (
      !history ||
      !Array.isArray(history)
    ) {
      throw new Error(
        'History inválido'
      );
    }

    // 🔥 converte para novo formato
    const normalizedHistory =
      this.normalizeHistory(history);

    const context: StrategyContext = {
      history: normalizedHistory
    };

    const results: RunAllResult[] =
      strategies.map((strategy) => {

        const generated =
          strategy.execute(context);

        const simulation =
          SimulatorService.runSimulation(
            history,
            generated.map(g => g.number)
          );

        return {
          strategy: strategy.name,
          generated,
          simulation
        };
      });

    return results;
  }


  // ==========================================
  // 🎯 RODA UMA STRATEGY
  // ==========================================

  static runOne(
    name: string,
    history: string[]
  ) {

    if (!name) {

      throw new Error(
        'Nome da strategy é obrigatório'
      );
    }

    if (
      !history ||
      !Array.isArray(history)
    ) {

      throw new Error(
        'History inválido'
      );
    }

    const strategy =
      StrategyRegistry.get(name);

    if (!strategy) {

      throw new Error(
        `Strategy "${name}" não encontrada`
      );
    }

    // 🔥 converte formato legado
    const normalizedHistory =
      this.normalizeHistory(history);

    const context: StrategyContext = {
      history: normalizedHistory
    };

    const generated =
      strategy.execute(context);

    const simulation =
      SimulatorService.runSimulation(
        history,
        generated.map(g => g.number)
      );

    return {
      strategy: strategy.name,
      generated,
      simulation
    };
  }
}