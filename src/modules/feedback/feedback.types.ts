// ==========================================
// 🎯 FEEDBACK RESULT
// ==========================================

export type FeedbackResult = {

  strategy: string;

  generatedNumbers: string[];

  realNumbers: string[];

  matches: string[];

  accuracy: number;

  confidenceAverage: number;

  createdAt: Date;
};


// ==========================================
// 📊 STRATEGY FEEDBACK
// ==========================================

export type StrategyFeedback = {

  strategy: string;

  totalRuns: number;

  totalHits: number;

  averageAccuracy: number;

  lastAccuracy: number;

  trend: 'up' | 'down' | 'stable';

  updatedAt: Date;
};