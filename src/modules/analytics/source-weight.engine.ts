// src/modules/analytics/source-weight.engine.ts

// ==========================================
// 📊 SOURCE WEIGHTS
// ==========================================

export type SourceWeight = {

  source: string;

  weight: number;

  trusted: boolean;
};


// ==========================================
// 🧠 SOURCE WEIGHT ENGINE
// ==========================================

export class SourceWeightEngine {

  // ==========================================
  // ⚖️ DEFAULT WEIGHTS
  // ==========================================

  private static weights: Record<string, number> = {

    // oficiais
    'mega-sena': 1.0,

    // semi-oficiais
    'federal': 0.8,

    // alternativos
    'bicho': 0.5,

    // IA
    'AI-HOT': 0.7,
    'AI-COLD': 0.4,
    'AI-RANDOM': 0.2
  };


  // ==========================================
  // 🔍 GET WEIGHT
  // ==========================================

  static getWeight(
    source?: string
  ): number {

    if (!source) {
      return 0.1;
    }

    return (
      this.weights[source]
      ?? 0.1
    );
  }


  // ==========================================
  // ✅ IS TRUSTED
  // ==========================================

  static isTrusted(
    source?: string
  ) {

    return this.getWeight(source) >= 0.7;
  }


  // ==========================================
  // 📋 GET ALL
  // ==========================================

  static getAll(): SourceWeight[] {

    return Object.entries(
      this.weights
    ).map(([source, weight]) => ({

      source,

      weight,

      trusted:
        weight >= 0.7
    }));
  }


  // ==========================================
  // 🧠 UPDATE WEIGHT
  // ==========================================

  static updateWeight(

    source: string,

    weight: number
  ) {

    this.weights[source] =

      Math.max(
        0,
        Math.min(weight, 1)
      );
  }
}