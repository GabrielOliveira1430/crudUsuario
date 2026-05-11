import { Request, Response } from 'express';

import {
  FootballProvider
} from './football.provider';

import {
  FootballAnalytics
} from './football.analytics';

import {
  FootballPredictionEngine
} from './football.prediction.engine';

import {
  FootballOddsEngine
} from './football.odds.engine';

import { FootballRealtime } from './football.realtime';

export class FootballController {

  static async live(req: Request, res: Response) {

    try {

      const snapshot = FootballRealtime.getSnapshot();

      if (snapshot) {
        return res.json(snapshot);
      }

      const result = await FootballProvider.getLiveMatches();

      return res.json(result);

    } catch (error) {

      console.error('FOOTBALL LIVE ERROR:', error);

      return res.status(500).json({
        success: false,
        error: 'Erro ao carregar partidas'
      });
    }
  }

  static async analytics(req: Request, res: Response) {

    try {

      const result = await FootballProvider.getLiveMatches();

      const matches = result.matches || [];

      const analytics = FootballAnalytics.analyze(matches);

      return res.json({

        success: true,

        totalMatches: matches.length,

        analytics,

        topTeams: analytics.slice(0, 10),

        hottestTeam: analytics[0] || null
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        error: 'Erro analytics'
      });
    }
  }

  static async predictions(req: Request, res: Response) {

    try {

      const result = await FootballProvider.getLiveMatches();

      const matches = result.matches || [];

      const predictions = FootballPredictionEngine.predict(matches);

      return res.json({

        success: true,

        totalPredictions: predictions.length,

        predictions,

        bestPrediction: predictions[0] || null
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        error: 'Erro predictions'
      });
    }
  }

  static async odds(req: Request, res: Response) {

    try {

      const result = await FootballProvider.getLiveMatches();

      const matches = result.matches || [];

      const odds = FootballOddsEngine.calculate(matches);

      return res.json({

        success: true,

        totalOdds: odds.length,

        odds
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        error: 'Erro odds'
      });
    }
  }
}