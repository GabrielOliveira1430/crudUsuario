// src/modules/strategy-engine/strategy.registry.ts

import {
  Strategy
} from './strategy.types';


// ==========================================
// 🧩 REGISTRO CENTRAL
// ==========================================

export class StrategyRegistry {

  private static strategies:
    Strategy[] = [];


  // ==========================================
  // ➕ REGISTER
  // ==========================================

  static register(
    strategy: Strategy
  ) {

    const exists =

      this.strategies.find(
        s => s.name === strategy.name
      );

    if (exists) {
      return;
    }

    this.strategies.push(
      strategy
    );
  }


  // ==========================================
  // 📋 GET ALL
  // ==========================================

  static getAll(): Strategy[] {

    return this.strategies;
  }


  // ==========================================
  // 🎯 GET ONE
  // ==========================================

  static get(
    name: string
  ): Strategy | undefined {

    return this.strategies.find(
      s => s.name === name
    );
  }


  // ==========================================
  // 🪦 REMOVE
  // ==========================================

  static remove(
    name: string
  ) {

    this.strategies =

      this.strategies.filter(
        s => s.name !== name
      );
  }
}