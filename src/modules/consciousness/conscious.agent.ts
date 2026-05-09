// src/modules/consciousness/conscious.agent.ts

import {
  ConsciousProfile
} from './conscious.types';

import {
  ConsciousMemoryStore
} from './conscious.memory';


// ==========================================
// 🧠 CONSCIOUS AGENT
// ==========================================

export class ConsciousAgent {

  constructor(

    public profile:
      ConsciousProfile
  ) {

    ConsciousMemoryStore.init(
      profile.name
    );
  }


  // ==========================================
  // 🧠 THINK
  // ==========================================

  think() {

    const memory =

      ConsciousMemoryStore
        .getAll()
        .find(
          m =>
            m.agent ===
            this.profile.name
        );


    const mood =
      memory?.mood ||
      'neutral';


    // ==========================================
    // 🎯 PRIORITY SCORE
    // ==========================================

    let score =

      (
        this.profile.desires
          .dominance +

        this.profile.emotions
          .ambition +

        this.profile.emotions
          .confidence
      ) * 10;


    // ==========================================
    // 😨 FEAR EFFECT
    // ==========================================

    if (
      mood === 'fearful'
    ) {

      score *= 0.7;
    }


    // ==========================================
    // 🚀 CONFIDENT EFFECT
    // ==========================================

    if (
      mood === 'confident'
    ) {

      score *= 1.2;
    }


    return {

      agent:
        this.profile.name,

      mood,

      score:
        Number(
          score.toFixed(2)
        )
    };
  }


  // ==========================================
  // 🧠 EXPERIENCE
  // ==========================================

  experience(
    success: boolean
  ) {

    ConsciousMemoryStore.update(

      this.profile.name,

      success
    );
  }
}