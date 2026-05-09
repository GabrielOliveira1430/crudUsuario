import { Request, Response } from 'express';
import { SimulatorService } from './simulator.service';

export class SimulatorController {

  static run(req: Request, res: Response) {
    const { history, generated } = req.body;

    if (!history || !generated) {
      return res.status(400).json({
        error: 'history e generated são obrigatórios'
      });
    }

    const result = SimulatorService.runSimulation(history, generated);

    return res.json(result);
  }

  static compare(req: Request, res: Response) {
    const { history } = req.body;

    if (!history) {
      return res.status(400).json({
        error: 'history é obrigatório'
      });
    }

    const result = SimulatorService.compareStrategies(history);

    return res.json(result);
  }
}