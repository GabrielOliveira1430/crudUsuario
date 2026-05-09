import {
  StrategyRegistry
} from '../strategy.registry';

import {
  GeneratedNumber,
  StrategyContext
} from '../strategy.types';


// ==========================================
// ❄️ COLD STRATEGY
// ==========================================

StrategyRegistry.register({

  name: 'cold',

  execute(
    context: StrategyContext
  ): GeneratedNumber[] {

    const seen =
      new Set(
        context.history.map(
          h => h.number
        )
      );

    const results: GeneratedNumber[] = [];

    while (results.length < 50) {

      const number =
        Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, '0');

      if (!seen.has(number)) {

        results.push({

          number,

          score: 80,

          strategy: 'cold',

          tags: ['cold']
        });
      }
    }

    return results;
  }
});