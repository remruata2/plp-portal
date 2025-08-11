import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function checkCB001FieldIDs() {
  console.log("🔍 Checking CB001's field IDs in database...");
  
  try {
    const cb001 = await prisma.indicator.findFirst({
      where: { code: "CB001" },
      include: {
        numerator_field: true,
        denominator_field: true,
        target_field: true,
      },
    });

    if (!cb001) {
      console.log("❌ CB001 not found!");
      return;
    }

    console.log(`📊 CB001 Field Details:`);
    console.log(`  ID: ${cb001.id}`);
    console.log(`  Code: ${cb001.code}`);
    console.log(`  Name: ${cb001.name}`);
    console.log(`  Numerator Field ID: ${cb001.numerator_field_id}`);
    console.log(`  Denominator Field ID: ${cb001.denominator_field_id}`);
    console.log(`  Target Field ID: ${cb001.target_field_id}`);
    
    if (cb001.numerator_field) {
      console.log(`\n📝 Numerator Field Details:`);
      console.log(`  Field ID: ${cb001.numerator_field.id}`);
      console.log(`  Field Code: ${cb001.numerator_field.code}`);
      console.log(`  Field Name: ${cb001.numerator_field.name}`);
      console.log(`  Field Type: ${cb001.numerator_field.field_type}`);
    }
    
    if (cb001.denominator_field) {
      console.log(`\n📝 Denominator Field Details:`);
      console.log(`  Field ID: ${cb001.denominator_field.id}`);
      console.log(`  Field Code: ${cb001.denominator_field.code}`);
      console.log(`  Field Name: ${cb001.denominator_field.name}`);
      console.log(`  Field Type: ${cb001.denominator_field.field_type}`);
    }

    // Also check what fields exist in the database
    console.log(`\n🔍 Available Fields in Database:`);
    const allFields = await prisma.field.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        field_type: true,
      },
      orderBy: { id: 'asc' },
    });
    
    allFields.forEach(field => {
      console.log(`  ${field.id}: ${field.code} - ${field.name} (${field.field_type})`);
    });

  } catch (error) {
    console.error("❌ Error checking CB001 field IDs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCB001FieldIDs();
