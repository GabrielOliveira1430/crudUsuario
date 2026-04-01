import prisma from '../../database/prisma';

export const createUser = (data: any) => {
  return prisma.user.create({ data });
};

export const findByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};