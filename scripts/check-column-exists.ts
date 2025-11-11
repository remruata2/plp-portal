import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function checkColumnExists() {
  try {
    console.log("Checking if 'has_clinic' column exists in facility table...\n");

    // Method 1: Try to query the column directly
    try {
      const result = await prisma.$queryRaw<Array<{ exists: boolean }>>`
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'facility'
          AND column_name = 'has_clinic'
        ) as exists;
      `;
      
      const exists = result[0]?.exists || false;
      console.log(`Column 'has_clinic' exists: ${exists ? "✅ YES" : "❌ NO"}`);
      
      if (exists) {
        // Get column details
        const details = await prisma.$queryRaw<Array<{
          column_name: string;
          data_type: string;
          is_nullable: string;
          column_default: string | null;
        }>>`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'facility'
          AND column_name = 'has_clinic';
        `;
        
        if (details.length > 0) {
          console.log("\nColumn details:");
          console.log(JSON.stringify(details[0], null, 2));
        }
      }
    } catch (error: any) {
      console.error("Error checking column:", error.message);
    }

    // Method 2: Check parent_facility_id as well
    try {
      const result = await prisma.$queryRaw<Array<{ exists: boolean }>>`
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'facility'
          AND column_name = 'parent_facility_id'
        ) as exists;
      `;
      
      const exists = result[0]?.exists || false;
      console.log(`\nColumn 'parent_facility_id' exists: ${exists ? "✅ YES" : "❌ NO"}`);
    } catch (error: any) {
      console.error("Error checking parent_facility_id column:", error.message);
    }

    // Method 3: List all columns in facility table
    console.log("\n=== All columns in 'facility' table ===");
    const allColumns = await prisma.$queryRaw<Array<{
      column_name: string;
      data_type: string;
      is_nullable: string;
    }>>`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'facility'
      ORDER BY ordinal_position;
    `;
    
    console.table(allColumns);

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkColumnExists();

