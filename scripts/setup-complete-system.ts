import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function setupCompleteSystem() {
  console.log("🚀 Setting up complete field-based system...");

  try {
    // Step 1: Clear existing data
    console.log("🧹 Clearing existing data...");
    await prisma.fieldValue.deleteMany();
    await prisma.facilityFieldDefaults.deleteMany();
    await prisma.facilityFieldMapping.deleteMany();
    await prisma.monthlyHealthData.deleteMany();
    await prisma.indicatorRemuneration.deleteMany();
    await prisma.performanceCalculation.deleteMany();
    await prisma.facilityTarget.deleteMany();
    await prisma.indicator.deleteMany();
    await prisma.field.deleteMany();

    // Step 2: Seed fields
    console.log("📝 Seeding fields...");
    const { execSync } = require("child_process");
    execSync("npx tsx prisma/seed-fields-complete.ts", { stdio: "inherit" });

    // Step 3: Seed indicators
    console.log("📊 Seeding indicators...");
    execSync("npx tsx prisma/seed-indicators-from-fields.ts", {
      stdio: "inherit",
    });

    // Step 4: Setup facility field mappings
    console.log("🔗 Setting up facility field mappings...");
    execSync("npx tsx scripts/setup-facility-field-mappings.ts", {
      stdio: "inherit",
    });

    console.log("✅ Complete system setup finished!");
    console.log("");
    console.log("📋 Summary:");
    console.log("- Fields created and categorized");
    console.log("- Indicators created with field mappings");
    console.log("- Facility field mappings configured");
    console.log("- Auto-calculation system ready");
    console.log("");
    console.log("🎯 Next steps:");
    console.log("1. Run the system to test field submissions");
    console.log("2. Verify indicator calculations");
    console.log("3. Test incentive calculations");
  } catch (error) {
    console.error("❌ Error during system setup:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupCompleteSystem();
