import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const usersWithFields = await prisma.user.findMany({
    where: {
      field_value: {
        some: {}
      }
    },
    include: {
      _count: {
        select: { field_value: true }
      }
    }
  });

  console.log(usersWithFields.map((u: any) => ({ id: u.id, username: u.username, count: u._count.field_value })));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
