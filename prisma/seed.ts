import { PrismaClient, UserRole } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Create sample users
  const adminPassword = await bcrypt.hash("password123", 10);
  const staffPassword = await bcrypt.hash("password123", 10);

  const users = [
    {
      username: "admin",
      password_hash: adminPassword,
      role: UserRole.admin,
    },
    {
      username: "staffuser",
      password_hash: staffPassword,
      role: UserRole.staff,
    },
  ];

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: u,
    });
    console.log(`Created/found user with id: ${user.id} (${user.username})`);
  }

  // Create facility types
  const facilityTypes = [
    { name: "District Hospital" },
    { name: "Private Hospital" },
    { name: "Community Health Centre" },
    { name: "Primary Health Centre" },
    { name: "Urban Primary Health Centre" },
  ];

  for (const ft of facilityTypes) {
    const facilityType = await prisma.facilityType.create({
      data: ft,
    });
    console.log(`Created facility type: ${facilityType.name}`);
  }

  // Create sample districts (Mizoram districts)
  const districts = [
    { name: "Aizawl East" },
    { name: "Aizawl West" },
    { name: "Champhai" },
    { name: "Hnahthial" },
    { name: "Khawzawl" },
    { name: "Kolasib" },
    { name: "Lawngtlai" },
    { name: "Lunglei" },
    { name: "Mamit" },
    { name: "Saitual" },
    { name: "Serchhip" },
    { name: "Siaha" },
  ];

  for (const d of districts) {
    const district = await prisma.district.create({
      data: d,
    });
    console.log(`Created district: ${district.name}`);
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
