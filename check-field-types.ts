import { PrismaClient } from "./src/generated/prisma";

const prisma = new PrismaClient();

async function checkFieldTypes() {
  try {
    console.log("=== Checking Field Types ===");

    // Check fields that are mapped to PHC
    const phcFields = await prisma.facilityFieldMapping.findMany({
      where: {
        facility_type: {
          name: "PHC",
        },
      },
      include: {
        field: true,
      },
      take: 5,
    });

    console.log("PHC Field Types:");
    phcFields.forEach((mapping) => {
      console.log(`- ${mapping.field.name}: ${mapping.field.field_type}`);
    });
  } catch (error) {
    console.error("Error checking field types:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFieldTypes();
