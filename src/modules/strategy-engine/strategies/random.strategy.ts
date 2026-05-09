import {
  StrategyRegistry
} from '../strategy.registry';

import {
  GeneratedNumber,
  StrategyContext
} from '../strategy.types';


// ==========================================
// 🎲 RANDOM STRATEGY
// ==========================================

StrategyRegistry.register({

  name: 'random',

  execute(
    context: StrategyContext
  ): GeneratedNumber[] {

    const results: GeneratedNumber[] = [];

    for (let i = 0; i < 50; i++) {

      const number =
        Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, '0');

      results.push({
        number,
        score: 50,
        strategy: 'random',
        tags: ['random']
      });
    }

    return results;
  }
});