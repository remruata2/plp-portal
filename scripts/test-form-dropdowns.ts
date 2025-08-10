import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function testFormDropdowns() {
  console.log("🔍 Testing form dropdown data...");

  try {
    // Get fields and a sample indicator
    const fields = await prisma.field.findMany({
      orderBy: { name: "asc" },
    });

    const indicator = await prisma.indicator.findFirst({
      where: { code: "CB001" },
      include: {
        numerator_field: true,
        denominator_field: true,
        target_field: true,
      },
    });

    if (!indicator) {
      console.log("❌ No CB001 indicator found");
      return;
    }

    console.log(`\n📊 Sample Indicator: ${indicator.code} - ${indicator.name}`);
    console.log(`  Numerator Field ID: ${indicator.numerator_field_id}`);
    console.log(
      `  Numerator Field Name: ${indicator.numerator_field?.name || "None"}`
    );
    console.log(`  Denominator Field ID: ${indicator.denominator_field_id}`);
    console.log(
      `  Denominator Field Name: ${indicator.denominator_field?.name || "None"}`
    );

    // Simulate form data
    const formData = {
      numerator_field_id: indicator.numerator_field_id?.toString() || "",
      denominator_field_id: indicator.denominator_field_id?.toString() || "",
    };

    console.log(`\n📝 Form Data:`);
    console.log(`  numerator_field_id: "${formData.numerator_field_id}"`);
    console.log(`  denominator_field_id: "${formData.denominator_field_id}"`);

    // Test dropdown logic
    const numeratorField = fields.find(
      (f) => f.id.toString() === formData.numerator_field_id
    );
    const denominatorField = fields.find(
      (f) => f.id.toString() === formData.denominator_field_id
    );

    console.log(`\n🔍 Dropdown Logic Test:`);
    console.log(`  Numerator Field Found: ${numeratorField ? "✅" : "❌"}`);
    console.log(
      `  Numerator Field Name: "${numeratorField?.name || "Not Found"}"`
    );
    console.log(`  Denominator Field Found: ${denominatorField ? "✅" : "❌"}`);
    console.log(
      `  Denominator Field Name: "${denominatorField?.name || "Not Found"}"`
    );

    // Test if the fields exist in the fields array
    const numeratorExists = fields.some(
      (f) => f.id === indicator.numerator_field_id
    );
    const denominatorExists = fields.some(
      (f) => f.id === indicator.denominator_field_id
    );

    console.log(`\n✅ Field Existence Check:`);
    console.log(
      `  Numerator Field in Fields Array: ${numeratorExists ? "✅" : "❌"}`
    );
    console.log(
      `  Denominator Field in Fields Array: ${denominatorExists ? "✅" : "❌"}`
    );

    if (numeratorExists && denominatorExists) {
      console.log(`  ✅ Dropdowns should display correctly`);
    } else {
      console.log(
        `  ❌ Dropdowns may not display correctly - fields missing from array`
      );
    }

    // Show sample fields for dropdown
    console.log(`\n📋 Sample Fields for Dropdown:`);
    fields.slice(0, 5).forEach((field) => {
      console.log(`  ${field.id}: ${field.name} (${field.code})`);
    });
  } catch (error) {
    console.error("❌ Error testing dropdowns:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testFormDropdowns();
