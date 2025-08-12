import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function setupCompleteSystem() {
  try {
    console.log("🚀 Starting complete system setup...");

    // Clear existing data
    console.log("🗑️ Clearing existing data...");
    
    // Clear performance calculations (now using FacilityRemunerationRecord)
    console.log("📊 Clearing existing performance records...");
    await prisma.facilityRemunerationRecord.deleteMany();
    console.log("✅ Performance records cleared");

    // Clear remuneration calculations
    console.log("💰 Clearing existing remuneration calculations...");
    await prisma.remunerationCalculation.deleteMany();
    console.log("✅ Remuneration calculations cleared");

    // Clear worker remunerations
    console.log("👥 Clearing existing worker remunerations...");
    await prisma.workerRemuneration.deleteMany();
    console.log("✅ Worker remunerations cleared");

    // Clear field values
    console.log("📝 Clearing existing field values...");
    await prisma.fieldValue.deleteMany();
    console.log("✅ Field values cleared");

    // Clear facility targets
    console.log("🎯 Clearing existing facility targets...");
    await prisma.facilityTarget.deleteMany();
    console.log("✅ Facility targets cleared");

    // Clear health workers
    console.log("🏥 Clearing existing health workers...");
    await prisma.healthWorker.deleteMany();
    console.log("✅ Health workers cleared");

    // Clear facilities
    console.log("🏢 Clearing existing facilities...");
    await prisma.facility.deleteMany();
    console.log("✅ Facilities cleared");

    // Clear facility types
    console.log("🏥 Clearing existing facility types...");
    await prisma.facilityType.deleteMany();
    console.log("✅ Facility types cleared");

    // Clear districts
    console.log("🗺️ Clearing existing districts...");
    await prisma.district.deleteMany();
    console.log("✅ Districts cleared");

    // Clear indicators
    console.log("📊 Clearing existing indicators...");
    await prisma.indicator.deleteMany();
    console.log("✅ Indicators cleared");

    // Clear fields
    console.log("📝 Clearing existing fields...");
    await prisma.field.deleteMany();
    console.log("✅ Fields cleared");

    // Clear users
    console.log("👤 Clearing existing users...");
    await prisma.user.deleteMany();
    console.log("✅ Users cleared");

    console.log("🎉 Complete system setup completed successfully!");
    console.log("📋 All existing data has been cleared");
    console.log("🔧 The system is now ready for fresh data entry");

  } catch (error) {
    console.error("❌ Error during system setup:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupCompleteSystem()
  .then(() => {
    console.log("✅ Setup completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });
