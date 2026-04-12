import { Request, Response } from 'express';
import * as service from './audit.service';

export const getLogs = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const logs = await service.getAuditLogs(page, limit, {
      userId: req.query.userId ? Number(req.query.userId) : undefined,
      action: req.query.action as string,
      entity: req.query.entity as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string
    });

    return res.json({
      success: true,
      data: logs.data,
      meta: logs.meta
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};