import prisma from '../../database/prisma';

export async function getMeService(
  userId: number
) {

  const user =
    await prisma.user.findUnique({

      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        email: true,

        role: true,
        plan: true,

        isActive: true,

        createdAt: true,
      },
    });

  if (!user) {
    throw new Error(
      'Usuário não encontrado'
    );
  }

  return user;
}