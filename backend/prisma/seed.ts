import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: 'admin', description: 'Role for Super Admin' },
    { name: 'administrasi', description: 'Role for Administrasi (Kasir, Social media admin, etc)' },
    { name: 'designer', description: 'Role for Designer' },
    { name: 'operator', description: 'Role for Operator' },
  ];

  // Upsert roles and store the results
  const roleMap = new Map<string, number>();
  for (const role of roles) {
    const created = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
    roleMap.set(role.name, created.id);
  }

  const hashPassword = await bcrypt.hash('12345', 10);

  const users = [
    {
      username: 'admin',
      email: 'admin@digitalberkah.com',
      name: 'Admin',
      role: 'admin',
    },
    {
      username: 'administrasi',
      email: 'administrasi@digitalberkah.com',
      name: 'Administrasi',
      role: 'administrasi',
    },
    {
      username: 'designer',
      email: 'designer@digitalberkah.com',
      name: 'Designer',
      role: 'designer',
    },
    {
      username: 'operator',
      email: 'operator@digitalberkah.com',
      name: 'Operator',
      role: 'operator',
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: {
        username: user.username,
        email: user.email,
        name: user.name,
        password: hashPassword,
        roleId: roleMap.get(user.role)!,
        blocked: false,
      },
    });
  }

  console.log('✅ Seed finished.\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
