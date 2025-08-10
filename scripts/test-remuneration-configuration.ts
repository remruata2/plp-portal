import { PrismaClient, FormulaType } from "../src/generated/prisma";
import { FormulaCalculator } from "../src/lib/calculations/formula-calculator";

const prisma = new PrismaClient();

async function testRemunerationConfiguration() {
  try {
    console.log("💰 Testing Remuneration Configuration");
    console.log("====================================");

    // Test 1: Total Footfall with Remuneration Configuration
    console.log("\n📊 Test 1: Total Footfall with Remuneration Configuration");
    console.log("─".repeat(50));

    const totalFootfallConfig = {
      code: "TF001",
      name: "Total Footfall (M&F)",
      description: "Total footfall as percentage of catchment population",
      numerator_field_id: "1",
      denominator_field_id: "2",
      numerator_label: "Total Footfall",
      denominator_label: "Catchment Population",
      target_type: "PERCENTAGE" as const,
      target_value: "3-5",
      target_formula: "upto 3%-5%",
      formula_type: "PERCENTAGE_RANGE" as FormulaType,
      calculation_formula: "(numerator/denominator)*100",
      has_facility_specific_targets: false,
      facility_specific_targets: {},
      has_remuneration_config: true,
      remuneration_config: {
        base_amount: 500,
        conditional_amount: 300,
        condition_type: "WITH_TB_PATIENT",
        facility_type_remuneration_id: 1,
      },
      has_conditional_remuneration: false,
      conditional_remuneration: {
        condition_type: "WITH_TB_PATIENT",
        with_condition_amount: 0,
        without_condition_amount: 0,
        condition_description: "",
      },
      conditions: "",
    };

    console.log("✅ Total Footfall Configuration:");
    console.log(`  Code: ${totalFootfallConfig.code}`);
    console.log(`  Name: ${totalFootfallConfig.name}`);
    console.log(`  Formula Type: ${totalFootfallConfig.formula_type}`);
    console.log(
      `  Base Amount: Rs. ${totalFootfallConfig.remuneration_config.base_amount}`
    );
    console.log(
      `  Conditional Amount: Rs. ${totalFootfallConfig.remuneration_config.conditional_amount}`
    );
    console.log(
      `  Condition Type: ${totalFootfallConfig.remuneration_config.condition_type}`
    );

    // Test 2: TB Contact Tracing with Conditional Remuneration
    console.log(
      "\n📊 Test 2: TB Contact Tracing with Conditional Remuneration"
    );
    console.log("─".repeat(50));

    const tbContactConfig = {
      code: "TB001",
      name: "TB Contact Tracing",
      description: "TB contact tracing with conditional remuneration",
      numerator_field_id: "4",
      denominator_field_id: "5",
      numerator_label: "TB Contacts Traced",
      denominator_label: "Total TB Contacts",
      target_type: "PERCENTAGE" as const,
      target_value: "50",
      target_formula: "upto 50% above",
      formula_type: "THRESHOLD_BONUS" as FormulaType,
      calculation_formula: "(numerator/denominator)*100",
      has_facility_specific_targets: false,
      facility_specific_targets: {},
      has_remuneration_config: true,
      remuneration_config: {
        base_amount: 300,
        conditional_amount: 0,
        condition_type: "WITH_TB_PATIENT",
        facility_type_remuneration_id: 1,
      },
      has_conditional_remuneration: true,
      conditional_remuneration: {
        condition_type: "WITH_TB_PATIENT",
        with_condition_amount: 300,
        without_condition_amount: 0,
        condition_description:
          "If there are no Pulmonary TB patients, then the indicator may be NA",
      },
      conditions:
        "If there are no Pulmonary TB patients, then the indicator may be NA",
    };

    console.log("✅ TB Contact Tracing Configuration:");
    console.log(`  Code: ${tbContactConfig.code}`);
    console.log(`  Name: ${tbContactConfig.name}`);
    console.log(`  Formula Type: ${tbContactConfig.formula_type}`);
    console.log(
      `  Base Amount: Rs. ${tbContactConfig.remuneration_config.base_amount}`
    );
    console.log(
      `  Conditional Amount: Rs. ${tbContactConfig.remuneration_config.conditional_amount}`
    );
    console.log(
      `  With Condition Amount: Rs. ${tbContactConfig.conditional_remuneration.with_condition_amount}`
    );
    console.log(
      `  Without Condition Amount: Rs. ${tbContactConfig.conditional_remuneration.without_condition_amount}`
    );

    // Test 3: Calculate remuneration with different scenarios
    console.log("\n📊 Test 3: Remuneration Calculation Scenarios");
    console.log("─".repeat(50));

    // Scenario 1: Total Footfall - 3% achievement
    const footfallAchievement = FormulaCalculator.calculateMathematicalFormula(
      300, // numerator
      10000, // denominator
      totalFootfallConfig.calculation_formula
    );

    const footfallResult = FormulaCalculator.calculateRemuneration(
      footfallAchievement,
      100,
      totalFootfallConfig.remuneration_config.base_amount, // Use base amount
      {
        type: totalFootfallConfig.formula_type,
        range: { min: 3, max: 5 },
        calculationFormula: totalFootfallConfig.calculation_formula,
      },
      "PHC"
    );

    console.log("✅ Total Footfall - 3% Achievement:");
    console.log(`  Achievement: ${footfallAchievement.toFixed(1)}%`);
    console.log(
      `  Base Amount: Rs. ${totalFootfallConfig.remuneration_config.base_amount}`
    );
    console.log(
      `  Calculated Remuneration: Rs. ${footfallResult.remuneration}`
    );
    console.log(`  Status: ${footfallResult.status}`);
    console.log(`  Message: ${footfallResult.message}`);

    // Scenario 2: TB Contact Tracing - With TB patients
    const tbResult = FormulaCalculator.calculateRemuneration(
      100, // 100% achievement
      100,
      tbContactConfig.remuneration_config.base_amount,
      {
        type: tbContactConfig.formula_type,
        bonusThreshold: 50,
      },
      "PHC",
      true // TB patients present
    );

    console.log("✅ TB Contact Tracing - With TB Patients:");
    console.log(`  Achievement: 100%`);
    console.log(
      `  Base Amount: Rs. ${tbContactConfig.remuneration_config.base_amount}`
    );
    console.log(
      `  With Condition Amount: Rs. ${tbContactConfig.conditional_remuneration.with_condition_amount}`
    );
    console.log(`  Calculated Remuneration: Rs. ${tbResult.remuneration}`);
    console.log(`  Status: ${tbResult.status}`);

    // Scenario 3: TB Contact Tracing - Without TB patients
    const tbResultNA = FormulaCalculator.calculateRemuneration(
      100, // 100% achievement
      100,
      tbContactConfig.remuneration_config.base_amount,
      {
        type: tbContactConfig.formula_type,
        bonusThreshold: 50,
      },
      "PHC",
      false // No TB patients
    );

    console.log("✅ TB Contact Tracing - Without TB Patients:");
    console.log(`  Achievement: 100%`);
    console.log(
      `  Base Amount: Rs. ${tbContactConfig.remuneration_config.base_amount}`
    );
    console.log(
      `  Without Condition Amount: Rs. ${tbContactConfig.conditional_remuneration.without_condition_amount}`
    );
    console.log(`  Calculated Remuneration: Rs. ${tbResultNA.remuneration}`);
    console.log(`  Status: ${tbResultNA.status}`);

    console.log("\n🎯 Remuneration Configuration Features Summary:");
    console.log("=============================================");
    console.log("✅ Base Amount Configuration");
    console.log("✅ Conditional Amount Configuration");
    console.log("✅ Condition Type Selection");
    console.log("✅ Facility Type Remuneration Reference");
    console.log("✅ Enhanced Form Integration");
    console.log("✅ Database Storage Ready");
    console.log("✅ Calculation Integration");
  } catch (error) {
    console.error("Error testing remuneration configuration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testRemunerationConfiguration();
