import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function checkFacilityTypes() {
  try {
    const facilityTypes = await prisma.facilityType.findMany({
      orderBy: { name: "asc" },
    });

    console.log("📋 Current Facility Types in Database:");
    facilityTypes.forEach((ft, index) => {
      console.log(`  ${index + 1}. ${ft.name} (ID: ${ft.id})`);
    });

    if (facilityTypes.length === 0) {
      console.log(
        "  ⚠️  No facility types found. Please run the main seed first."
      );
    }
  } catch (error) {
    console.error("❌ Error checking facility types:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFacilityTypes();
