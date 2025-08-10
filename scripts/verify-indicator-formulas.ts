import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function verifyIndicatorFormulas() {
  console.log("🔍 Verifying indicator formulas...");

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
      const formula =
        indicator.formula_config?.calculationFormula || "(A/B)*100";

      console.log(`\n${indicator.code} - ${indicator.name}`);
      console.log(`  Formula: ${formula}`);
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
      console.log(`  Target Value: ${indicator.target_value}`);
      console.log(`  Target Formula: ${indicator.target_formula}`);

      // Check if formula matches expected pattern
      let expectedFormula = "(A/B)*100"; // Default

      if (["CB001", "HS001", "DS001"].includes(indicator.code)) {
        expectedFormula = "(A/(B/12))*100"; // Monthly targets
      } else if (["OC001", "BC001"].includes(indicator.code)) {
        expectedFormula = "(A/(B/60))*100"; // 5-year targets
      } else if (["ES001", "EA001"].includes(indicator.code)) {
        expectedFormula = "A"; // Binary indicators
      } else if (["PS001"].includes(indicator.code)) {
        expectedFormula = "A"; // Direct score
      }

      if (formula === expectedFormula) {
        console.log(`  ✅ Formula is correct`);
      } else {
        console.log(
          `  ❌ Formula mismatch! Expected: ${expectedFormula}, Got: ${formula}`
        );
      }
    }

    // Check for specific indicators that should have special formulas
    const specialFormulas = [
      { code: "CB001", expected: "(A/(B/12))*100", name: "CBAC filled" },
      { code: "HS001", expected: "(A/(B/12))*100", name: "HTN screened" },
      { code: "DS001", expected: "(A/(B/12))*100", name: "DM screened" },
      {
        code: "OC001",
        expected: "(A/(B/60))*100",
        name: "Oral Cancer screened",
      },
      {
        code: "BC001",
        expected: "(A/(B/60))*100",
        name: "Breast & Cervical Cancer screened",
      },
      { code: "ES001", expected: "A", name: "Elderly Support Group formed" },
      { code: "EA001", expected: "A", name: "Elderly Support Group activity" },
      { code: "PS001", expected: "A", name: "Patient satisfaction score" },
    ];

    console.log(`\n📋 Special Formula Verification:`);
    for (const special of specialFormulas) {
      const indicator = indicators.find((i) => i.code === special.code);
      if (indicator) {
        const formula =
          indicator.formula_config?.calculationFormula || "(A/B)*100";
        if (formula === special.expected) {
          console.log(`  ✅ ${special.code} (${special.name}): ${formula}`);
        } else {
          console.log(
            `  ❌ ${special.code} (${special.name}): Expected ${special.expected}, Got ${formula}`
          );
        }
      }
    }
  } catch (error) {
    console.error("❌ Error verifying formulas:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyIndicatorFormulas();
