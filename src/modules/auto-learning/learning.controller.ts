import { Request, Response } from 'express';
import { LearningEngine } from './learning.engine';

export class LearningController {

  static learn(req: Request, res: Response) {
    const { history } = req.body;

    if (!history) {
      return res.status(400).json({
        error: 'history obrigatório'
      });
    }

    const result = LearningEngine.learn(history);

    return res.json(result);
  }

  static ranking(req: Request, res: Response) {
    const { history } = req.body;

    const result = LearningEngine.getSmartRanking(history);

    return res.json(result);
  }
}