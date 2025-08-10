import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function checkFields() {
  console.log("🔍 Checking fields in database...");

  try {
    const fields = await prisma.field.findMany({
      where: { is_active: true },
      select: {
        id: true,
        code: true,
        name: true,
        field_type: true,
        user_type: true,
        is_active: true,
      },
      orderBy: { code: "asc" },
    });

    console.log(`\n📊 Found ${fields.length} active fields:`);

    if (fields.length === 0) {
      console.log("❌ No active fields found!");
      console.log("   This is why the field mappings page might not work");
      console.log("\n💡 To fix this, you need to:");
      console.log("   1. Run the field seeding script");
      console.log("   2. Or run the complete system setup");
      return;
    }

    fields.slice(0, 10).forEach((field, index) => {
      console.log(
        `  ${index + 1}. ID: ${field.id}, Code: "${field.code}", Name: "${
          field.name
        }", Type: "${field.field_type}"`
      );
    });

    if (fields.length > 10) {
      console.log(`  ... and ${fields.length - 10} more fields`);
    }

    // Test the API endpoint
    console.log(`\n🌐 Testing API endpoint...`);
    const response = await fetch(
      "http://localhost:3002/api/admin/health-fields"
    );

    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ API returned ${data.length} fields`);
    } else {
      console.log(`  ❌ API returned status: ${response.status}`);
      const error = await response.text();
      console.log(`  Error: ${error}`);
    }
  } catch (error) {
    console.error("❌ Error checking fields:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFields();
