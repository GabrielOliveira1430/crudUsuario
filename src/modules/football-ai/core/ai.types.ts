export type AlertType =
  | 'VALUE_BET'
  | 'PRESSURE_GOAL'
  | 'ODD_ERROR'
  | 'MOMENTUM'
  | 'LIVE_OPPORTUNITY';

export type FootballAlert = {
  id: string;

  type: AlertType;

  confidence: number;
  edge?: number;
  risk?: number;

  expectedValue?: number;

  match: {
    homeTeam: string;
    awayTeam: string;
  };

  timestamp: number;
};

export type ScoredAlert = FootballAlert & {
  score: number;
  finalScore: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  allowed: boolean;
  reason?: string;
};