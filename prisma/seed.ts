import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting basic database seeding...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@plp-portal.com",
      password_hash: hashedPassword,
      role: "admin",
    },
  });

  console.log("✅ Admin user created/updated");

  // Seed facility types
  const facilityTypes = [
    { name: "PHC", display_name: "Primary Health Centre" },
    { name: "UPHC", display_name: "Urban Primary Health Centre" },
    { name: "SC_HWC", display_name: "Sub Centre Health & Wellness Centre" },
    { name: "U_HWC", display_name: "Urban Health & Wellness Centre" },
    { name: "A_HWC", display_name: "AYUSH Health & Wellness Centre" },
  ];

  for (const facilityType of facilityTypes) {
    await prisma.facilityType.upsert({
      where: { name: facilityType.name },
      update: {},
      create: {
        name: facilityType.name,
        display_name: facilityType.display_name,
      },
    });
  }

  console.log("✅ Facility types created/updated");

  // Create districts
  const districts = [
    "Aizawl East",
    "Aizawl West",
    "Champhai",
    "Hnahthial",
    "Khawzawl",
    "Kolasib",
    "Lawngtlai",
    "Lunglei",
    "Mamit",
    "Saiha",
    "Saitual",
    "Serchhip",
  ];

  for (const districtName of districts) {
    await prisma.district.upsert({
      where: { name: districtName },
      update: {},
      create: { name: districtName },
    });
  }

  console.log("✅ Districts created/updated");

  console.log("\n🎉 Basic database structure seeded successfully!");
  console.log("\n📋 Next steps to complete the setup:");
  console.log("\n   1. Seed fields (required for indicators):");
  console.log("      npx ts-node prisma/seed-fields-complete.ts");
  console.log("\n   2. Seed indicators from fields:");
  console.log("      npx ts-node prisma/seed-indicators-from-fields.ts");
  console.log("\n   3. Seed facilities:");
  console.log("      npx ts-node prisma/seed-complete.ts");
  console.log("\n   Or run all at once:");
  console.log(
    "      npx ts-node prisma/seed-fields-complete.ts && npx ts-node prisma/seed-indicators-from-fields.ts && npx ts-node prisma/seed-complete.ts"
  );
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
