// src/modules/pattern/pattern-detection.engine.ts


// ==========================================
// 📊 TYPES
// ==========================================

export type PatternAnalysis = {

  repeatedDigits: number;

  sequential: boolean;

  mirrored: boolean;

  repeatedPairs: boolean;

  uniqueDigits: number;

  score: number;

  tags: string[];
};


// ==========================================
// 🧠 PATTERN DETECTION ENGINE
// ==========================================

export class PatternDetectionEngine {


  // ==========================================
  // 🔥 ANALYZE
  // ==========================================

  static analyze(
    number: string
  ): PatternAnalysis {

    const digits =
      number.split('');

    const uniqueDigits =
      new Set(digits).size;

    const tags: string[] = [];

    let score = 100;


    // ==========================================
    // 🔥 REPETITION
    // ==========================================

    const repeatedDigits =
      digits.length - uniqueDigits;

    if (
      repeatedDigits >= 2
    ) {

      score -= 20;

      tags.push(
        'repetitive'
      );
    }


    // ==========================================
    // 🔥 SEQUENTIAL
    // ==========================================

    const sequential =
      this.isSequential(
        number
      );

    if (sequential) {

      score -= 25;

      tags.push(
        'sequential'
      );
    }


    // ==========================================
    // 🔥 MIRRORED
    // ==========================================

    const mirrored =
      this.isMirrored(
        number
      );

    if (mirrored) {

      score -= 15;

      tags.push(
        'mirrored'
      );
    }


    // ==========================================
    // 🔥 REPEATED PAIRS
    // ==========================================

    const repeatedPairs =
      this.hasRepeatedPairs(
        number
      );

    if (repeatedPairs) {

      score -= 15;

      tags.push(
        'repeated-pairs'
      );
    }


    // ==========================================
    // 🔥 DIVERSITY BONUS
    // ==========================================

    if (
      uniqueDigits >= 4
    ) {

      score += 10;

      tags.push(
        'high-diversity'
      );
    }


    // ==========================================
    // 📊 FINAL
    // ==========================================

    return {

      repeatedDigits,

      sequential,

      mirrored,

      repeatedPairs,

      uniqueDigits,

      score:
        Math.max(0, score),

      tags
    };
  }


  // ==========================================
  // 🔥 SEQUENTIAL
  // ==========================================

  private static isSequential(
    number: string
  ) {

    let count = 0;

    for (
      let i = 0;
      i < number.length - 1;
      i++
    ) {

      const current =
        Number(number[i]);

      const next =
        Number(number[i + 1]);

      if (
        next === current + 1
      ) {

        count++;
      }
    }

    return count >= 2;
  }


  // ==========================================
  // 🔥 MIRRORED
  // ==========================================

  private static isMirrored(
    number: string
  ) {

    return (

      number[0] === number[2]

      &&

      number[1] === number[3]
    );
  }


  // ==========================================
  // 🔥 REPEATED PAIRS
  // ==========================================

  private static hasRepeatedPairs(
    number: string
  ) {

    return (

      number.slice(0, 2)

      ===

      number.slice(2, 4)
    );
  }
}