// src/modules/meta-strategy/meta-strategy.engine.ts

import {
  LearningMemory
} from '../auto-learning/learning.memory';

import {
  MetaStrategyResult
} from './meta-strategy.types';


// ==========================================
// 🧠 META STRATEGY ENGINE
// ==========================================

export class MetaStrategyEngine {


  // ==========================================
  // 🚀 ANALISA CENÁRIO
  // ==========================================

  static analyze(): MetaStrategyResult {

    const memory =
      LearningMemory.getAll();


    const hot =

      memory.find(
        m => m.name === 'hot'
      )?.weight || 1;


    const cold =

      memory.find(
        m => m.name === 'cold'
      )?.weight || 1;


    const random =

      memory.find(
        m => m.name === 'random'
      )?.weight || 1;


    // ==========================================
    // 📊 TOTAL
    // ==========================================

    const total =

      hot +
      cold +
      random;


    // ==========================================
    // 📊 MIX
    // ==========================================

    const mix = {

      hot:
        Number(
          (hot / total)
            .toFixed(2)
        ),

      cold:
        Number(
          (cold / total)
            .toFixed(2)
        ),

      random:
        Number(
          (random / total)
            .toFixed(2)
        )
    };


    // ==========================================
    // 🧠 DOMINANT
    // ==========================================

    let dominantMode =
      'random';


    const max = Math.max(
      hot,
      cold,
      random
    );


    if (max === hot) {

      dominantMode =
        'hot';
    }

    else if (
      max === cold
    ) {

      dominantMode =
        'cold';
    }


    // ==========================================
    // 🌡️ MARKET STATE
    // ==========================================

    let marketState:
      MetaStrategyResult['marketState'] =
        'stable';


    if (hot > random * 1.5) {

      marketState =
        'heated';
    }

    else if (
      cold > hot
    ) {

      marketState =
        'cold';
    }

    else if (
      random > hot &&
      random > cold
    ) {

      marketState =
        'volatile';
    }


    // ==========================================
    // 🎯 CONFIDENCE
    // ==========================================

    const confidence =

      Number(
        (
          max / total
        * 100
        ).toFixed(2)
      );


    return {

      dominantMode,

      marketState,

      confidence,

      mix
    };
  }
}