import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not defined.');
  }

  // Create the connection pool
  const pool = new pg.Pool({
    connectionString,
  });

  // Create the PrismaPg adapter
  const adapter = new PrismaPg(pool);

  // Instantiate PrismaClient with the adapter
  return new PrismaClient({ adapter });
};

const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
