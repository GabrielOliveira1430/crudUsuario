import * as auditService from '../../modules/audit/audit.service';
import prisma from '../../database/prisma';

// 🔥 MOCK PRISMA
jest.mock('../../database/prisma', () => ({
  __esModule: true,
  default: {
    auditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('Audit Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // LOG AUDIT
  // =========================
  describe('logAudit', () => {
    it('deve salvar log de auditoria com sucesso', async () => {
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({
        id: 1,
      });

      await auditService.logAudit({
        userId: 1,
        action: 'CREATE',
        entity: 'USER',
        entityId: 10,
        metadata: { test: true },
        ip: '127.0.0.1',
        userAgent: 'jest',
      });

      expect(prisma.auditLog.create).toHaveBeenCalledTimes(1);
    });

    it('deve tratar erro sem quebrar aplicação', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      (prisma.auditLog.create as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      await auditService.logAudit({
        action: 'DELETE',
        entity: 'USER',
      });

      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });
  });

  // =========================
  // GET AUDIT LOGS
  // =========================
  describe('getAuditLogs', () => {
    it('deve listar logs com paginação', async () => {
      (prisma.auditLog.findMany as jest.Mock).mockResolvedValue([
        { id: 1, action: 'CREATE' },
      ]);

      (prisma.auditLog.count as jest.Mock).mockResolvedValue(1);

      const result = await auditService.getAuditLogs(1, 10);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(prisma.auditLog.findMany).toHaveBeenCalled();
    });

    it('deve aplicar filtros corretamente', async () => {
      (prisma.auditLog.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.auditLog.count as jest.Mock).mockResolvedValue(0);

      await auditService.getAuditLogs(1, 10, {
        userId: 1,
        action: 'LOGIN',
        entity: 'AUTH',
      });

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object),
        })
      );
    });

    it('deve retornar paginação correta', async () => {
      (prisma.auditLog.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.auditLog.count as jest.Mock).mockResolvedValue(50);

      const result = await auditService.getAuditLogs(2, 10);

      expect(result.meta.page).toBe(2);
      expect(result.meta.perPage).toBe(10);
      expect(result.meta.lastPage).toBe(5);
    });
  });
});