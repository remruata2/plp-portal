import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function testWorkerRemuneration() {
  console.log("🧪 Testing Health Workers and AYUSH Workers Remuneration...\n");

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

    // Get health workers for this facility
    const healthWorkers = await prisma.healthWorker.findMany({
      where: {
        facility_id: facility.id,
        is_active: true,
      },
    });

    console.log(
      `👥 Found ${healthWorkers.length} health workers for ${facility.name}\n`
    );

    // Simulate performance data
    const totalIndicators = 20;
    const achievedIndicators = 17; // 85% performance
    const performancePercentage = (achievedIndicators / totalIndicators) * 100;

    console.log(`📊 Performance Summary:`);
    console.log(`   Total Indicators: ${totalIndicators}`);
    console.log(`   Achieved Indicators: ${achievedIndicators}`);
    console.log(
      `   Performance Percentage: ${performancePercentage.toFixed(1)}%\n`
    );

    // Calculate worker remuneration
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

    // Display Health Workers
    console.log(`🏥 Health Workers (${healthWorkersRemuneration.length}):`);
    if (healthWorkersRemuneration.length === 0) {
      console.log("   No health workers found");
    } else {
      healthWorkersRemuneration.forEach((worker, index) => {
        console.log(`   ${index + 1}. ${worker.name}`);
        console.log(`      Allocated Amount: ₹${worker.allocated_amount}`);
        console.log(
          `      Performance: ${worker.performance_percentage.toFixed(1)}%`
        );
        console.log(
          `      Calculated Amount: ₹${worker.calculated_amount.toFixed(2)}`
        );
        console.log("");
      });
    }

    // Display AYUSH Workers
    console.log(`🧘 AYUSH Workers (${ayushWorkersRemuneration.length}):`);
    if (ayushWorkersRemuneration.length === 0) {
      console.log("   No AYUSH workers found");
    } else {
      ayushWorkersRemuneration.forEach((worker, index) => {
        console.log(`   ${index + 1}. ${worker.name}`);
        console.log(`      Allocated Amount: ₹${worker.allocated_amount}`);
        console.log(
          `      Performance: ${worker.performance_percentage.toFixed(1)}%`
        );
        console.log(
          `      Calculated Amount: ₹${worker.calculated_amount.toFixed(2)}`
        );
        console.log("");
      });
    }

    // Summary
    console.log(`💰 Remuneration Summary:`);
    console.log(`   Total Health Workers: ${healthWorkersRemuneration.length}`);
    console.log(`   Total AYUSH Workers: ${ayushWorkersRemuneration.length}`);
    console.log(
      `   Total Worker Remuneration: ₹${totalWorkerRemuneration.toFixed(2)}`
    );
    console.log(
      `   Performance Percentage: ${performancePercentage.toFixed(1)}%`
    );

    // Test with different performance scenarios
    console.log(`\n📈 Performance Scenarios:`);

    const scenarios = [
      { name: "Excellent (100%)", achieved: 20, total: 20 },
      { name: "Good (85%)", achieved: 17, total: 20 },
      { name: "Average (60%)", achieved: 12, total: 20 },
      { name: "Poor (30%)", achieved: 6, total: 20 },
    ];

    scenarios.forEach((scenario) => {
      const perfPercentage = (scenario.achieved / scenario.total) * 100;
      const sampleWorker =
        healthWorkersRemuneration[0] || ayushWorkersRemuneration[0];
      if (sampleWorker) {
        const calculatedAmount =
          (sampleWorker.allocated_amount * perfPercentage) / 100;
        console.log(
          `   ${scenario.name}: ₹${calculatedAmount.toFixed(
            2
          )} (${perfPercentage.toFixed(1)}%)`
        );
      }
    });

    console.log("\n✅ Worker remuneration test completed successfully!");
  } catch (error) {
    console.error("❌ Error testing worker remuneration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testWorkerRemuneration();
