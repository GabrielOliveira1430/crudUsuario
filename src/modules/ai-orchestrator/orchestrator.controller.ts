


import {
  Request,
  Response
} from 'express';

import {
  OrchestratorService
} from './orchestrator.service';

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

  static async run(
    req: Request,
    res: Response
  ) {

    try {

      let {
        history
      } = req.body;


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

        await OrchestratorService.run(
          history
        );


      // ==========================================
      // ✅ RESPONSE PADRONIZADO
      // ==========================================

      return res.status(200).json({

        success: true,

        timestamp:
          new Date(),

        data: result
      });

    } catch (error: any) {

      console.error(

        '🔴 Orchestrator Error:',

        error
      );

      return res.status(500).json({

        success: false,

        message:

          error.message ||

          'Erro interno no orchestrator'
      });
    }
  }
}

