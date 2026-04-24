import prisma from './src/database/prisma';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🔥 Iniciando seed...');

  // 🧨 LIMPA RELAÇÕES (IMPORTANTE PRA EVITAR BUGS)
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();

  // 🔐 PERMISSÕES (RECRIAR LIMPO)
  const permissionsData = [
    { name: 'user:read' },
    { name: 'user:update' },
    { name: 'user:delete' },
  ];

  await prisma.permission.createMany({
    data: permissionsData,
  });

  const permissions = await prisma.permission.findMany();

  // 🔗 RELAÇÃO COM ADMIN (AGORA LIMPA E GARANTIDA)
  await prisma.rolePermission.createMany({
    data: permissions.map((p) => ({
      role: 'ADMIN',
      permissionId: p.id,
    })),
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

  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });