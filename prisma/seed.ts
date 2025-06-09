import { PrismaClient, UserRole } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  const adminPassword = await bcrypt.hash('password123', 10);
  const staffPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      username: 'admin',
      password_hash: adminPassword,
      role: UserRole.admin,
      is_active: true,
    },
    {
      username: 'staffuser',
      password_hash: staffPassword,
      role: UserRole.staff,
      is_active: true,
    },
  ];

  for (const u of users) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id} (${user.username})`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
