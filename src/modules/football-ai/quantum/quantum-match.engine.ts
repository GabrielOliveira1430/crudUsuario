import type {
  FootballPrediction
} from '../../football/football.prediction.engine';

import type {
  QuantumSimulation,
  QuantumScenario
} from '../quantum/football.quantum.types';

export class QuantumMatchEngine {

  static simulate(
    prediction: FootballPrediction
  ): QuantumSimulation {

    const simulations = 10000;

    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;

    let totalHomeGoals = 0;
    let totalAwayGoals = 0;

    const scenarios: QuantumScenario[] = [];

    for (
      let i = 0;
      i < simulations;
      i++
    ) {

      const homeGoals =
        Math.floor(
          Math.random() *
          (prediction.confidence / 18)
        );

      const awayGoals =
        Math.floor(
          Math.random() *
          (prediction.risk / 25 + 2)
        );

      totalHomeGoals +=
        homeGoals;

      totalAwayGoals +=
        awayGoals;

      if (homeGoals > awayGoals) {

        homeWins++;

      } else if (
        awayGoals > homeGoals
      ) {

        awayWins++;

      } else {

        draws++;
      }

      if (i < 15) {

        scenarios.push({

          score:
            `${homeGoals}x${awayGoals}`,

          probability:
            Number(
              (
                Math.random() * 100
              ).toFixed(2)
            ),

          minute:
            Math.floor(
              Math.random() * 90
            ),

          nextGoalTeam:
            Math.random() > 0.5
              ? prediction.homeTeam
              : prediction.awayTeam
        });
      }
    }

    const expectedGoalsHome =
      Number(
        (
          totalHomeGoals /
          simulations
        ).toFixed(2)
      );

    const expectedGoalsAway =
      Number(
        (
          totalAwayGoals /
          simulations
        ).toFixed(2)
      );

    const winProbabilityHome =
      Number(
        (
          (homeWins / simulations) * 100
        ).toFixed(2)
      );

    const winProbabilityAway =
      Number(
        (
          (awayWins / simulations) * 100
        ).toFixed(2)
      );

    const drawProbability =
      Number(
        (
          (draws / simulations) * 100
        ).toFixed(2)
      );

    const nextGoalProbabilityHome =
      Number(
        (
          50 + Math.random() * 40
        ).toFixed(2)
      );

    const nextGoalProbabilityAway =
      Number(
        (
          50 + Math.random() * 40
        ).toFixed(2)
      );

    const chaosLevel =
      Number(
        (
          Math.random() * 100
        ).toFixed(2)
      );

    return {

      match:
        `${prediction.homeTeam} vs ${prediction.awayTeam}`,

      homeTeam:
        prediction.homeTeam,

      awayTeam:
        prediction.awayTeam,

      simulations,

      expectedGoalsHome,

      expectedGoalsAway,

      winProbabilityHome,

      winProbabilityAway,

      drawProbability,

      nextGoalProbabilityHome,

      nextGoalProbabilityAway,

      chaosLevel,

      confidence:
        prediction.confidence,

      scenarios:
        scenarios.sort(
          (a, b) =>
            b.probability -
            a.probability
        )
    };
  }

  static simulateMany(
    predictions: FootballPrediction[]
  ) {

    return predictions.map(
      this.simulate
    );
  }
}

export const quantumMatchEngine =
  new QuantumMatchEngine();