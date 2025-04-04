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
  const admin = await prisma.user.upsert({
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
      blocked: false,
    },
  });

  const administrasi = await prisma.user.upsert({
    where: {
      username: 'administrasi',
      email: 'administrasi@duniabaliho.com',
      name: 'Administrasi',
    },
    update: {},
    create: {
      username: 'administrasi',
      email: 'administrasi@duniabaliho.com',
      name: 'Administrasi',
      password: hashPassword,
      roleId: 2,
      blocked: false,
    },
  });

  const designer = await prisma.user.upsert({
    where: {
      username: 'designer',
      email: 'designer@duniabaliho.com',
      name: 'Designer',
    },
    update: {},
    create: {
      username: 'designer',
      email: 'designer@duniabaliho.com',
      name: 'Designer',
      password: hashPassword,
      roleId: 3,
      blocked: false,
    },
  });

  const operator = await prisma.user.upsert({
    where: {
      username: 'operator',
      email: 'operator@duniabaliho.com',
      name: 'Operator',
    },
    update: {},
    create: {
      username: 'operator',
      email: 'operator@duniabaliho.com',
      name: 'Operator',
      password: hashPassword,
      roleId: 4,
      blocked: false,
    },
  });

  console.log({
    role1,
    role2,
    role3,
    role4,
    admin,
    administrasi,
    designer,
    operator,
  });
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
