import { PrismaClient } from "../src/generated/prisma";
import { RemunerationCalculator } from "../src/lib/calculations/remuneration-calculator";

const prisma = new PrismaClient();

async function testTotalFootfallRemuneration() {
  try {
    console.log("🧮 Testing Total Footfall Remuneration Calculation");
    console.log("==================================================");

    // Test scenarios for PHC (Rs. 500 max)
    const phcScenarios = [
      {
        name: "PHC - Below 3% (No remuneration)",
        facilityType: "PHC",
        numerator: 25, // 25 footfall
        denominator: 1000, // 1000 population
        expectedAchievement: 2.5, // 2.5%
        expectedRemuneration: 0,
      },
      {
        name: "PHC - At 3% (60% remuneration)",
        facilityType: "PHC",
        numerator: 30, // 30 footfall
        denominator: 1000, // 1000 population
        expectedAchievement: 3.0, // 3%
        expectedRemuneration: 300, // 60% of Rs. 500 = Rs. 300
      },
      {
        name: "PHC - At 4% (80% remuneration)",
        facilityType: "PHC",
        numerator: 40, // 40 footfall
        denominator: 1000, // 1000 population
        expectedAchievement: 4.0, // 4%
        expectedRemuneration: 400, // 80% of Rs. 500 = Rs. 400
      },
      {
        name: "PHC - At 5% (Full remuneration)",
        facilityType: "PHC",
        numerator: 50, // 50 footfall
        denominator: 1000, // 1000 population
        expectedAchievement: 5.0, // 5%
        expectedRemuneration: 500, // 100% of Rs. 500 = Rs. 500
      },
      {
        name: "PHC - Above 5% (Full remuneration)",
        facilityType: "PHC",
        numerator: 60, // 60 footfall
        denominator: 1000, // 1000 population
        expectedAchievement: 6.0, // 6%
        expectedRemuneration: 500, // Capped at Rs. 500
      },
    ];

    // Test scenarios for UPHC (Rs. 2000 max)
    const uphcScenarios = [
      {
        name: "UPHC - At 3% (60% remuneration)",
        facilityType: "UPHC",
        numerator: 30, // 30 footfall
        denominator: 1000, // 1000 population
        expectedAchievement: 3.0, // 3%
        expectedRemuneration: 1200, // 60% of Rs. 2000 = Rs. 1200
      },
      {
        name: "UPHC - At 4% (80% remuneration)",
        facilityType: "UPHC",
        numerator: 40, // 40 footfall
        denominator: 1000, // 1000 population
        expectedAchievement: 4.0, // 4%
        expectedRemuneration: 1600, // 80% of Rs. 2000 = Rs. 1600
      },
      {
        name: "UPHC - At 5% (Full remuneration)",
        facilityType: "UPHC",
        numerator: 50, // 50 footfall
        denominator: 1000, // 1000 population
        expectedAchievement: 5.0, // 5%
        expectedRemuneration: 2000, // 100% of Rs. 2000 = Rs. 2000
      },
    ];

    const allScenarios = [...phcScenarios, ...uphcScenarios];

    for (const scenario of allScenarios) {
      console.log(`\n📊 ${scenario.name}`);
      console.log(`   Numerator: ${scenario.numerator} footfall`);
      console.log(`   Denominator: ${scenario.denominator} population`);
      console.log(`   Expected Achievement: ${scenario.expectedAchievement}%`);
      console.log(
        `   Expected Remuneration: Rs. ${scenario.expectedRemuneration}`
      );

      // Calculate actual achievement percentage
      const actualAchievement =
        (scenario.numerator / scenario.denominator) * 100;
      console.log(`   Actual Achievement: ${actualAchievement.toFixed(1)}%`);

      // Calculate remuneration using the formula
      const maxRemuneration = scenario.facilityType === "PHC" ? 500 : 2000;
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
        const achievedWithinRange = actualAchievement - range.min; // e.g., 4% - 3% = 0%
        const percentageWithinRange = (achievedWithinRange / rangeSize) * 100; // 1/2 * 100 = 50%
        
        // Convert to linear progression: 0% range = 60% remuneration, 100% range = 100% remuneration
        const linearPercentage = 60 + (percentageWithinRange * 0.4); // 60% + (50% * 0.4) = 80%
        calculatedRemuneration = (linearPercentage / 100) * maxRemuneration;
        status = "PARTIALLY_ACHIEVED";
        message = `Within range ${range.min}-${range.max}%`;
      }

      console.log(
        `   Calculated Remuneration: Rs. ${Math.round(calculatedRemuneration)}`
      );
      console.log(`   Status: ${status}`);
      console.log(`   Message: ${message}`);

      // Verify calculation
      const isCorrect =
        Math.round(calculatedRemuneration) === scenario.expectedRemuneration;
      console.log(`   ✅ Correct: ${isCorrect ? "YES" : "NO"}`);
    }

    console.log("\n🎯 Summary:");
    console.log("- Below 3%: No remuneration");
    console.log("- At 3%: 60% of remuneration (PHC: Rs. 300, UPHC: Rs. 1200)");
    console.log("- At 4%: 80% of remuneration (PHC: Rs. 400, UPHC: Rs. 1600)");
    console.log("- At 5%: 100% of remuneration (PHC: Rs. 500, UPHC: Rs. 2000)");
    console.log("- Above 5%: Capped at full remuneration");
    console.log("- PHC: Rs. 500 maximum");
    console.log("- UPHC: Rs. 2000 maximum");
  } catch (error) {
    console.error("Error testing remuneration calculation:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testTotalFootfallRemuneration();
