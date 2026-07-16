import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const defaults: Array<{ key: string; value: string }> = [
    { key: 'platform.name', value: 'lott0.online' },
    { key: 'platform.currency', value: 'THB' },
    { key: 'wallet.minDeposit', value: '100.00' },
    { key: 'wallet.maxDeposit', value: '1000000.00' },
    { key: 'betting.maxPerTicket', value: '1000.00' },
  ];

  for (const cfg of defaults) {
    await prisma.systemConfig.upsert({
      where: { key: cfg.key },
      update: { value: cfg.value, updatedBy: 'seed' },
      create: { key: cfg.key, value: cfg.value, updatedBy: 'seed' },
    });
  }

  console.log(`Seeded ${defaults.length} system_config rows.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
