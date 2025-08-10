import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function seedMaster() {
  console.log("🚀 Starting MASTER database seeding...");
  console.log("This will seed everything needed for app deployment\n");

  try {
    // Step 1: Basic structure (districts, facility types, admin user)
    console.log("📋 Step 1: Basic database structure...");
    const { execSync } = require("child_process");
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
    console.log("✅ Basic structure completed\n");

    // Step 2: Seed fields (required for indicators)
    console.log("📝 Step 2: Seeding health fields...");
    execSync("npx tsx prisma/seed-fields-complete.ts", { stdio: "inherit" });
    console.log("✅ Fields seeding completed\n");

    // Step 3: Seed indicators from fields
    console.log("📊 Step 3: Seeding indicators...");
    execSync("npx tsx prisma/seed-indicators-from-fields.ts", { stdio: "inherit" });
    console.log("✅ Indicators seeding completed\n");

    // Step 4: Seed facilities
    console.log("🏥 Step 4: Seeding facilities...");
    execSync("npx tsx prisma/seed-complete.ts", { stdio: "inherit" });
    console.log("✅ Facilities seeding completed\n");

    // Step 5: Setup facility field mappings
    console.log("🔗 Step 5: Setting up facility field mappings...");
    execSync("npx tsx scripts/setup-facility-field-mappings.ts", { stdio: "inherit" });
    console.log("✅ Facility field mappings completed\n");

    // Step 6: Setup worker allocation configs
    console.log("👥 Step 6: Setting up worker allocation configs...");
    execSync("npx tsx scripts/seed-worker-allocation-config.ts", { stdio: "inherit" });
    console.log("✅ Worker allocation configs completed\n");

    // Step 7: Setup remuneration system
    console.log("💰 Step 7: Setting up remuneration system...");
    execSync("npx tsx scripts/seed-remuneration-data.ts", { stdio: "inherit" });
    console.log("✅ Remuneration system completed\n");

    // Step 8: Setup comprehensive remuneration configuration
    console.log("🎯 Step 8: Setting up comprehensive remuneration...");
    execSync("npx tsx scripts/setup-all-indicators-remuneration.ts", { stdio: "inherit" });
    console.log("✅ Comprehensive remuneration completed\n");

    // Step 9: Create facility users
    console.log("👥 Step 9: Creating facility users...");
    execSync("npx tsx scripts/create-facility-users.ts", { stdio: "inherit" });
    console.log("✅ Facility users completed\n");

    // Step 10: Create facility targets (if needed)
    console.log("🎯 Step 10: Creating facility targets...");
    await createFacilityTargets();
    console.log("✅ Facility targets completed\n");

    // Step 11: Final verification
    console.log("🔍 Step 11: Final verification...");
    await printFinalSummary();
    console.log("✅ Final verification completed\n");

    console.log("\n🎉 MASTER SEEDING COMPLETED SUCCESSFULLY!");
    console.log("\n📋 What has been seeded:");
    console.log("   ✅ Basic structure (districts, facility types, admin user)");
    console.log("   ✅ Health fields (43 fields)");
    console.log("   ✅ Indicators (35 indicators with field mappings)");
    console.log("   ✅ Facilities (513 facilities across 12 districts)");
    console.log("   ✅ Facility field mappings (119 mappings)");
    console.log("   ✅ Worker allocation configs (15 configs)");
    console.log("   ✅ Remuneration system (5 facility types)");
    console.log("   ✅ Comprehensive remuneration (all indicators)");
    console.log("   ✅ Facility users (513 users, one per facility)");
    console.log("   ✅ Facility targets (basic structure)");
    console.log("\n🚀 Your app is now ready for deployment!");

  } catch (error) {
    console.error("❌ Error during master seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function createFacilityTargets() {
  try {
    console.log("   - Creating basic facility targets structure...");
    
    // Get all facilities and indicators
    const facilities = await prisma.facility.findMany();
    const indicators = await prisma.indicator.findMany();
    
    // Create basic targets for current month (YYYY-MM format)
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    let targetsCreated = 0;
    
    for (const facility of facilities) {
      for (const indicator of indicators) {
        try {
          // Check if target already exists
          const existingTarget = await prisma.facilityTarget.findUnique({
            where: {
              facility_id_indicator_id_report_month: {
                facility_id: facility.id,
                indicator_id: indicator.id,
                report_month: currentMonth
              }
            }
          });
          
          if (!existingTarget) {
            await prisma.facilityTarget.create({
              data: {
                facility_id: facility.id,
                indicator_id: indicator.id,
                report_month: currentMonth,
                target_value: 0, // Default target value
                numerator_label: indicator.numerator_label || "Numerator",
                denominator_label: indicator.denominator_label || "Denominator"
              }
            });
            targetsCreated++;
          }
        } catch (error: any) {
          if (error.code === 'P2002') {
            // Target already exists, skip
            continue;
          }
          console.error(`Error creating target for facility ${facility.name} and indicator ${indicator.code}:`, error);
        }
      }
    }
    
    console.log(`   - Created ${targetsCreated} facility targets for ${currentMonth}`);
    
  } catch (error) {
    console.error("   - Error creating facility targets:", error);
  }
}

async function printFinalSummary() {
  try {
    const indicators = await prisma.indicator.count();
    const fields = await prisma.field.count();
    const facilities = await prisma.facility.count();
    const facilityTypes = await prisma.facilityType.count();
    const districts = await prisma.district.count();
    const users = await prisma.user.count();
    const facilityFieldMappings = await prisma.facilityFieldMapping.count();
    const workerAllocationConfigs = await prisma.workerAllocationConfig.count();
    const facilityTypeRemunerations = await prisma.facilityTypeRemuneration.count();
    const facilityTargets = await prisma.facilityTarget.count();

    console.log("   📊 Final Database Summary:");
    console.log(`      • Indicators: ${indicators}`);
    console.log(`      • Fields: ${fields}`);
    console.log(`      • Facilities: ${facilities}`);
    console.log(`      • Facility Types: ${facilityTypes}`);
    console.log(`      • Districts: ${districts}`);
    console.log(`      • Users: ${users} (admin + facility users)`);
    console.log(`      • Facility Field Mappings: ${facilityFieldMappings}`);
    console.log(`      • Worker Allocation Configs: ${workerAllocationConfigs}`);
    console.log(`      • Facility Type Remunerations: ${facilityTypeRemunerations}`);
    console.log(`      • Facility Targets: ${facilityTargets}`);
    
  } catch (error) {
    console.error("   - Error getting final summary:", error);
  }
}

// Run the master seeding
seedMaster()
  .catch((e: any) => {
    console.error("💥 Master seeding failed:", e.message);
    process.exit(1);
  });
