import { PrismaClient } from "./src/generated/prisma";

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("=== Checking Database State ===");

    // Check facility types
    const facilityTypes = await prisma.facilityType.findMany({
      select: { id: true, name: true, is_active: true },
    });
    console.log("Facility Types:", facilityTypes);

    // Check fields
    const fields = await prisma.field.findMany({
      select: { id: true, code: true, name: true, is_active: true },
      take: 10,
    });
    console.log("First 10 Fields:", fields);

    // Check field mappings for PHC
    const phcMappings = await prisma.facilityFieldMapping.findMany({
      where: {
        facility_type: {
          name: "PHC",
        },
      },
      include: {
        field: true,
        facility_type: true,
      },
    });
    console.log("PHC Field Mappings:", phcMappings.length);
    console.log(
      "PHC Mappings Details:",
      phcMappings.map((m) => ({
        fieldCode: m.field.code,
        fieldName: m.field.name,
        displayOrder: m.display_order,
      }))
    );
  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
