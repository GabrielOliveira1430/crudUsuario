import prisma from './src/database/prisma';

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

  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });