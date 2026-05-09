import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

type SeedOptions = {
  seedUsers: boolean;
};

export async function seedData(options: SeedOptions) {
  const prisma = new PrismaClient();

  try {
    const roles = [
      { name: 'admin', description: 'Role for Super Admin' },
      {
        name: 'administrasi',
        description: 'Role for Administrasi (Kasir, Social media admin, etc)',
      },
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

    // Seed OrderTypes
    const orderTypes = [
      { name: 'Banner 280gr', price: 20000, description: 'Banner standar' },
      { name: 'Banner 340gr', price: 25000, description: 'Banner tebal' },
      { name: 'Sticker Ritrama', price: 85000, description: 'Sticker kualitas tinggi' },
      { name: 'Kartu Nama', price: 35000, description: 'Satu box isi 100' },
    ];

    for (const type of orderTypes) {
      await prisma.orderType.upsert({
        where: { name: type.name },
        update: {},
        create: type,
      });
    }

    if (!options.seedUsers) {
      return;
    }

    const existingUsers = await prisma.user.count();
    let createdUsers: any[] = [];
    if (existingUsers > 0) {
      console.log('ℹ️  Users already exist. Skipping bootstrap users.');
      createdUsers = await prisma.user.findMany();
    } else {
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
        const created = await prisma.user.upsert({
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
        createdUsers.push(created);
      }
    }

    // Seed Customers
    const customers = [
      { name: 'Juse', address: 'Jl. Merdeka No. 1', contact: '08123456789' },
      { name: 'Budi Store', address: 'Jl. Sudirman No. 10', contact: '08987654321' },
      { name: 'Santi Gallery', address: 'Jl. Thamrin No. 5', contact: '08112233445' },
    ];

    let adminUser = createdUsers.find(u => u.username === 'admin');

    for (const customer of customers) {
      await prisma.customer.upsert({
        where: { name: customer.name },
        update: {},
        create: {
          ...customer,
          createdById: adminUser?.id,
        },
      });
    }

    // Seed some Orders if they don't exist
    const designerUser = createdUsers.find(u => u.username === 'designer') || createdUsers[0];
    adminUser = adminUser || createdUsers[0];

    const ordersData = [
      {
        number: 'DB-280509KFH',
        date: new Date(),
        customer: 'JUSE',
        description: 'Banner Warung',
        userId: adminUser.id,
        details: [
          { name: 'Banner 280gr', price: 20000, width: 2, height: 1, qty: 1, design: 2 },
        ],
      },
      {
        number: 'DB-280509ABC',
        date: new Date(),
        customer: 'Budi Store',
        description: 'Sticker Label',
        userId: designerUser.id,
        details: [
          { name: 'Sticker Ritrama', price: 85000, width: 1, height: 1, qty: 10, design: 1 },
        ],
      },
      {
        number: 'DB-280509XYZ',
        date: new Date(),
        customer: 'Santi Gallery',
        description: 'Kartu Nama',
        userId: adminUser.id,
        details: [
          { name: 'Kartu Nama', price: 35000, width: 0, height: 0, qty: 2, design: 0 },
        ],
      },
    ];

    for (const orderItem of ordersData) {
      const { details, ...orderInfo } = orderItem;

      const existingOrder = await prisma.order.findUnique({
        where: { number: orderInfo.number },
      });

      if (!existingOrder) {
        const createdOrder = await prisma.order.create({
          data: {
            ...orderInfo,
            OrderDetails: {
              create: details,
            },
          },
        });

        // Add some status
        if (orderItem.number === 'DB-280509KFH') {
          await prisma.payStatus.create({
            data: {
              status: true,
              orderId: createdOrder.id,
              markedById: adminUser.id,
            },
          });
        }
        console.log(`✅ Sample order ${orderItem.number} seeded.`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}
