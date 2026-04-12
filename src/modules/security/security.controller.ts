import { Request, Response } from 'express';
import * as service from './security.service';
import {
  unblockIP,
  unblockUser,
  whitelistIP,
  whitelistUser
} from '../../shared/security/block.service';

// 🔍 LISTAR BLOQUEADOS
export const getBlocked = async (_: Request, res: Response) => {
  const data = await service.getBlocked();
  return res.json({ success: true, data });
};

// 🔍 LISTAR WHITELIST
export const getWhitelist = async (_: Request, res: Response) => {
  const data = await service.getWhitelist();
  return res.json({ success: true, data });
};

// 🔓 DESBLOQUEAR IP
export const unblockIp = async (req: Request, res: Response) => {
  await unblockIP(req.body.ip);
  return res.json({ success: true, message: 'IP desbloqueado' });
};

// 🔓 DESBLOQUEAR USER
export const unblockUserController = async (req: Request, res: Response) => {
  await unblockUser(req.body.userId);
  return res.json({ success: true, message: 'Usuário desbloqueado' });
};

// 🟢 WHITELIST IP
export const addWhitelistIp = async (req: Request, res: Response) => {
  await whitelistIP(req.body.ip);
  return res.json({ success: true });
};

// 🟢 WHITELIST USER
export const addWhitelistUser = async (req: Request, res: Response) => {
  await whitelistUser(req.body.userId);
  return res.json({ success: true });
};