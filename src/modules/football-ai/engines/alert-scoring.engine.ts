// src/modules/football-ai/engines/alert-scoring.engine.ts

// ==========================================
// 🚨 TYPES
// ==========================================

export type RawAlert = {
  id: string;

  type:
    | "VALUE_BET"
    | "PRESSURE"
    | "ODDS_ERROR"
    | "MOMENTUM"
    | "LIVE_OPPORTUNITY";

  confidence: number;
  edge?: number;
  risk?: number;

  expectedValue?: number;

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

// ==========================================
// 🧠 ALERT SCORING ENGINE
// ==========================================

export class AlertScoringEngine {
  private static MIN_SCORE = 65;

  // ==========================================
  // 📊 MAIN SCORING FUNCTION
  // ==========================================

  static score(alert: RawAlert): ScoredAlert {
    let score = 0;
    const reasons: string[] = [];

    // ==========================================
    // 🎯 CONFIDENCE (0 - 40 pts)
    // ==========================================

    if (alert.confidence >= 85) {
      score += 40;
      reasons.push("Altíssima confiança");
    } else if (alert.confidence >= 70) {
      score += 30;
      reasons.push("Boa confiança");
    } else if (alert.confidence >= 55) {
      score += 15;
      reasons.push("Confiança média");
    } else {
      score += 5;
      reasons.push("Baixa confiança");
    }

    // ==========================================
    // 💰 EDGE (0 - 30 pts)
    // ==========================================

    const edge = alert.edge || 0;

    if (edge >= 25) {
      score += 30;
      reasons.push("Edge extremamente alto");
    } else if (edge >= 15) {
      score += 22;
      reasons.push("Edge forte");
    } else if (edge >= 8) {
      score += 12;
      reasons.push("Edge aceitável");
    } else {
      score += 3;
      reasons.push("Edge fraco");
    }

    // ==========================================
    // ⚠️ RISK PENALTY (0 - -25 pts)
    // ==========================================

    const risk = alert.risk || 0;

    if (risk >= 60) {
      score -= 25;
      reasons.push("Risco muito alto");
    } else if (risk >= 40) {
      score -= 15;
      reasons.push("Risco moderado");
    } else if (risk >= 25) {
      score -= 8;
      reasons.push("Risco controlado");
    }

    // ==========================================
    // 📈 EXPECTED VALUE BONUS
    // ==========================================

    const ev = alert.expectedValue || 0;

    if (ev >= 20) {
      score += 15;
      reasons.push("EV muito positivo");
    } else if (ev >= 10) {
      score += 10;
      reasons.push("EV positivo");
    } else if (ev < 0) {
      score -= 10;
      reasons.push("EV negativo");
    }

    // ==========================================
    // ⚽ ALERT TYPE WEIGHT
    // ==========================================

    switch (alert.type) {
      case "VALUE_BET":
        score += 10;
        reasons.push("Tipo: Value Bet (priorizado)");
        break;

      case "PRESSURE":
        score += 6;
        reasons.push("Pressão de jogo");
        break;

      case "ODDS_ERROR":
        score += 8;
        reasons.push("Erro de odds detectado");
        break;

      case "LIVE_OPPORTUNITY":
        score += 5;
        reasons.push("Oportunidade ao vivo");
        break;

      case "MOMENTUM":
        score += 4;
        reasons.push("Momentum favorável");
        break;
    }

    // ==========================================
    // 🧮 FINAL SCORE NORMALIZATION
    // ==========================================

    score = Math.max(0, Math.min(100, score));

    // ==========================================
    // 🏷️ GRADE SYSTEM
    // ==========================================

    let grade: ScoredAlert["grade"];

    if (score >= 85) grade = "S";
    else if (score >= 75) grade = "A";
    else if (score >= 65) grade = "B";
    else if (score >= 50) grade = "C";
    else grade = "REJECT";

    // ==========================================
    // 🚫 FINAL DECISION
    // ==========================================

    const approved = score >= this.MIN_SCORE;

    return {
      ...alert,
      score,
      grade,
      approved,
      reasons,
    };
  }

  // ==========================================
  // 📊 BATCH FILTER
  // ==========================================

  static filter(alerts: RawAlert[]): ScoredAlert[] {
    return alerts
      .map((alert) => this.score(alert))
      .filter((alert) => alert.approved)
      .sort((a, b) => b.score - a.score);
  }

  // ==========================================
  // 🔥 TOP ALERTS ONLY
  // ==========================================

  static top(alerts: RawAlert[], limit = 5) {
    return this.filter(alerts).slice(0, limit);
  }

  // ==========================================
  // 📡 INSIGHT
  // ==========================================

  static summary(scored: ScoredAlert[]) {
    return {
      total: scored.length,
      gradeS: scored.filter((a) => a.grade === "S").length,
      gradeA: scored.filter((a) => a.grade === "A").length,
      avgScore:
        scored.reduce((acc, a) => acc + a.score, 0) /
        Math.max(1, scored.length),
    };
  }
}