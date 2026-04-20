"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Rodando seed...');
    // 🔥 ADMIN
    const admin = await prisma.user.upsert({
        where: { email: 'admin@email.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@email.com',
            password: '$2b$10$7QJ8kR0v6z6V6z6V6z6V6OqJ9zJ9zJ9zJ9zJ9zJ9zJ9zJ9zJ9zJ9',
            role: client_1.Role.ADMIN,
        },
    });
    console.log('✅ Admin criado:', admin.email);
    // 🔥 PERMISSÕES REAIS
    const permissions = [
        'user:read',
        'user:create',
        'user:update',
        'user:delete',
    ];
    for (const perm of permissions) {
        await prisma.permission.upsert({
            where: { name: perm },
            update: {},
            create: { name: perm },
        });
    }
    console.log('✅ Permissões criadas');
    // 🔗 VINCULAR PERMISSÕES AO ADMIN
    const allPermissions = await prisma.permission.findMany();
    for (const perm of allPermissions) {
        await prisma.rolePermission.upsert({
            where: {
                role_permissionId: {
                    role: client_1.Role.ADMIN,
                    permissionId: perm.id,
                },
            },
            update: {},
            create: {
                role: client_1.Role.ADMIN,
                permissionId: perm.id,
            },
        });
    }
    console.log('✅ Permissões vinculadas ao ADMIN');
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma.$disconnect();
});
