import { Request, Response } from 'express';

import {
  getMeService
} from './me.service';

export async function me(
  req: Request,
  res: Response
) {

  try {

    const userId =
      (req as any).user.id;

    const user =
      await getMeService(userId);

    return res.json({

      success: true,

      data: user,
    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      error: 'Erro ao buscar perfil',
    });
  }
}