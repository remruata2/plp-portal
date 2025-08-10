import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function testFacilityReportsAPI() {
  console.log("🧪 Testing Facility Reports API with Worker Remuneration...\n");

  try {
    // Get a sample facility
    const facility = await prisma.facility.findFirst({
      include: { facility_type: true },
    });

    if (!facility) {
      console.log("❌ No facility found for testing");
      return;
    }

    console.log(
      `🏥 Testing with facility: ${facility.name} (${facility.facility_type.name})`
    );

    // Simulate API call to facility reports
    const reportMonth = "2025-08";

    // Get indicators for this facility
    const indicators = await prisma.indicator.findMany({
      include: {
        numerator_field: true,
        denominator_field: true,
        target_field: true,
      },
    });

    console.log(`📊 Found ${indicators.length} indicators`);

    // Get actual field IDs from the database
    const fields = await prisma.field.findMany();
    console.log(`📋 Found ${fields.length} fields in database`);

    // Simulate field values (similar to what the API does)
    const fieldValueMap = new Map();

    // Set sample values using actual field IDs from database
    fields.forEach((field, index) => {
      // Set realistic values based on field name
      if (field.name.toLowerCase().includes("footfall")) {
        fieldValueMap.set(field.id, 200); // 5% of population
      } else if (field.name.toLowerCase().includes("wellness")) {
        fieldValueMap.set(field.id, 8); // 8 sessions
      } else if (field.name.toLowerCase().includes("teleconsultation")) {
        fieldValueMap.set(field.id, 45); // 45 calls
      } else if (field.name.toLowerCase().includes("population")) {
        fieldValueMap.set(field.id, 4000); // Population
      } else {
        // For other fields, set a default value
        fieldValueMap.set(field.id, 100); // Default 100% achievement
      }
    });

    console.log(`📊 Set ${fieldValueMap.size} field values for testing`);

    // Get health workers
    const healthWorkers = await prisma.healthWorker.findMany({
      where: {
        facility_id: facility.id,
        is_active: true,
      },
    });

    console.log(`👥 Found ${healthWorkers.length} health workers`);

    // Simulate the API logic for calculating performance
    let achievedCount = 0;
    let partialCount = 0;
    let notAchievedCount = 0;
    let totalIncentive = 0;

    const performanceIndicators = [];

    for (const indicator of indicators) {
      const numeratorValue =
        fieldValueMap.get(indicator.numerator_field_id) || 0;
      
      // Get denominator value - use proper population defaults instead of fallback to 1
      let denominatorValue = fieldValueMap.get(indicator.denominator_field_id);
      
      // Special handling for PS001 (Patient Satisfaction) - use fixed scale of 5
      if (indicator.code === "PS001") {
        denominatorValue = 5; // Fixed scale for 1-5 satisfaction rating
        console.log(`🎯 PS001: Using fixed denominator value of 5 for satisfaction scale`);
      }
      // If denominator value is missing, use facility-type based population defaults
      else if (denominatorValue === undefined || denominatorValue === null) {
        const facilityTypeName = facility.facility_type.name;
        
        // Default population values by facility type (based on typical catchment sizes)
        const defaultPopulationValues: Record<string, number> = {
          'PHC': 25000,
          'SC_HWC': 3000,
          'A_HWC': 3000,
          'U_HWC': 10000,
          'UPHC': 50000,
        };
        
        // Use default based on facility type, or a reasonable fallback
        denominatorValue = defaultPopulationValues[facilityTypeName] || 5000;
        
        console.log(`⚠️ Missing denominator value for indicator ${indicator.code}, using facility-type default: ${denominatorValue} (${facilityTypeName})`);
      }

      let actualValue = numeratorValue;
      if (indicator.denominator_field_id && denominatorValue > 0) {
        actualValue = (numeratorValue / denominatorValue) * 100;
      }

      // Determine target value based on indicator code
      let targetValue = 100; // Default
      let targetDescription = "Target: 100%";

      switch (indicator.code) {
        case "TF001": // Total Footfall
          targetValue = 5;
          targetDescription = "Target: 5% of population (range: 3%-5%)";
          break;
        case "WS001": // Wellness Sessions
          targetValue = 10;
          targetDescription = "Target: 10 sessions (range: 5-10)";
          break;
        case "TC001": // Teleconsultation
          const teleconsultationTargets: Record<string, number> = {
            SC_HWC: 25,
            PHC: 50,
            UPHC: 50,
            U_HWC: 50,
            A_HWC: 50,
          };
          targetValue =
            teleconsultationTargets[facility.facility_type.name] || 50;
          targetDescription = `Target: ${targetValue} calls`;
          break;
        case "DI001": // DVDMS Issues
          const dvdmsTargets: Record<string, number> = {
            SC_HWC: 25,
            PHC: 50,
            UPHC: 50,
            U_HWC: 50,
            A_HWC: 50,
          };
          targetValue = dvdmsTargets[facility.facility_type.name] || 50;
          targetDescription = `Target: ${targetValue} issues`;
          break;
        case "PS001": // Patient Satisfaction
          targetValue = 5; // 5-point scale
          targetDescription = "Target: 5/5 satisfaction score (70%-100% range)";
          break;
        case "EC001": // Elderly Clinic
          const elderlyTargets: Record<string, number> = {
            SC_HWC: 25,
            PHC: 50,
            UPHC: 50,
            U_HWC: 50,
            A_HWC: 50,
          };
          targetValue = elderlyTargets[facility.facility_type.name] || 50;
          targetDescription = `Target: ${targetValue} clinics`;
          break;
      }

      // Calculate achievement percentage
      let achievementPercentage = 0;
      if (targetValue > 0) {
        achievementPercentage = (actualValue / targetValue) * 100;
      }

      // Debug logging for first few indicators
      if (
        indicator.code === "TF001" ||
        indicator.code === "WS001" ||
        indicator.code === "TC001"
      ) {
        console.log(
          `   ${
            indicator.code
          }: actual=${actualValue}, target=${targetValue}, achievement=${achievementPercentage.toFixed(
            1
          )}%`
        );
      }

      // Determine status
      let status: "achieved" | "partial" | "not_achieved";
      switch (indicator.code) {
        case "TF001": // Total Footfall - 3%-5% range
          if (achievementPercentage >= 5) {
            status = "achieved";
            achievedCount++;
          } else if (achievementPercentage >= 3) {
            status = "partial";
            partialCount++;
          } else {
            status = "not_achieved";
            notAchievedCount++;
          }
          break;
        default:
          if (achievementPercentage >= 100) {
            status = "achieved";
            achievedCount++;
          } else if (achievementPercentage >= 50) {
            status = "partial";
            partialCount++;
          } else {
            status = "not_achieved";
            notAchievedCount++;
          }
          break;
      }

      // Calculate incentive amount (simplified)
      const maxRemuneration = 1000; // Sample max remuneration
      let incentiveAmount = 0;

      if (status === "achieved") {
        incentiveAmount = maxRemuneration;
      } else if (status === "partial") {
        incentiveAmount = maxRemuneration * 0.5;
      }

      totalIncentive += incentiveAmount;

      performanceIndicators.push({
        id: indicator.id,
        name: indicator.name,
        target: targetValue,
        actual: actualValue,
        percentage: achievementPercentage,
        status: status,
        incentive_amount: incentiveAmount,
        formula_type: indicator.formula_type,
        target_description: targetDescription,
        indicator_code: indicator.code,
      });
    }

    // Calculate worker remuneration
    const performancePercentage = (achievedCount / indicators.length) * 100;

    const healthWorkersRemuneration = healthWorkers
      .filter((worker) => worker.worker_type === "health_worker")
      .map((worker) => ({
        id: worker.id,
        name: worker.name,
        worker_type: "health_worker",
        allocated_amount: Number(worker.allocated_amount),
        performance_percentage: performancePercentage,
        calculated_amount:
          (Number(worker.allocated_amount) * performancePercentage) / 100,
      }));

    const ayushWorkersRemuneration = healthWorkers
      .filter((worker) => worker.worker_type === "ayush_worker")
      .map((worker) => ({
        id: worker.id,
        name: worker.name,
        worker_type: "ayush_worker",
        allocated_amount: Number(worker.allocated_amount),
        performance_percentage: performancePercentage,
        calculated_amount:
          (Number(worker.allocated_amount) * performancePercentage) / 100,
      }));

    const totalWorkerRemuneration =
      healthWorkersRemuneration.reduce(
        (sum, worker) => sum + worker.calculated_amount,
        0
      ) +
      ayushWorkersRemuneration.reduce(
        (sum, worker) => sum + worker.calculated_amount,
        0
      );

    const totalRemuneration = totalIncentive + totalWorkerRemuneration;

    // Simulate API response
    const apiResponse = {
      reportMonth: reportMonth,
      totalIncentive: totalIncentive,
      totalWorkerRemuneration: totalWorkerRemuneration,
      totalRemuneration: totalRemuneration,
      performancePercentage: performancePercentage,
      indicators: performanceIndicators,
      healthWorkers: healthWorkersRemuneration,
      ayushWorkers: ayushWorkersRemuneration,
      summary: {
        totalIndicators: indicators.length,
        achievedIndicators: achievedCount,
        partialIndicators: partialCount,
        notAchievedIndicators: notAchievedCount,
        healthWorkersCount: healthWorkersRemuneration.length,
        ayushWorkersCount: ayushWorkersRemuneration.length,
      },
    };

    console.log("📊 API Response Summary:");
    console.log(`   Report Month: ${apiResponse.reportMonth}`);
    console.log(
      `   Total Incentive: ₹${apiResponse.totalIncentive.toLocaleString()}`
    );
    console.log(
      `   Total Worker Remuneration: ₹${apiResponse.totalWorkerRemuneration.toLocaleString()}`
    );
    console.log(
      `   Total Remuneration: ₹${apiResponse.totalRemuneration.toLocaleString()}`
    );
    console.log(
      `   Performance Percentage: ${apiResponse.performancePercentage.toFixed(
        1
      )}%`
    );
    console.log(`   Health Workers: ${apiResponse.healthWorkers.length}`);
    console.log(`   AYUSH Workers: ${apiResponse.ayushWorkers.length}`);

    console.log("\n🏥 Health Workers:");
    apiResponse.healthWorkers.forEach((worker, index) => {
      console.log(`   ${index + 1}. ${worker.name}`);
      console.log(
        `      Allocated: ₹${worker.allocated_amount.toLocaleString()}`
      );
      console.log(
        `      Performance: ${worker.performance_percentage.toFixed(1)}%`
      );
      console.log(
        `      Calculated: ₹${worker.calculated_amount.toLocaleString()}`
      );
    });

    console.log("\n🧘 AYUSH Workers:");
    apiResponse.ayushWorkers.forEach((worker, index) => {
      console.log(`   ${index + 1}. ${worker.name}`);
      console.log(
        `      Allocated: ₹${worker.allocated_amount.toLocaleString()}`
      );
      console.log(
        `      Performance: ${worker.performance_percentage.toFixed(1)}%`
      );
      console.log(
        `      Calculated: ₹${worker.calculated_amount.toLocaleString()}`
      );
    });

    console.log("\n✅ API test completed successfully!");
  } catch (error) {
    console.error("❌ Error testing API:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testFacilityReportsAPI();
