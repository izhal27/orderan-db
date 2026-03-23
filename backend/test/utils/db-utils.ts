import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function isSqlite(): boolean {
  const url = process.env.DATABASE_URL ?? '';
  return url.startsWith('file:') || url.includes('sqlite');
}

export async function truncateTable(table: string) {
  await prisma.$executeRawUnsafe(`DELETE FROM "${table}";`);
  // Optional: reset auto increment for SQLite
  if (isSqlite()) {
    await prisma.$executeRawUnsafe(
      `DELETE FROM sqlite_sequence WHERE name='${table}';`,
    );
  }
}

export async function truncateCustomers() {
  await truncateTable('Customer');
}

export async function truncateOrders() {
  await truncateTable('Order');
}

export async function truncateOrderTypes() {
  await truncateTable('OrderType');
}

export async function truncateRoles() {
  await truncateTable('Role');
}

export async function truncateAll() {
  await Promise.all([
    truncateTable('Customer'),
    truncateTable('Order'),
    truncateTable('OrderType'),
    // Note: don't truncate Role here to avoid nulling user.roleId via FK.
  ]);
}
