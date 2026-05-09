import {
  StrategyRegistry
} from '../strategy.registry';

import {
  GeneratedNumber,
  StrategyContext
} from '../strategy.types';


// ==========================================
// 🔥 HOT STRATEGY
// ==========================================

StrategyRegistry.register({

  name: 'hot',

  execute(
    context: StrategyContext
  ): GeneratedNumber[] {

    const frequency =
      new Map<string, number>();

    for (const item of context.history) {

      frequency.set(
        item.number,
        (frequency.get(item.number) || 0) + 1
      );
    }

    const sorted =
      Array.from(frequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50);

    return sorted.map(([number, count]) => ({

      number,

      score: count * 10,

      strategy: 'hot',

      tags: ['hot']
    }));
  }
});