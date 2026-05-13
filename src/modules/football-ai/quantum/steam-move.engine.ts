// src/modules/football-ai/quantum/steam-move.engine.ts

// ======================================
// TYPES
// ======================================

export type SteamMove = {

  intensity: number;

  direction:
    | 'HOME'
    | 'AWAY';

  explosive: boolean;
};

// ======================================
// ENGINE
// ======================================

export class SteamMoveEngine {

  static analyze(): SteamMove {

    const intensity =
      random(0, 100);

    return {

      intensity,

      direction:
        Math.random() > 0.5
          ? 'HOME'
          : 'AWAY',

      explosive:
        intensity >= 80
    };
  }
}

function random(
  min: number,
  max: number
) {

  return Math.floor(
    Math.random() *
    (max - min + 1)
  ) + min;
}