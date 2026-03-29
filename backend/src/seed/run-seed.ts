import { seedData } from './seed-data';

const isProduction = process.env.NODE_ENV === 'production';
const seedUsersEnv = (process.env.SEED_USERS || '').toLowerCase();
const isSeedUsersTrue = seedUsersEnv === 'true' || seedUsersEnv === '1';
const isSeedUsersFalse = seedUsersEnv === 'false' || seedUsersEnv === '0';

const shouldSeedUsers =
  isSeedUsersTrue || (isProduction && !isSeedUsersFalse);

async function run() {
  if (!shouldSeedUsers) {
    console.log('ℹ️  Skipping user seed. Set SEED_USERS=true to enable.');
    return;
  }

  await seedData({ seedUsers: true });
  console.log('✅ Seed finished.\n');
}

run().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
