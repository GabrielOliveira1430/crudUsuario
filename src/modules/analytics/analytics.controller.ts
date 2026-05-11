import {
  Request,
  Response
} from 'express';

import {
  AnalyticsService
} from './analytics.service';

export class AnalyticsController {


  // ==========================================
  // 🔥 ANALYZE
  // ==========================================

  static analyze(
    req: Request,
    res: Response
  ) {

    const { numbers } = req.body;

    if (
      !numbers ||
      !Array.isArray(numbers)
    ) {

      return res.status(400).json({

        error:
          'numbers deve ser um array'
      });
    }

    const result =
      AnalyticsService.getStats(
        numbers
      );

    return res.json(result);
  }


  // ==========================================
  // 🔥 HOT DATABASE
  // ==========================================

  static async hot(
    req: Request,
    res: Response
  ) {

    const result =

      await AnalyticsService
        .getDatabaseHotNumbers();

    return res.json(result);
  }


  // ==========================================
  // ❄️ COLD DATABASE
  // ==========================================

  static async cold(
    req: Request,
    res: Response
  ) {

    const result =

      await AnalyticsService
        .getDatabaseColdNumbers();

    return res.json(result);
  }


  // ==========================================
  // 📦 SOURCES
  // ==========================================

  static async sources(
    req: Request,
    res: Response
  ) {

    const result =

      await AnalyticsService
        .getSourceStats();

    return res.json(result);
  }
}