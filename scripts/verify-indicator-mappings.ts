import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function verifyIndicatorMappings() {
  console.log("🔍 Verifying indicator field mappings...");

  try {
    const indicators = await prisma.indicator.findMany({
      include: {
        numerator_field: true,
        denominator_field: true,
        target_field: true,
      },
      orderBy: {
        code: "asc",
      },
    });

    console.log(`\n📊 Found ${indicators.length} indicators:\n`);

    for (const indicator of indicators) {
      console.log(`\n${indicator.code} - ${indicator.name}`);
      console.log(
        `  Numerator: ${indicator.numerator_field?.name || "None"} (${
          indicator.numerator_field?.code || "N/A"
        })`
      );
      console.log(
        `  Denominator: ${indicator.denominator_field?.name || "None"} (${
          indicator.denominator_field?.code || "N/A"
        })`
      );
      console.log(
        `  Target: ${indicator.target_field?.name || "None"} (${
          indicator.target_field?.code || "N/A"
        })`
      );
      console.log(`  Target Value: ${indicator.target_value}`);
      console.log(`  Target Formula: ${indicator.target_formula}`);
      console.log(`  Conditions: ${indicator.conditions}`);

      // Check if mappings are correct
      const hasNumerator = !!indicator.numerator_field;
      const hasDenominator = !!indicator.denominator_field;
      const hasTarget = !!indicator.target_field;

      if (!hasNumerator || !hasDenominator) {
        console.log(`  ⚠️  WARNING: Missing field mappings`);
      } else {
        console.log(`  ✅ Field mappings look correct`);
      }
    }

    // Check for any unmapped indicators
    const unmappedIndicators = indicators.filter(
      (i) => !i.numerator_field || !i.denominator_field
    );

    if (unmappedIndicators.length > 0) {
      console.log(
        `\n❌ Found ${unmappedIndicators.length} indicators with missing field mappings:`
      );
      unmappedIndicators.forEach((i) => {
        console.log(`  - ${i.code}: ${i.name}`);
      });
    } else {
      console.log(`\n✅ All indicators have proper field mappings!`);
    }
  } catch (error) {
    console.error("❌ Error verifying mappings:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyIndicatorMappings();
