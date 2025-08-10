import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Setting up Total Footfall indicator...");

    // Check if total footfall indicator already exists
    let totalFootfallIndicator = await prisma.indicator.findUnique({
      where: { code: "total_footfall" },
    });

    if (totalFootfallIndicator) {
      console.log(
        "Total footfall indicator already exists, updating configuration..."
      );

      // Update the indicator with the correct formula configuration
      await prisma.indicator.update({
        where: { id: totalFootfallIndicator.id },
        data: {
          name: "Total Footfall (M&F)",
          description: "Total footfall for SC, PHC+colocated SC for PHC",
          type: "PERCENTAGE",
          formula_type: "PERCENTAGE_RANGE",
          target_type: "PERCENTAGE_RANGE",
          target_value: "3-5",
          target_formula: "upto 3%-5%",
          formula_config: {
            type: "PERCENTAGE_RANGE",
            range: { min: 3, max: 5 },
            description:
              "Must achieve between 3% and 5% of catchment population",
          },
          numerator_label: "Total Footfall (M&F)",
          denominator_label: "Total Catchment Population",
          applicable_facility_types: [
            "PHC",
            "UPHC",
            "SC_HWC",
            "U_HWC",
            "A_HWC",
          ],
        },
      });

      console.log("Updated total footfall indicator configuration");
    } else {
      console.log("Creating new total footfall indicator...");

      // Create the total footfall indicator
      totalFootfallIndicator = await prisma.indicator.create({
        data: {
          code: "total_footfall",
          name: "Total Footfall (M&F)",
          description: "Total footfall for SC, PHC+colocated SC for PHC",
          type: "PERCENTAGE",
          formula_type: "PERCENTAGE_RANGE",
          target_type: "PERCENTAGE_RANGE",
          target_value: "3-5",
          target_formula: "upto 3%-5%",
          formula_config: {
            type: "PERCENTAGE_RANGE",
            range: { min: 3, max: 5 },
            description:
              "Must achieve between 3% and 5% of catchment population",
          },
          numerator_label: "Total Footfall (M&F)",
          denominator_label: "Total Catchment Population",
          applicable_facility_types: [
            "PHC",
            "UPHC",
            "SC_HWC",
            "U_HWC",
            "A_HWC",
          ],
        },
      });

      console.log("Created total footfall indicator");
    }

    // Create or update the catchment population field
    let catchmentPopulationField = await prisma.field.findUnique({
      where: { code: "catchment_population" },
    });

    if (!catchmentPopulationField) {
      catchmentPopulationField = await prisma.field.create({
        data: {
          code: "catchment_population",
          name: "Total Catchment Population",
          description: "Total population in the facility's catchment area",
          user_type: "FACILITY",
          field_type: "FACILITY_SPECIFIC",
          field_category: "DATA_FIELD",
          validation_rules: {
            required: true,
            min_value: 1,
            max_value: 100000,
          },
          sort_order: 1,
        },
      });
      console.log("Created catchment population field");
    }

    // Create or update the total footfall field
    let totalFootfallField = await prisma.field.findUnique({
      where: { code: "total_footfall" },
    });

    if (!totalFootfallField) {
      totalFootfallField = await prisma.field.create({
        data: {
          code: "total_footfall",
          name: "Total Footfall (M&F)",
          description: "Total footfall for the month (Male/Female/Others)",
          user_type: "FACILITY",
          field_type: "MONTHLY_COUNT",
          field_category: "DATA_FIELD",
          validation_rules: {
            required: true,
            min_value: 0,
            max_value: 100000,
          },
          sort_order: 2,
        },
      });
      console.log("Created total footfall field");
    }

    // Update the indicator to reference the fields
    await prisma.indicator.update({
      where: { id: totalFootfallIndicator.id },
      data: {
        numerator_field_id: totalFootfallField.id,
        denominator_field_id: catchmentPopulationField.id,
      },
    });

    console.log("Total Footfall indicator setup complete!");
    console.log("\nConfiguration Summary:");
    console.log("- Indicator: Total Footfall (M&F)");
    console.log("- Formula: upto 3%-5%");
    console.log("- Numerator: Total Footfall (M&F)");
    console.log("- Denominator: Total Catchment Population");
    console.log("- Target: 3% to 5% of catchment population");
    console.log("- Remuneration: PHC (Rs. 500), UPHC (Rs. 2000)");
  } catch (error) {
    console.error("Error setting up total footfall indicator:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
