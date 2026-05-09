// src/modules/simulator/simulation.types.ts


// ==========================================
// 🎯 RESULTADO DE SIMULAÇÃO
// ==========================================

export interface SimulationResult {

  // total gerado
  totalGenerated: number;

  // total histórico
  totalHistory: number;

  // acertos exatos
  hits: number;

  // precisão %
  accuracy: number;

  // cobertura estatística
  coverage?: number;

  // diversidade
  diversity?: number;

  // score geral
  score?: number;

  // ROI futuro
  roi?: number;
}