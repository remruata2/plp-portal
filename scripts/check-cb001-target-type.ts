import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function checkCB001TargetType() {
  console.log("🔍 Checking CB001's target_type in database...");
  
  try {
    const cb001 = await prisma.indicator.findFirst({
      where: { code: "CB001" },
      select: {
        id: true,
        code: true,
        name: true,
        target_type: true,
        target_value: true,
        formula_config: true,
      },
    });

    if (!cb001) {
      console.log("❌ CB001 not found!");
      return;
    }

    console.log(`📊 CB001 Details:`);
    console.log(`  ID: ${cb001.id}`);
    console.log(`  Code: ${cb001.code}`);
    console.log(`  Name: ${cb001.name}`);
    console.log(`  Target Type: ${cb001.target_type}`);
    console.log(`  Target Value: ${cb001.target_value}`);
    console.log(`  Formula Config: ${JSON.stringify(cb001.formula_config, null, 2)}`);

    // Check if target_type is "RANGE" or "PERCENTAGE_RANGE"
    if (cb001.target_type === "RANGE") {
      console.log(`\n🚨 ALERT: CB001 has target_type "RANGE" - this explains the issue!`);
      console.log(`  The API route logic returns targetValue (100) instead of denominatorValue (population)`);
    } else if (cb001.target_type === "PERCENTAGE_RANGE") {
      console.log(`\n✅ CB001 has target_type "PERCENTAGE_RANGE" - this should work correctly`);
      console.log(`  The API route should return denominatorValue (population)`);
    } else {
      console.log(`\n❓ CB001 has unexpected target_type: ${cb001.target_type}`);
    }

  } catch (error) {
    console.error("❌ Error checking CB001:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCB001TargetType();
