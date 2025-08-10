import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function testAllFacilityTypesTotalFootfall() {
  try {
    console.log("🧮 Testing Total Footfall Remuneration for All Facility Types");
    console.log("=============================================================");

    // Test scenarios for all facility types
    const testScenarios = [
      {
        name: "PHC - Below 3% (No remuneration)",
        facilityType: "PHC",
        numerator: 25,
        denominator: 1000,
        expectedRemuneration: 0,
      },
      {
        name: "PHC - At 3% (60% remuneration)",
        facilityType: "PHC",
        numerator: 30,
        denominator: 1000,
        expectedRemuneration: 300, // 60% of Rs. 500
      },
      {
        name: "PHC - At 4% (80% remuneration)",
        facilityType: "PHC",
        numerator: 40,
        denominator: 1000,
        expectedRemuneration: 400, // 80% of Rs. 500
      },
      {
        name: "PHC - At 5% (Full remuneration)",
        facilityType: "PHC",
        numerator: 50,
        denominator: 1000,
        expectedRemuneration: 500, // 100% of Rs. 500
      },
      {
        name: "UPHC - At 3% (60% remuneration)",
        facilityType: "UPHC",
        numerator: 30,
        denominator: 1000,
        expectedRemuneration: 1200, // 60% of Rs. 2000
      },
      {
        name: "UPHC - At 4% (80% remuneration)",
        facilityType: "UPHC",
        numerator: 40,
        denominator: 1000,
        expectedRemuneration: 1600, // 80% of Rs. 2000
      },
      {
        name: "UPHC - At 5% (Full remuneration)",
        facilityType: "UPHC",
        numerator: 50,
        denominator: 1000,
        expectedRemuneration: 2000, // 100% of Rs. 2000
      },
      {
        name: "SC_HWC - At 3% (60% remuneration)",
        facilityType: "SC_HWC",
        numerator: 30,
        denominator: 1000,
        expectedRemuneration: 600, // 60% of Rs. 1000
      },
      {
        name: "SC_HWC - At 4% (80% remuneration)",
        facilityType: "SC_HWC",
        numerator: 40,
        denominator: 1000,
        expectedRemuneration: 800, // 80% of Rs. 1000
      },
      {
        name: "SC_HWC - At 5% (Full remuneration)",
        facilityType: "SC_HWC",
        numerator: 50,
        denominator: 1000,
        expectedRemuneration: 1000, // 100% of Rs. 1000
      },
      {
        name: "U_HWC - At 3% (60% remuneration)",
        facilityType: "U_HWC",
        numerator: 30,
        denominator: 1000,
        expectedRemuneration: 1200, // 60% of Rs. 2000
      },
      {
        name: "U_HWC - At 4% (80% remuneration)",
        facilityType: "U_HWC",
        numerator: 40,
        denominator: 1000,
        expectedRemuneration: 1600, // 80% of Rs. 2000
      },
      {
        name: "U_HWC - At 5% (Full remuneration)",
        facilityType: "U_HWC",
        numerator: 50,
        denominator: 1000,
        expectedRemuneration: 2000, // 100% of Rs. 2000
      },
      {
        name: "A_HWC - At 3% (60% remuneration)",
        facilityType: "A_HWC",
        numerator: 30,
        denominator: 1000,
        expectedRemuneration: 600, // 60% of Rs. 1000
      },
      {
        name: "A_HWC - At 4% (80% remuneration)",
        facilityType: "A_HWC",
        numerator: 40,
        denominator: 1000,
        expectedRemuneration: 800, // 80% of Rs. 1000
      },
      {
        name: "A_HWC - At 5% (Full remuneration)",
        facilityType: "A_HWC",
        numerator: 50,
        denominator: 1000,
        expectedRemuneration: 1000, // 100% of Rs. 1000
      },
    ];

    // Facility type remuneration amounts
    const facilityAmounts = {
      PHC: 500,
      UPHC: 2000,
      SC_HWC: 1000,
      U_HWC: 2000,
      A_HWC: 1000,
    };

    for (const scenario of testScenarios) {
      console.log(`\n📊 ${scenario.name}`);
      console.log(`   Numerator: ${scenario.numerator} footfall`);
      console.log(`   Denominator: ${scenario.denominator} population`);

      // Calculate actual achievement percentage
      const actualAchievement = (scenario.numerator / scenario.denominator) * 100;
      console.log(`   Actual Achievement: ${actualAchievement.toFixed(1)}%`);

      // Get max remuneration for this facility type
      const maxRemuneration = facilityAmounts[scenario.facilityType as keyof typeof facilityAmounts];
      console.log(`   Max Remuneration: Rs. ${maxRemuneration}`);

      // Calculate remuneration using the formula
      const range = { min: 3, max: 5 };
      
      let calculatedRemuneration = 0;
      let status = "BELOW_TARGET";
      let message = "";

      if (actualAchievement < range.min) {
        calculatedRemuneration = 0;
        status = "BELOW_TARGET";
        message = `Below minimum threshold of ${range.min}%`;
      } else if (actualAchievement >= range.max) {
        calculatedRemuneration = maxRemuneration;
        status = "ACHIEVED";
        message = `At or above maximum threshold of ${range.max}%`;
      } else {
        // Linear progression calculation within range
        const rangeSize = range.max - range.min; // 5 - 3 = 2
        const achievedWithinRange = actualAchievement - range.min; // e.g., 4% - 3% = 1%
        const percentageWithinRange = (achievedWithinRange / rangeSize) * 100; // 1/2 * 100 = 50%
        
        // Convert to linear progression: 0% range = 60% remuneration, 100% range = 100% remuneration
        const linearPercentage = 60 + percentageWithinRange * 0.4; // 60% + (50% * 0.4) = 80%
        calculatedRemuneration = (linearPercentage / 100) * maxRemuneration;
        status = "PARTIALLY_ACHIEVED";
        message = `Within range ${range.min}-${range.max}%`;
      }

      console.log(`   Calculated Remuneration: Rs. ${Math.round(calculatedRemuneration)}`);
      console.log(`   Status: ${status}`);
      console.log(`   Message: ${message}`);

      // Verify calculation
      const isCorrect = Math.round(calculatedRemuneration) === scenario.expectedRemuneration;
      console.log(`   ✅ Correct: ${isCorrect ? "YES" : "NO"}`);
    }

    console.log("\n🎯 Summary by Facility Type:");
    console.log("=============================");
    console.log("- Below 3%: No remuneration for all facility types");
    console.log("- At 3%: 60% of remuneration");
    console.log("- At 4%: 80% of remuneration");
    console.log("- At 5%: 100% of remuneration");
    console.log("- Above 5%: Capped at full remuneration");
    console.log("\nMaximum amounts per facility type:");
    Object.entries(facilityAmounts).forEach(([facilityType, amount]) => {
      console.log(`- ${facilityType}: Rs. ${amount}`);
    });

  } catch (error) {
    console.error("Error testing remuneration calculation:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAllFacilityTypesTotalFootfall(); 