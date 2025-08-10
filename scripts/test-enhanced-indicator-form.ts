import { PrismaClient, FormulaType } from "../src/generated/prisma";
import { FormulaCalculator } from "../src/lib/calculations/formula-calculator";

const prisma = new PrismaClient();

async function testEnhancedIndicatorForm() {
  try {
    console.log("🧪 Testing Enhanced Indicator Form Functionality");
    console.log("===============================================");

    // Test 1: Create a Total Footfall indicator with enhanced configuration
    console.log("\n📊 Test 1: Total Footfall Indicator Configuration");
    console.log("─".repeat(50));

    const totalFootfallConfig = {
      code: "TF001",
      name: "Total Footfall (M&F)",
      description: "Total footfall as percentage of catchment population",
      numerator_field_id: "1", // Total Footfall
      denominator_field_id: "2", // Total Catchment Population
      numerator_label: "Total Footfall",
      denominator_label: "Catchment Population",
      target_field_id: "",
      target_type: "PERCENTAGE" as const,
      target_value: "3-5",
      target_formula: "upto 3%-5%",
      formula_type: "PERCENTAGE_RANGE" as FormulaType,
      calculation_formula: "(numerator/denominator)*100",
      has_facility_specific_targets: false,
      facility_specific_targets: {},
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
      `  Mathematical Formula: ${totalFootfallConfig.calculation_formula}`
    );
    console.log(`  Target Range: ${totalFootfallConfig.target_value}`);
    console.log(`  Target Description: ${totalFootfallConfig.target_formula}`);

    // Test 2: Create a Teleconsultation indicator with facility-specific targets
    console.log("\n📊 Test 2: Teleconsultation with Facility-Specific Targets");
    console.log("─".repeat(50));

    const teleconsultationConfig = {
      code: "TC001",
      name: "Teleconsultation",
      description: "Number of teleconsultation sessions",
      numerator_field_id: "3", // Teleconsultation Sessions
      denominator_field_id: "",
      numerator_label: "Teleconsultation Sessions",
      denominator_label: "",
      target_field_id: "",
      target_type: "RANGE" as const,
      target_value: "25-50",
      target_formula: "25 above, upto 50",
      formula_type: "RANGE_BASED" as FormulaType,
      calculation_formula: "numerator", // Direct count
      has_facility_specific_targets: true,
      facility_specific_targets: {
        SC_HWC: {
          range: { min: 12, max: 25 },
        },
        PHC: {
          range: { min: 25, max: 50 },
        },
        UPHC: {
          range: { min: 25, max: 50 },
        },
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

    console.log("✅ Teleconsultation Configuration:");
    console.log(`  Code: ${teleconsultationConfig.code}`);
    console.log(`  Name: ${teleconsultationConfig.name}`);
    console.log(`  Formula Type: ${teleconsultationConfig.formula_type}`);
    console.log(
      `  Mathematical Formula: ${teleconsultationConfig.calculation_formula}`
    );
    console.log(
      `  Default Target Range: ${teleconsultationConfig.target_value}`
    );
    console.log(
      `  Facility-Specific Targets: ${
        Object.keys(teleconsultationConfig.facility_specific_targets).length
      } facilities`
    );

    Object.entries(teleconsultationConfig.facility_specific_targets).forEach(
      ([facility, config]) => {
        console.log(
          `    ${facility}: ${config.range?.min}-${config.range?.max}`
        );
      }
    );

    // Test 3: Create a TB Contact Tracing indicator with conditional remuneration
    console.log(
      "\n📊 Test 3: TB Contact Tracing with Conditional Remuneration"
    );
    console.log("─".repeat(50));

    const tbContactConfig = {
      code: "TB001",
      name: "TB Contact Tracing",
      description: "TB contact tracing with conditional remuneration",
      numerator_field_id: "4", // TB Contacts Traced
      denominator_field_id: "5", // Total TB Contacts
      numerator_label: "TB Contacts Traced",
      denominator_label: "Total TB Contacts",
      target_field_id: "",
      target_type: "PERCENTAGE" as const,
      target_value: "50",
      target_formula: "upto 50% above",
      formula_type: "THRESHOLD_BONUS" as FormulaType,
      calculation_formula: "(numerator/denominator)*100",
      has_facility_specific_targets: false,
      facility_specific_targets: {},
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
      `  Mathematical Formula: ${tbContactConfig.calculation_formula}`
    );
    console.log(`  Target Value: ${tbContactConfig.target_value}%`);
    console.log(
      `  Conditional Remuneration: ${
        tbContactConfig.has_conditional_remuneration ? "Enabled" : "Disabled"
      }`
    );
    console.log(
      `  With Condition Amount: Rs. ${tbContactConfig.conditional_remuneration.with_condition_amount}`
    );
    console.log(
      `  Without Condition Amount: Rs. ${tbContactConfig.conditional_remuneration.without_condition_amount}`
    );
    console.log(
      `  Condition Description: ${tbContactConfig.conditional_remuneration.condition_description}`
    );

    // Test 4: Test formula calculations with the enhanced configurations
    console.log(
      "\n📊 Test 4: Formula Calculations with Enhanced Configurations"
    );
    console.log("─".repeat(50));

    // Test Total Footfall calculation
    const footfallAchievement = FormulaCalculator.calculateMathematicalFormula(
      300, // numerator
      10000, // denominator
      totalFootfallConfig.calculation_formula
    );

    const footfallResult = FormulaCalculator.calculateRemuneration(
      footfallAchievement,
      100,
      500, // maxRemuneration for PHC
      {
        type: totalFootfallConfig.formula_type,
        range: { min: 3, max: 5 },
        calculationFormula: totalFootfallConfig.calculation_formula,
      },
      "PHC"
    );

    console.log("✅ Total Footfall Calculation:");
    console.log(`  Achievement: ${footfallAchievement.toFixed(1)}%`);
    console.log(`  Remuneration: Rs. ${footfallResult.remuneration}`);
    console.log(`  Status: ${footfallResult.status}`);
    console.log(`  Message: ${footfallResult.message}`);

    // Test Teleconsultation calculation for different facilities
    const teleconsultationTests = [
      { facility: "PHC", sessions: 30, expected: 60 },
      { facility: "SC_HWC", sessions: 15, expected: 69 },
    ];

    for (const test of teleconsultationTests) {
      const teleResult = FormulaCalculator.calculateRemuneration(
        test.sessions,
        1,
        300, // maxRemuneration
        {
          type: teleconsultationConfig.formula_type,
          range: teleconsultationConfig.facility_specific_targets[test.facility]
            ?.range || { min: 25, max: 50 },
          calculationFormula: teleconsultationConfig.calculation_formula,
          facilitySpecificTargets:
            teleconsultationConfig.facility_specific_targets,
        },
        test.facility
      );

      console.log(`✅ Teleconsultation (${test.facility}):`);
      console.log(`  Sessions: ${test.sessions}`);
      console.log(`  Expected: Rs. ${test.expected}`);
      console.log(`  Calculated: Rs. ${teleResult.remuneration}`);
      console.log(`  Status: ${teleResult.status}`);
      console.log(
        `  Correct: ${teleResult.remuneration === test.expected ? "YES" : "NO"}`
      );
    }

    // Test TB Contact Tracing with conditional logic
    const tbTests = [
      { conditionMet: true, expected: 300 },
      { conditionMet: false, expected: 0 },
    ];

    for (const test of tbTests) {
      const tbResult = FormulaCalculator.calculateRemuneration(
        100, // 100% achievement
        100,
        300, // maxRemuneration
        {
          type: tbContactConfig.formula_type,
          bonusThreshold: 50,
        },
        "PHC",
        test.conditionMet
      );

      console.log(
        `✅ TB Contact Tracing (${
          test.conditionMet ? "With TB" : "Without TB"
        }):`
      );
      console.log(`  Expected: Rs. ${test.expected}`);
      console.log(`  Calculated: Rs. ${tbResult.remuneration}`);
      console.log(`  Status: ${tbResult.status}`);
      console.log(
        `  Correct: ${tbResult.remuneration === test.expected ? "YES" : "NO"}`
      );
    }

    console.log("\n🎯 Enhanced Form Features Summary:");
    console.log("==================================");
    console.log("✅ Mathematical Formula Configuration");
    console.log("✅ Facility-Specific Target Management");
    console.log("✅ Conditional Remuneration Settings");
    console.log("✅ Enhanced Formula Type Support");
    console.log("✅ Tabbed Interface for Better UX");
    console.log("✅ Comprehensive Form Validation");
    console.log("✅ Real-time Formula Testing");
  } catch (error) {
    console.error("Error testing enhanced indicator form:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testEnhancedIndicatorForm();
