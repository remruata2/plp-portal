import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function testWorkerAllocation() {
  console.log("🧪 Testing Worker Allocation Configuration...\n");

  try {
    // Get all worker allocation configurations
    const workerAllocations = await prisma.workerAllocationConfig.findMany({
      include: {
        facility_type: true,
      },
      where: {
        is_active: true,
      },
      orderBy: [{ facility_type: { name: "asc" } }, { worker_role: "asc" }],
    });

    console.log(
      `📊 Found ${workerAllocations.length} worker allocation configurations\n`
    );

    // Group by facility type
    const facilityTypeSummary = {};
    workerAllocations.forEach((allocation) => {
      const facilityTypeName = allocation.facility_type.name;
      if (!facilityTypeSummary[facilityTypeName]) {
        facilityTypeSummary[facilityTypeName] = [];
      }
      facilityTypeSummary[facilityTypeName].push(allocation);
    });

    // Display summary by facility type
    console.log("🏥 Worker Allocation Summary by Facility Type:");
    console.log("=".repeat(60));

    Object.entries(facilityTypeSummary).forEach(
      ([facilityType, allocations]) => {
        console.log(`\n📋 ${facilityType}:`);
        console.log("-".repeat(40));

        let totalAllocation = 0;
        allocations.forEach((allocation) => {
          console.log(
            `   ${allocation.worker_role.padEnd(
              20
            )} ₹${allocation.allocated_amount.toString().padStart(8)} (max: ${
              allocation.max_count
            })`
          );
          totalAllocation += Number(allocation.allocated_amount);
        });

        console.log(
          `   ${"TOTAL:".padEnd(20)} ₹${totalAllocation.toString().padStart(8)}`
        );
      }
    );

    // Test allocation validation
    console.log("\n🔍 Testing Allocation Validation:");
    console.log("=".repeat(40));

    Object.entries(facilityTypeSummary).forEach(
      ([facilityType, allocations]) => {
        console.log(`\n🏥 ${facilityType}:`);

        const singlePositionWorkers = allocations.filter(
          (a) => a.max_count === 1
        );
        const multiplePositionWorkers = allocations.filter(
          (a) => a.max_count > 1
        );

        if (singlePositionWorkers.length > 0) {
          console.log("   Single Position Workers:");
          singlePositionWorkers.forEach((worker) => {
            console.log(
              `     ✅ ${worker.worker_role}: 1 position, ₹${worker.allocated_amount}`
            );
          });
        }

        if (multiplePositionWorkers.length > 0) {
          console.log("   Multiple Position Workers:");
          multiplePositionWorkers.forEach((worker) => {
            console.log(
              `     ✅ ${worker.worker_role}: up to ${worker.max_count} positions, ₹${worker.allocated_amount} total`
            );
          });
        }
      }
    );

    // Test allocation amounts against requirements
    console.log("\n💰 Allocation Amount Validation:");
    console.log("=".repeat(40));

    const expectedAllocations = {
      SC_HWC: {
        HWO: 15000,
        HW: 1500,
        ASHA: 1500,
        total: 18000,
      },
      A_HWC: {
        "AYUSH MO": 15000,
        HW: 1500,
        ASHA: 1000,
        total: 17500,
      },
      PHC: {
        MO: 7500,
        "Colocated SC HW": 1500,
        ASHA: 1000,
        total: 10000,
      },
      UPHC: {
        MO: 7500,
        HW: 1500,
        ASHA: 1000,
        total: 10000,
      },
      U_HWC: {
        MO: 7500,
        HW: 1500,
        ASHA: 1000,
        total: 10000,
      },
    };

    Object.entries(expectedAllocations).forEach(([facilityType, expected]) => {
      const actualAllocations = facilityTypeSummary[facilityType] || [];
      console.log(`\n🏥 ${facilityType}:`);

      let actualTotal = 0;
      actualAllocations.forEach((allocation) => {
        const expectedAmount = expected[allocation.worker_role];
        const actualAmount = Number(allocation.allocated_amount);
        actualTotal += actualAmount;

        if (expectedAmount) {
          const status = expectedAmount === actualAmount ? "✅" : "❌";
          console.log(
            `   ${status} ${allocation.worker_role}: ₹${actualAmount} (expected: ₹${expectedAmount})`
          );
        } else {
          console.log(
            `   ⚠️  ${allocation.worker_role}: ₹${actualAmount} (not in requirements)`
          );
        }
      });

      const totalStatus = expected.total === actualTotal ? "✅" : "❌";
      console.log(
        `   ${totalStatus} TOTAL: ₹${actualTotal} (expected: ₹${expected.total})`
      );
    });

    // Test facility-specific allocations
    console.log("\n🏢 Testing Facility-Specific Allocations:");
    console.log("=".repeat(50));

    const facilities = await prisma.facility.findMany({
      include: {
        facility_type: true,
        worker_allocations: {
          include: {
            worker_allocation_config: {
              include: {
                facility_type: true,
              },
            },
          },
        },
      },
      take: 3, // Test first 3 facilities
    });

    facilities.forEach((facility) => {
      console.log(`\n🏥 ${facility.name} (${facility.facility_type.name}):`);

      if (facility.worker_allocations.length === 0) {
        console.log("   ⚠️  No worker allocations configured");
      } else {
        facility.worker_allocations.forEach((allocation) => {
          console.log(
            `   ✅ ${allocation.worker_allocation_config.worker_role}: ${allocation.worker_count} workers, ₹${allocation.total_allocated_amount}`
          );
        });
      }
    });

    console.log("\n✅ Worker allocation test completed successfully!");
  } catch (error) {
    console.error("❌ Error testing worker allocation:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testWorkerAllocation();
