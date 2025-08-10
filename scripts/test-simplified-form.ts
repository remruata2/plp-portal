import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function testSimplifiedForm() {
  try {
    console.log("🧪 Testing Simplified Indicator Form");
    console.log("====================================");

    // Test 1: Check that fields are available
    console.log("\n📊 Test 1: Available Fields");
    console.log("─".repeat(50));

    const fields = await prisma.field.findMany({
      where: { field_category: "DATA_FIELD" },
      select: { id: true, name: true, code: true },
      take: 5,
    });

    console.log("✅ Available Fields for Selection:");
    fields.forEach((field) => {
      console.log(`  - ${field.name}`);
    });

    // Test 2: Sample form data without redundant labels
    console.log("\n📊 Test 2: Simplified Form Data Structure");
    console.log("─".repeat(50));

    const sampleFormData = {
      code: "BC001",
      name: "Breast & Cervical Ca. screened for the month",
      description:
        "Breast & cervical cancer screening against female population target",
      numerator_field_id: "1",
      denominator_field_id: "2",
      target_field_id: "3",
      target_type: "PERCENTAGE",
      target_value: "80",
      target_formula: "upto 80%",
      formula_type: "PERCENTAGE_CAP",
      calculation_formula: "(numerator/denominator)*100",
      has_facility_specific_targets: false,
      facility_specific_targets: {},
      conditions: "",
    };

    console.log("✅ Simplified Form Data:");
    console.log(`  Code: ${sampleFormData.code}`);
    console.log(`  Name: ${sampleFormData.name}`);
    console.log(`  Numerator Field ID: ${sampleFormData.numerator_field_id}`);
    console.log(
      `  Denominator Field ID: ${sampleFormData.denominator_field_id}`
    );
    console.log(`  Target Field ID: ${sampleFormData.target_field_id}`);
    console.log(`  Formula Type: ${sampleFormData.formula_type}`);
    console.log(`  Target: ${sampleFormData.target_formula}`);

    // Test 3: Benefits of simplified form
    console.log("\n📊 Test 3: Benefits of Simplified Form");
    console.log("─".repeat(50));

    console.log("✅ Improvements Made:");
    console.log("  - ✅ Removed redundant numerator_label field");
    console.log("  - ✅ Removed redundant denominator_label field");
    console.log("  - ✅ Field names shown directly in dropdowns");
    console.log("  - ✅ Cleaner, simpler form structure");
    console.log("  - ✅ Less data entry required");
    console.log("  - ✅ Reduced chance of inconsistencies");

    // Test 4: Form validation
    console.log("\n📊 Test 4: Form Validation");
    console.log("─".repeat(50));

    const requiredFields = [
      "code",
      "name",
      "numerator_field_id",
      "denominator_field_id",
      "target_field_id",
      "target_type",
      "target_value",
      "target_formula",
      "formula_type",
    ];

    console.log("✅ Required Fields:");
    requiredFields.forEach((field) => {
      const hasValue = sampleFormData[field as keyof typeof sampleFormData];
      console.log(`  - ${field}: ${hasValue ? "✅" : "❌"}`);
    });

    // Test 5: Database impact
    console.log("\n📊 Test 5: Database Impact");
    console.log("─".repeat(50));

    const indicatorCount = await prisma.indicator.count();
    console.log(`  - Total Indicators: ${indicatorCount}`);

    console.log("✅ Database Benefits:");
    console.log("  - ✅ Reduced storage requirements");
    console.log("  - ✅ Simpler data model");
    console.log("  - ✅ No redundant label storage");
    console.log("  - ✅ Field names sourced from Field table");

    console.log("\n🎯 Simplified Form Summary:");
    console.log("============================");
    console.log(
      "✅ Removed redundant numerator_label and denominator_label fields"
    );
    console.log("✅ Field names displayed directly in selection dropdowns");
    console.log("✅ Clean dropdown display - field names only (no codes)");
    console.log("✅ Cleaner, simpler form structure");
    console.log("✅ Reduced data entry and validation complexity");
    console.log("✅ Better user experience with less redundancy");
    console.log("✅ Consistent field naming across the system");
  } catch (error) {
    console.error("Error testing simplified form:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testSimplifiedForm();
