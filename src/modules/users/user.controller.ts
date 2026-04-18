import { Request, Response } from 'express';
import * as service from './user.service';

/**
 * Criar usuário
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await service.create(req.body);

    return res.status(201).json({
      success: true,
      data: user
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Perfil do usuário logado
 */
export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await service.getProfile(userId);

    return res.json({
      success: true,
      data: user
    });
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
};

/**
 * 🔥 LISTAR USUÁRIOS (CORRIGIDO)
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await service.getAll(page, limit, {
      name: req.query.name as string,
      email: req.query.email as string,
      search: req.query.search as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      sort: req.query.sort as string
    });

    return res.json({
      success: true,
      data: {
        users: result.users,
        total: result.total,
        page: result.page,
        perPage: result.perPage,
        lastPage: result.lastPage,
      }
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Buscar usuário por ID
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await service.getById(Number(req.params.id));

    return res.json({
      success: true,
      data: user
    });
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
};

/**
 * Atualizar usuário
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await service.update(
      Number(req.params.id),
      req.body
    );

    return res.json({
      success: true,
      data: user
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Deletar usuário
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await service.remove(
      Number(req.params.id)
    );

    return res.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * 📊 STATS (DASHBOARD)
 */
export const stats = async (req: Request, res: Response) => {
  try {
    const data = await service.getUserStats();

    return res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};