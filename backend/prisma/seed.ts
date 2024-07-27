import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // create roles
  const role1 = await prisma.role.upsert({
    where: {
      name: 'admin',
    },
    update: {},
    create: {
      name: 'admin',
      description: 'Role for Super Admin',
    },
  });

  const role2 = await prisma.role.upsert({
    where: {
      name: 'administrasi',
    },
    update: {},
    create: {
      name: 'administrasi',
      description: 'Role for Administrasi (Kasir, Social media admin, etc)',
    },
  });

  const role3 = await prisma.role.upsert({
    where: {
      name: 'designer',
    },
    update: {},
    create: {
      name: 'designer',
      description: 'Role for Designer',
    },
  });

  const role4 = await prisma.role.upsert({
    where: {
      name: 'operator',
    },
    update: {},
    create: {
      name: 'operator',
      description: 'Role for Operator',
    },
  });

  const hashPassword = await bcrypt.hash('12345', 10);

  // create user
  const user = await prisma.user.upsert({
    where: {
      username: 'admin',
      email: 'admin@duniabaliho.com',
      name: 'Admin',
    },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@duniabaliho.com',
      name: 'Admin',
      password: hashPassword,
      roleId: 1,
    },
  });

  console.log({ role1, role2, role3, role4, user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
