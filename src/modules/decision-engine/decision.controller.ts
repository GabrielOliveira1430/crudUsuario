import { Request, Response } from 'express';
import { DecisionService } from './decision.service';

export class DecisionController {

  static decide(req: Request, res: Response) {
    const { history } = req.body;

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({
        error: 'history deve ser um array'
      });
    }

    const result = DecisionService.decide(history);

    return res.json(result);
  }
}