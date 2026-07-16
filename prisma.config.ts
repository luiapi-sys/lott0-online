import { defineConfig } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

export default defineConfig({
  migrations: {
    adapter: '@prisma/adapter-pg',
  },
  datasource: {
    url: connectionString,
  },
  // Prisma 7: generate the client next to source so nest build can compile it.
  generator: {
    provider: 'prisma-client',
    output: './src/generated/prisma',
    previewFeatures: ['prisma-client'],
  },
});
