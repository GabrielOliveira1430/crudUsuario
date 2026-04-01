import { Request, Response } from 'express';
import * as service from './user.service';

/**
 * Criar usuário
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await service.create(req.body);
    return res.status(201).json(user);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const result = await service.login(req.body);
    return res.json(result);
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
};

/**
 * Perfil do usuário logado
 */
export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await service.getProfile(userId);

    return res.json(user);
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
};

/**
 * Listar usuários com paginação
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const users = await service.getAll(page, limit);
    return res.json(users);
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
    return res.json(user);
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
};

/**
 * Atualizar usuário
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await service.update(Number(req.params.id), req.body);
    return res.json(user);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Deletar usuário
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await service.remove(Number(req.params.id));
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};