import { PrismaClient } from "../src/generated/prisma";
import {
  FormulaCalculator,
  FormulaConfig,
} from "../src/lib/calculations/formula-calculator";

const prisma = new PrismaClient();

async function debugConditionTest() {
  console.log("🔍 Debugging Condition Handling");
  console.log("=".repeat(40));

  try {
    // Get AF001 indicator
    const indicator = await prisma.indicator.findUnique({
      where: { code: "AF001" },
    });

    if (!indicator) {
      console.log("❌ AF001 not found");
      return;
    }

    console.log("📋 AF001 Formula Config:");
    console.log(JSON.stringify(indicator.formula_config, null, 2));

    // Parse formula config
    const formulaConfig: FormulaConfig = {
      type: indicator.formula_type as any,
      ...(typeof indicator.formula_config === "string"
        ? JSON.parse(indicator.formula_config)
        : indicator.formula_config),
    };

    console.log("\n🔧 Parsed Formula Config:");
    console.log("conditionType:", formulaConfig.conditionType);
    console.log("conditionField:", formulaConfig.conditionField);
    console.log("conditionValue:", formulaConfig.conditionValue);

    // Test with ANC due = 0
    const fieldValues = { anc_due_list: 0 };
    console.log("\n🧪 Testing with fieldValues:", fieldValues);

    const result = FormulaCalculator.calculateRemuneration(
      50, // submittedValue
      100, // targetValue
      500, // maxRemuneration
      formulaConfig,
      undefined, // facilityType
      undefined, // conditionMet
      fieldValues // fieldValues
    );

    console.log("\n📊 Result:");
    console.log("Status:", result.status);
    console.log("Remuneration:", result.remuneration);
    console.log("Message:", result.message);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

debugConditionTest();
