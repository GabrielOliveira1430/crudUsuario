import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

export class AnalyticsController {

  static analyze(req: Request, res: Response) {
    const { numbers } = req.body;

    if (!numbers || !Array.isArray(numbers)) {
      return res.status(400).json({
        error: 'numbers deve ser um array'
      });
    }

    const result = AnalyticsService.getStats(numbers);

    return res.json(result);
  }
}