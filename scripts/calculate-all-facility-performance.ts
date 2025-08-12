import { PrismaClient } from "../src/generated/prisma";
import { FacilityPerformanceCalculator } from "../src/lib/services/facility-performance-calculator";

const prisma = new PrismaClient();

async function calculateAllFacilityPerformance() {
  try {
    console.log("🚀 Starting performance calculation for all facilities...");

    // Get all active facilities
    const facilities = await prisma.facility.findMany({
      where: { is_active: true },
      include: {
        facility_type: true,
        district: true,
      },
    });

    console.log(`📊 Found ${facilities.length} active facilities`);

    // Get all report months from field values
    const reportMonths = await prisma.fieldValue.findMany({
      select: { report_month: true },
      distinct: ["report_month"],
      orderBy: { report_month: "desc" },
    });

    if (reportMonths.length === 0) {
      console.log("⚠️ No report months found in field values");
      return;
    }

    console.log(`📅 Found ${reportMonths.length} report months:`, reportMonths.map(rm => rm.report_month));

    // Initialize performance calculator
    const calculator = new FacilityPerformanceCalculator();

    let totalCalculations = 0;
    let successfulCalculations = 0;
    let failedCalculations = 0;

    // Calculate performance for each facility and month combination
    for (const facility of facilities) {
      for (const reportMonth of reportMonths) {
        try {
          console.log(`\n🏥 Calculating performance for ${facility.name} (${facility.district.name}) - ${reportMonth.report_month}`);

          // Calculate performance for this facility/month
          const performanceResults = await calculator.calculateFacilityPerformance(
            facility.id,
            reportMonth.report_month
          );

          if (performanceResults.length === 0) {
            console.log(`⚠️ No performance data for ${facility.name} in ${reportMonth.report_month}`);
            continue;
          }

          // Save performance calculations to FacilityRemunerationRecord
          for (const result of performanceResults) {
            try {
              await prisma.facilityRemunerationRecord.upsert({
                where: {
                  facility_id_report_month_indicator_id: {
                    facility_id: result.facility_id,
                    report_month: result.report_month,
                    indicator_id: result.indicator_id,
                  },
                },
                update: {
                  numerator: result.numerator || undefined,
                  denominator: result.denominator || undefined,
                  achievement: result.achievement || undefined,
                  target_value: result.target_value || undefined,
                  remuneration_amount: result.remuneration_amount || undefined,
                  percentage_achieved: result.achievement || undefined,
                  status: result.achievement && result.achievement >= 100 ? "achieved" : 
                         result.achievement && result.achievement >= 50 ? "partial" : "not_achieved",
                  calculated_at: new Date(),
                },
                create: {
                  facility_id: result.facility_id,
                  indicator_id: result.indicator_id,
                  report_month: result.report_month,
                  numerator: result.numerator || undefined,
                  denominator: result.denominator || undefined,
                  achievement: result.achievement || undefined,
                  target_value: result.target_value || undefined,
                  remuneration_amount: result.remuneration_amount || undefined,
                  percentage_achieved: result.achievement || undefined,
                  status: result.achievement && result.achievement >= 100 ? "achieved" : 
                         result.achievement && result.achievement >= 50 ? "partial" : "not_achieved",
                  calculated_at: new Date(),
                },
              });
            } catch (error) {
              console.error(`❌ Error saving performance record for indicator ${result.indicator_id}:`, error);
            }
          }

          // Get performance summary
          const performanceSummary = await calculator.getPerformanceSummary(
            facility.id,
            reportMonth.report_month
          );

          // Update or create remuneration calculation record
          try {
            await prisma.remunerationCalculation.upsert({
              where: {
                facility_id_report_month: {
                  facility_id: facility.id,
                  report_month: reportMonth.report_month,
                },
              },
              update: {
                performance_percentage: performanceSummary.average_achievement || 0,
                facility_remuneration: performanceSummary.total_remuneration || 0,
                total_worker_remuneration: 0, // Will be calculated separately
                total_remuneration: performanceSummary.total_remuneration || 0,
                health_workers_count: 0, // Will be calculated separately
                asha_workers_count: 0, // Will be calculated separately
                calculated_at: new Date(),
              },
              create: {
                facility_id: facility.id,
                report_month: reportMonth.report_month,
                performance_percentage: performanceSummary.average_achievement || 0,
                facility_remuneration: performanceSummary.total_remuneration || 0,
                total_worker_remuneration: 0, // Will be calculated separately
                total_remuneration: performanceSummary.total_remuneration || 0,
                health_workers_count: 0, // Will be calculated separately
                asha_workers_count: 0, // Will be calculated separately
                calculated_at: new Date(),
              },
            });
          } catch (error) {
            console.error(`❌ Error saving remuneration calculation for ${facility.name}:`, error);
          }

          successfulCalculations++;
          console.log(`✅ Performance calculated for ${facility.name} - ${reportMonth.report_month}`);
          console.log(`   📊 Average achievement: ${performanceSummary.average_achievement?.toFixed(2)}%`);
          console.log(`   💰 Total remuneration: ₹${performanceSummary.total_remuneration?.toFixed(2)}`);

        } catch (error) {
          failedCalculations++;
          console.error(`❌ Error calculating performance for ${facility.name} - ${reportMonth.report_month}:`, error);
        }

        totalCalculations++;
      }
    }

    console.log("\n🎉 Performance calculation completed!");
    console.log(`📊 Summary:`);
    console.log(`   Total calculations attempted: ${totalCalculations}`);
    console.log(`   Successful: ${successfulCalculations}`);
    console.log(`   Failed: ${failedCalculations}`);
    console.log(`   Success rate: ${((successfulCalculations / totalCalculations) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error("❌ Error during performance calculation:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the calculation
calculateAllFacilityPerformance()
  .then(() => {
    console.log("✅ Performance calculation completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Performance calculation failed:", error);
    process.exit(1);
  });
