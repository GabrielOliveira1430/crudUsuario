// ==========================================
// 🚨 GLOBAL ALERT TYPES V6 (UNIFICADO)
// ==========================================

export type AlertType =
  | "VALUE_BET"
  | "PRESSURE_GOAL"
  | "ODD_ERROR"
  | "MOMENTUM"
  | "LIVE_OPPORTUNITY";

export type RawAlert = {
  id: string;

  type: AlertType;

  confidence: number;
  edge?: number;
  risk?: number;

  match: {
    homeTeam: string;
    awayTeam: string;
  };

  timestamp: number;

  meta?: any;
};

export type ScoredAlert = RawAlert & {
  score: number;
  grade: "S" | "A" | "B" | "C" | "REJECT";
  approved: boolean;
  reasons: string[];
};