import { Request, Response } from "express";
import * as service from "./user.service";

/**
 * 🔐 Criar usuário
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await service.create(req.body);

    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    return res.status(err.statusCode || 400).json({
      success: false,
      error: err.message || "Erro ao criar usuário",
    });
  }
};

/**
 * 👤 Perfil logado
 */
export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const user = await service.getProfile(userId);

    return res.json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    return res.status(err.statusCode || 404).json({
      success: false,
      error: err.message || "Usuário não encontrado",
    });
  }
};

/**
 * 📋 Listagem
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await service.getAll(page, limit, req.query as any);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(err.statusCode || 400).json({
      success: false,
      error: err.message || "Erro ao listar usuários",
    });
  }
};

/**
 * 🔍 Buscar por ID
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
      });
    }

    const user = await service.getById(id);

    return res.json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    return res.status(err.statusCode || 404).json({
      success: false,
      error: err.message || "Usuário não encontrado",
    });
  }
};

/**
 * ✏️ Atualizar usuário (ADMIN)
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
      });
    }

    const user = await service.update(id, req.body);

    return res.json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    return res.status(err.statusCode || 400).json({
      success: false,
      error: err.message || "Erro ao atualizar usuário",
    });
  }
};

/**
 * 🔁 Alterar role
 */
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
      });
    }

    const { role } = req.body;

    const user = await service.updateRole(id, role);

    return res.json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    return res.status(err.statusCode || 400).json({
      success: false,
      error: err.message || "Erro ao atualizar role",
    });
  }
};

/**
 * 🗑 Deletar usuário
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
      });
    }

    const result = await service.remove(id);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(err.statusCode || 400).json({
      success: false,
      error: err.message || "Erro ao deletar usuário",
    });
  }
};

/**
 * 📊 Stats
 */
export const stats = async (req: Request, res: Response) => {
  try {
    const data = await service.getUserStats();

    return res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || "Erro ao buscar estatísticas",
    });
  }
};

/**
 * 🚀 UPGRADE PARA PRO
 */
export const upgradePlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Usuário não autenticado",
      });
    }

    const user = await service.upgradePlan(userId);

    return res.json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    return res.status(err.statusCode || 400).json({
      success: false,
      error: err.message || "Erro ao atualizar plano",
    });
  }
};