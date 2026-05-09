import { Request, Response } from 'express';
import { GeneratorService } from './generator.service';

export class GeneratorController {

  static generate(req: Request, res: Response) {
    const { quantity, size, hotNumbers, coldNumbers } = req.body;

    if (!quantity || !size) {
      return res.status(400).json({
        error: 'quantity e size são obrigatórios'
      });
    }

    const result = GeneratorService.generate({
      quantity,
      size,
      hotNumbers,
      coldNumbers,
    });

    return res.json(result);
  }
}