import { PrismaClient } from "../src/generated/prisma";
import { IndicatorBasedRemunerationCalculator } from "../src/lib/calculations/indicator-based-remuneration-calculator";

const prisma = new PrismaClient();

async function testRemunerationCalculation() {
  console.log("🔍 Testing remuneration calculation...");

  try {
    // Get a sample facility
    const facility = await prisma.facility.findFirst({
      include: {
        facility_type: true,
        district: true,
      },
    });

    if (!facility) {
      console.log("❌ No facilities found");
      return;
    }

    console.log(
      `\n📊 Testing with facility: ${facility.name} (${facility.facility_type.name})`
    );

    // Test with a sample report month
    const reportMonth = "2024-01";

    // First, let's check if there are any calculated indicators
    const monthlyHealthData = await prisma.monthlyHealthData.findMany({
      where: {
        facility_id: facility.id,
        report_month: reportMonth,
      },
      include: {
        indicator: true,
      },
    });

    console.log(
      `\n📋 Found ${monthlyHealthData.length} calculated indicators:`
    );
    monthlyHealthData.forEach((data) => {
      console.log(
        `  ${data.indicator.code}: ${data.achievement}% (target: ${data.target_value})`
      );
    });

    if (monthlyHealthData.length === 0) {
      console.log(
        "⚠️  No calculated indicators found. This is expected if no field values have been submitted."
      );
      console.log("   To test remuneration, you need to:");
      console.log("   1. Submit field values for the facility");
      console.log("   2. Run the auto-calculation");
      console.log("   3. Then test remuneration calculation");
      return;
    }

    // Test the remuneration calculation
    console.log(`\n💰 Calculating remuneration...`);
    const remuneration =
      await IndicatorBasedRemunerationCalculator.calculateFacilityRemuneration(
        facility.id,
        reportMonth
      );

    console.log(`\n📊 Remuneration Results:`);
    console.log(`  Facility: ${remuneration.facilityName}`);
    console.log(`  Type: ${remuneration.facilityType}`);
    console.log(
      `  Performance: ${remuneration.performancePercentage.toFixed(2)}%`
    );
    console.log(
      `  Total Remuneration: Rs. ${remuneration.totalRemuneration.toFixed(2)}`
    );
    console.log(
      `  Worker Remuneration: Rs. ${remuneration.totalWorkerRemuneration.toFixed(
        2
      )}`
    );

    console.log(`\n📋 Indicator Breakdown:`);
    remuneration.indicators.forEach((indicator) => {
      console.log(
        `  ${indicator.indicatorCode}: Rs. ${indicator.calculatedAmount.toFixed(
          2
        )} (${indicator.status})`
      );
    });

    console.log(`\n👥 Health Workers (${remuneration.healthWorkers.length}):`);
    remuneration.healthWorkers.forEach((worker) => {
      console.log(
        `  ${worker.name}: Rs. ${worker.calculatedAmount.toFixed(2)}`
      );
    });

    console.log(`\n👥 ASHA Workers (${remuneration.ashaWorkers.length}):`);
    remuneration.ashaWorkers.forEach((worker) => {
      console.log(
        `  ${worker.name}: Rs. ${worker.calculatedAmount.toFixed(2)}`
      );
    });

    // Test storing the calculation
    console.log(`\n💾 Storing remuneration calculation...`);
    await IndicatorBasedRemunerationCalculator.storeRemunerationCalculation(
      remuneration
    );
    console.log(`  ✅ Calculation stored successfully`);

    // Test retrieving stored calculation
    console.log(`\n📖 Retrieving stored calculation...`);
    const storedCalculation =
      await IndicatorBasedRemunerationCalculator.getStoredRemunerationCalculation(
        facility.id,
        reportMonth
      );

    if (storedCalculation) {
      console.log(`  ✅ Stored calculation retrieved successfully`);
      console.log(
        `  Total Remuneration: Rs. ${storedCalculation.totalRemuneration.toFixed(
          2
        )}`
      );
    } else {
      console.log(`  ❌ Failed to retrieve stored calculation`);
    }
  } catch (error) {
    console.error("❌ Error testing remuneration calculation:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testRemunerationCalculation();
