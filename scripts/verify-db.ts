import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to the database to verify indicator count...');
    const indicatorCount = await prisma.indicator.count();
    console.log(`Total indicators found in the database: ${indicatorCount}`);
  } catch (error) {
    console.error('Failed to verify database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
