import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // create roles
  const role1 = await prisma.role.upsert({
    where: {
      name: 'Admin',
    },
    update: {},
    create: {
      name: 'Admin',
      description: 'Role for Super Admin',
    },
  });

  const role2 = await prisma.role.upsert({
    where: {
      name: 'Administrasi',
    },
    update: {},
    create: {
      name: 'Administrasi',
      description: 'Role for Administrasi (Kasir, Social media admin, etc)',
    },
  });

  const role3 = await prisma.role.upsert({
    where: {
      name: 'Designer',
    },
    update: {},
    create: {
      name: 'Designer',
      description: 'Role for Designer',
    },
  });

  const role4 = await prisma.role.upsert({
    where: {
      name: 'Operator',
    },
    update: {},
    create: {
      name: 'Operator',
      description: 'Role for Operator',
    },
  });


  console.log({ role1, role2, role3, role4 });
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
