import { defineConfig } from 'prisma/config';

const connectionString = process.env.DATABASE_URL;

export default defineConfig({
  datasource: {
    url: connectionString,
  },
});
