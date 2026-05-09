import { Request, Response } from 'express';

import { OrchestratorService }
  from './orchestrator.service';

import {
  HistoryMemory
} from '../history/history.memory';


// ==========================================
// 🧠 ORCHESTRATOR CONTROLLER
// ==========================================

export class OrchestratorController {


  // ==========================================
  // 🚀 EXECUTA PIPELINE
  // ==========================================

  static run(
    req: Request,
    res: Response
  ) {

    let { history } = req.body;


    // ==========================================
    // 🔥 AUTO HISTORY
    // ==========================================

    if (
      !history ||
      !Array.isArray(history)
    ) {

      history =
        HistoryMemory.getNumbers();

      console.log(
        '🧠 Histórico carregado da memória:',
        history.length
      );
    }


    // ==========================================
    // 🚀 ORCHESTRATOR
    // ==========================================

    const result =
      OrchestratorService.run(
        history
      );

    return res.json(result);
  }
}