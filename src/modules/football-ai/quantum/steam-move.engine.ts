// src/modules/football-ai/quantum/steam-move.engine.ts

// ======================================
// 🧠 TYPES
// ======================================

export type SteamMove = {

  intensity: number;

  direction:
    | 'HOME'
    | 'AWAY';

  explosive: boolean;
};

// ======================================
// 🚀 STEAM MOVE ENGINE (STABLE)
// ======================================

export class SteamMoveEngine {

  static analyze(): SteamMove {

    // ======================================
    // 📊 INTENSIDADE CONTROLADA
    // ======================================

    const intensity =
      random(20, 95);

    // ======================================
    // 📈 DIREÇÃO COM PEQUENO PESO
    // ======================================

    const direction =
      weightedDirection();

    // ======================================
    // 💥 EXPLOSIVO (AJUSTADO)
    // ======================================

    const explosive =
      intensity >= 82;

    return {
      intensity,
      direction,
      explosive
    };
  }
}

// ======================================
// ⚖️ DIREÇÃO PONDERADA (EVITA RANDOM PURO)
// ======================================

function weightedDirection(): 'HOME' | 'AWAY' {

  // leve tendência neutra (evita 50/50 puro)
  const bias = Math.random();

  if (bias > 0.52) return 'HOME';
  return 'AWAY';
}

// ======================================
// 🔧 RANDOM HELPER
// ======================================

function random(min: number, max: number) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}