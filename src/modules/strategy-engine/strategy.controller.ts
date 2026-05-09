import { Request, Response } from 'express';
import { StrategyService } from './strategy.service';

export class StrategyController {

  static runAll(req: Request, res: Response) {
    const { history } = req.body;

    if (!history) {
      return res.status(400).json({
        error: 'history é obrigatório'
      });
    }

    const result = StrategyService.runAll(history);

    return res.json(result);
  }

  static runOne(req: Request, res: Response) {
    const { name, history } = req.body;

    if (!name || !history) {
      return res.status(400).json({
        error: 'name e history são obrigatórios'
      });
    }

    try {
      const result = StrategyService.runOne(name, history);
      return res.json(result);
    } catch (err: any) {
      return res.status(404).json({
        error: err.message
      });
    }
  }
}