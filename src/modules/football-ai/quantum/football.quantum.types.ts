export type QuantumScenario = {

  score: string;

  probability: number;

  minute: number;

  nextGoalTeam?: string;
};

export type QuantumSimulation = {

  match: string;

  homeTeam: string;

  awayTeam: string;

  simulations: number;

  expectedGoalsHome: number;

  expectedGoalsAway: number;

  winProbabilityHome: number;

  winProbabilityAway: number;

  drawProbability: number;

  nextGoalProbabilityHome: number;

  nextGoalProbabilityAway: number;

  chaosLevel: number;

  confidence: number;

  scenarios: QuantumScenario[];
};