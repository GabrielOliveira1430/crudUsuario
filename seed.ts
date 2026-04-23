import prisma from './src/database/prisma';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🔥 Iniciando seed...');

  // 🔐 PERMISSÕES
  await prisma.permission.createMany({
    data: [
      { name: 'user:read' },
      { name: 'user:update' },
      { name: 'user:delete' },
    ],
    skipDuplicates: true,
  });

  const permissions = await prisma.permission.findMany();

  // 🔗 RELAÇÃO COM ADMIN
  await prisma.rolePermission.createMany({
    data: permissions.map((p) => ({
      role: 'ADMIN',
      permissionId: p.id,
    })),
    skipDuplicates: true,
  });

  // 🔑 CRIAR ADMIN
  const adminEmail = 'admin@coreauth.dev';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Senha@123', 10);

    await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('👑 Admin criado com sucesso!');
  } else {
    console.log('ℹ️ Admin já existe');
  }

  console.log('✅ Seed finalizado!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });