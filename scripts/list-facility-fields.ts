import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function listFacilityFields() {
  try {
    // Get all facility types
    const facilityTypes = await prisma.facilityType.findMany({
      orderBy: { name: "asc" },
    });

    console.log("=== FACILITY FIELDS BY FACILITY TYPE ===\n");

    for (const facilityType of facilityTypes) {
      console.log(`\n📋 ${facilityType.name.toUpperCase()}`);
      console.log("=".repeat(50));

      // Get field mappings for this facility type
      const mappings = await prisma.facilityFieldMapping.findMany({
        where: {
          facility_type_id: facilityType.id,
        },
        include: {
          field: true,
        },
        orderBy: {
          display_order: "asc",
        },
      });

      if (mappings.length === 0) {
        console.log("❌ No fields configured for this facility type");
        continue;
      }

      console.log(`Total fields: ${mappings.length}\n`);

      mappings.forEach((mapping, index) => {
        const field = mapping.field;
        console.log(`${index + 1}. ${field.description}`);
        console.log(`   Code: ${field.code}`);
        console.log(`   Type: ${field.field_type}`);
        console.log(`   Required: ${mapping.is_required ? "Yes" : "No"}`);
        console.log("");
      });
    }

    console.log("\n=== SUMMARY ===");
    console.log("=".repeat(50));

    for (const facilityType of facilityTypes) {
      const count = await prisma.facilityFieldMapping.count({
        where: {
          facility_type_id: facilityType.id,
        },
      });
      console.log(`${facilityType.name}: ${count} fields`);
    }
  } catch (error) {
    console.error("Error listing facility fields:", error);
  } finally {
    await prisma.$disconnect();
  }
}

listFacilityFields();
