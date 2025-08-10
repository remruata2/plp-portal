import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function checkFacilityTypes() {
  console.log("🔍 Checking facility types in database...");

  try {
    const facilityTypes = await prisma.facilityType.findMany({
      where: { is_active: true },
      select: {
        id: true,
        name: true,
        display_name: true,
        is_active: true,
      },
      orderBy: { name: "asc" },
    });

    console.log(`\n📊 Found ${facilityTypes.length} active facility types:`);
    
    if (facilityTypes.length === 0) {
      console.log("❌ No active facility types found!");
      console.log("   This is why the dropdown shows 'NaN'");
      console.log("\n💡 To fix this, you need to:");
      console.log("   1. Create facility types in the database");
      console.log("   2. Or run the facility type seeding script");
      return;
    }

    facilityTypes.forEach((ft, index) => {
      console.log(`  ${index + 1}. ID: ${ft.id}, Name: "${ft.name}", Display: "${ft.display_name || 'N/A'}"`);
    });

    // Test the API endpoint
    console.log(`\n🌐 Testing API endpoint...`);
    const response = await fetch("http://localhost:3002/api/admin/facility-types");
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ API returned ${data.length} facility types`);
      data.forEach((ft: any, index: number) => {
        console.log(`    ${index + 1}. ID: ${ft.id}, Name: "${ft.name}", Display: "${ft.displayName}"`);
      });
    } else {
      console.log(`  ❌ API returned status: ${response.status}`);
      const error = await response.text();
      console.log(`  Error: ${error}`);
    }

  } catch (error) {
    console.error("❌ Error checking facility types:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFacilityTypes(); 