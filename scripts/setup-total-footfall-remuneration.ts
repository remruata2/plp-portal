import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Setting up Total Footfall remuneration configuration...");

    // Get facility types
    const facilityTypes = await prisma.facilityType.findMany({
      select: { id: true, name: true },
    });

    // Get the total footfall indicator
    const totalFootfallIndicator = await prisma.indicator.findUnique({
      where: { code: "total_footfall" },
    });

    if (!totalFootfallIndicator) {
      console.error(
        "Total footfall indicator not found. Please create it first."
      );
      return;
    }

    // Define remuneration amounts per facility type
    const remunerationConfig = {
      PHC: 500, // Rs. 500 for PHC
      UPHC: 2000, // Rs. 2000 for UPHC
      SC_HWC: 300, // Rs. 300 for SC_HWC
      U_HWC: 1500, // Rs. 1500 for U_HWC
      A_HWC: 400, // Rs. 400 for A_HWC
    };

    // Set up remuneration for each facility type
    for (const facilityType of facilityTypes) {
      const amount =
        remunerationConfig[
          facilityType.name as keyof typeof remunerationConfig
        ];

      if (!amount) {
        console.warn(
          `No remuneration amount configured for facility type: ${facilityType.name}`
        );
        continue;
      }

      // Check if facility type remuneration already exists
      let facilityTypeRemuneration =
        await prisma.facilityTypeRemuneration.findUnique({
          where: { facility_type_id: facilityType.id },
        });

      if (!facilityTypeRemuneration) {
        // Create new facility type remuneration
        facilityTypeRemuneration = await prisma.facilityTypeRemuneration.create(
          {
            data: {
              facility_type_id: facilityType.id,
              total_amount: amount,
            },
          }
        );
        console.log(
          `Created remuneration for ${facilityType.name}: Rs. ${amount}`
        );
      } else {
        // Update existing remuneration
        await prisma.facilityTypeRemuneration.update({
          where: { id: facilityTypeRemuneration.id },
          data: { total_amount: amount },
        });
        console.log(
          `Updated remuneration for ${facilityType.name}: Rs. ${amount}`
        );
      }

      // Check if indicator remuneration already exists
      const existingIndicatorRemuneration =
        await prisma.indicatorRemuneration.findUnique({
          where: {
            facility_type_remuneration_id_indicator_id: {
              facility_type_remuneration_id: facilityTypeRemuneration.id,
              indicator_id: totalFootfallIndicator.id,
            },
          },
        });

      if (!existingIndicatorRemuneration) {
        // Create indicator remuneration
        await prisma.indicatorRemuneration.create({
          data: {
            facility_type_remuneration_id: facilityTypeRemuneration.id,
            indicator_id: totalFootfallIndicator.id,
            base_amount: amount,
          },
        });
        console.log(
          `Created indicator remuneration for ${facilityType.name} - Total Footfall: Rs. ${amount}`
        );
      } else {
        // Update existing indicator remuneration
        await prisma.indicatorRemuneration.update({
          where: { id: existingIndicatorRemuneration.id },
          data: { base_amount: amount },
        });
        console.log(
          `Updated indicator remuneration for ${facilityType.name} - Total Footfall: Rs. ${amount}`
        );
      }
    }

    console.log("Total Footfall remuneration configuration setup complete!");
  } catch (error) {
    console.error("Error setting up remuneration configuration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
