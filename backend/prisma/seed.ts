import { seedData } from '../src/seed/seed-data';

async function main() {
  const isProduction = process.env.NODE_ENV === 'production';
  const shouldSeedUsers =
    process.env.SEED_USERS === 'true' || process.env.SEED_USERS === '1';

  if (isProduction && !shouldSeedUsers) {
    console.log(
      'ℹ️  Skipping user seed in production. Set SEED_USERS=true to bootstrap.',
    );
    await seedData({ seedUsers: false });
  } else {
    await seedData({ seedUsers: true });
  }

  console.log('✅ Seed finished.\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  });
