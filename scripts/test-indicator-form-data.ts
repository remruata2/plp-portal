import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function testIndicatorFormData() {
  console.log("🔍 Testing indicator form data...");

  try {
    // Get a sample indicator with all relationships
    const indicator = await prisma.indicator.findFirst({
      where: {
        code: "CB001", // Test with CBAC which should have (A/(B/12))*100
      },
      include: {
        numerator_field: true,
        denominator_field: true,
        target_field: true,
      },
    });

    if (!indicator) {
      console.log("❌ No indicators found");
      return;
    }

    console.log(`\n📊 Sample Indicator: ${indicator.code} - ${indicator.name}`);
    console.log(`  Numerator Field ID: ${indicator.numerator_field_id}`);
    console.log(
      `  Numerator Field: ${indicator.numerator_field?.name || "None"}`
    );
    console.log(`  Denominator Field ID: ${indicator.denominator_field_id}`);
    console.log(
      `  Denominator Field: ${indicator.denominator_field?.name || "None"}`
    );
    console.log(`  Target Field ID: ${indicator.target_field_id}`);
    console.log(`  Target Field: ${indicator.target_field?.name || "None"}`);
    console.log(`  Formula Config:`, indicator.formula_config);
    console.log(
      `  Calculation Formula: ${
        indicator.formula_config?.calculationFormula || "(A/B)*100"
      }`
    );

    // Simulate the form data preparation
    const formData = {
      code: indicator.code,
      name: indicator.name,
      description: indicator.description || "",
      numerator_field_id: indicator.numerator_field_id?.toString() || "",
      denominator_field_id: indicator.denominator_field_id?.toString() || "",
      target_field_id: indicator.target_field_id?.toString() || "",
      target_type: indicator.target_type,
      target_value: indicator.target_value || "",
      target_formula: indicator.target_formula || "",
      formula_type: indicator.formula_type,
      calculation_formula:
        indicator.formula_config?.calculationFormula || "(A/B)*100",
      has_facility_specific_targets:
        !!indicator.formula_config?.facilitySpecificTargets,
      facility_specific_targets:
        indicator.formula_config?.facilitySpecificTargets || {},
      conditions: indicator.conditions || "",
    };

    console.log(`\n📝 Form Data Prepared:`);
    console.log(`  numerator_field_id: "${formData.numerator_field_id}"`);
    console.log(`  denominator_field_id: "${formData.denominator_field_id}"`);
    console.log(`  target_field_id: "${formData.target_field_id}"`);
    console.log(`  calculation_formula: "${formData.calculation_formula}"`);

    // Check if all required fields are present
    const hasNumerator = !!formData.numerator_field_id;
    const hasDenominator = !!formData.denominator_field_id;
    const hasFormula = !!formData.calculation_formula;

    console.log(`\n✅ Validation:`);
    console.log(`  Has Numerator: ${hasNumerator}`);
    console.log(`  Has Denominator: ${hasDenominator}`);
    console.log(`  Has Formula: ${hasFormula}`);

    if (hasNumerator && hasDenominator && hasFormula) {
      console.log(`  ✅ Form should auto-populate correctly`);
    } else {
      console.log(`  ❌ Form may not auto-populate correctly`);
    }
  } catch (error) {
    console.error("❌ Error testing form data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testIndicatorFormData();
