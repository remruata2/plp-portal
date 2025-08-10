#!/usr/bin/env tsx

/**
 * Update target types in the database to use the new simplified system
 * 
 * This script updates the target_type field in the Indicator table to use
 * the new simplified target types:
 * - BINARY -> BINARY (no change)
 * - RANGE_BASED -> RANGE
 * - PERCENTAGE_RANGE -> PERCENTAGE_RANGE (no change)
 * 
 * The old complex types have been removed and replaced with simpler, more
 * maintainable types that still provide the same functionality.
 */

import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function updateTargetTypes() {
  try {
    console.log("🔄 Updating target types to simplified system...");
    console.log("=" .repeat(60));

    // Get all indicators
    const indicators = await prisma.indicator.findMany({
      select: {
        id: true,
        name: true,
        target_type: true,
        target_value: true,
      },
    });

    console.log(`📊 Found ${indicators.length} indicators to process`);
    console.log("");

    let updatedCount = 0;
    let noChangeCount = 0;

    for (const indicator of indicators) {
      console.log(`📝 Processing: ${indicator.name}`);
      console.log(`   Current type: ${indicator.target_type}`);
      console.log(`   Target value: ${indicator.target_value}`);

      let newTargetType = indicator.target_type;

      // Update RANGE_BASED to RANGE
      if (indicator.target_type === "RANGE_BASED") {
        newTargetType = "RANGE";
        console.log(`   → Updating RANGE_BASED → RANGE`);
      } else {
        console.log(`   → No change needed`);
        noChangeCount++;
      }

      // Update the indicator if needed
      if (newTargetType !== indicator.target_type) {
        await prisma.indicator.update({
          where: { id: indicator.id },
          data: { target_type: newTargetType },
        });
        updatedCount++;
        console.log(`   ✅ Updated to: ${newTargetType}`);
      }

      console.log("");
    }

    console.log("🎯 Update Summary:");
    console.log("=" .repeat(30));
    console.log(`📊 Total indicators: ${indicators.length}`);
    console.log(`✅ Updated: ${updatedCount}`);
    console.log(`⏭️  No change: ${noChangeCount}`);
    console.log("");

    console.log("📋 Current Target Type System:");
    console.log("1. BINARY - All-or-nothing (e.g., RI sessions)");
    console.log("2. RANGE - Linear progression within range (e.g., 5-10 sessions)");
    console.log("3. PERCENTAGE_RANGE - Linear progression within percentage range (e.g., 50%-100%)");
    console.log("");

    console.log("🎉 Target type update completed successfully!");

  } catch (error) {
    console.error("❌ Error updating target types:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateTargetTypes();
