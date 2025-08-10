import { PrismaClient } from "../src/generated/prisma";
import { FormulaCalculator } from "../src/lib/calculations/formula-calculator";

const prisma = new PrismaClient();

async function testFacilityReportsTargets() {
  console.log("🧪 Testing Facility Reports Target Calculation...\n");

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

    // Get indicators for this facility type
    const indicators = await prisma.indicator.findMany({
      where: {
        remunerations: {
          some: {
            facility_type_remuneration: {
              facility_type_id: facility.facility_type.id,
            },
          },
        },
      },
      include: {
        remunerations: {
          where: {
            facility_type_remuneration: {
              facility_type_id: facility.facility_type.id,
            },
          },
          include: { facility_type_remuneration: true },
        },
        numerator_field: true,
        denominator_field: true,
        target_field: true,
      },
    });

    console.log(
      `📊 Found ${indicators.length} indicators for ${facility.facility_type.name}\n`
    );

    // Test target calculation for each indicator
    for (const indicator of indicators) {
      const remuneration = indicator.remunerations[0];
      if (!remuneration) continue;

      // Simulate field values based on indicator type
      const fieldValueMap = new Map();

      // Set realistic sample values based on indicator
      if (indicator.code === "TF001") {
        // Total Footfall: 150 actual vs 1000 population
        fieldValueMap.set(indicator.numerator_field_id, 150);
        fieldValueMap.set(indicator.denominator_field_id, 1000);
      } else if (indicator.code === "TC001") {
        // Teleconsultation: 30 calls vs 50 target
        fieldValueMap.set(indicator.numerator_field_id, 30);
        fieldValueMap.set(indicator.denominator_field_id, 50);
      } else if (indicator.code === "DI001") {
        // DVDMS: 40 issues vs 100 target
        fieldValueMap.set(indicator.numerator_field_id, 40);
        fieldValueMap.set(indicator.denominator_field_id, 100);
      } else if (indicator.code === "JM001") {
        // JAS: 1 meeting vs 1 target
        fieldValueMap.set(indicator.numerator_field_id, 1);
        fieldValueMap.set(indicator.denominator_field_id, 1);
      } else {
        // Default sample values
        fieldValueMap.set(indicator.numerator_field_id, 50);
        fieldValueMap.set(indicator.denominator_field_id, 100);
      }

      // Calculate target using the same logic as the API (based on indicator code)
      let targetValue = 100; // Default fallback
      let targetDescription = indicator.target_formula || "Standard target";

      const formulaConfig = (indicator.formula_config as any) || {};

      // Calculate targets based on indicator code (more reliable than formula type)
      switch (indicator.code) {
        case "TF001": // Total Footfall
          targetValue = 5; // 5% target
          targetDescription = "Target: 5% of population (range: 3%-5%)";
          break;

        case "WS001": // Wellness Sessions
          targetValue = 10; // 10 sessions
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

        case "AF001": // ANC Footfall
          targetValue = 100; // 100% of due list
          targetDescription = "Target: 100% of ANC due list";
          break;

        case "PS001": // Patient Satisfaction
          targetValue = 5; // 5-point scale
          targetDescription = "Target: 5/5 satisfaction score";
          break;

        case "EP001": // Elderly Palliative
          targetValue = 100; // 100% of bedridden patients
          targetDescription = "Target: 100% of bedridden patients";
          break;

        case "JM001": // JAS Meetings
          targetValue = 1; // 1 meeting
          targetDescription = "Target: 1 meeting";
          break;

        case "DI001": // DVDMS Issues
          const dvdmsTargets: Record<string, number> = {
            SC_HWC: 20,
            PHC: 50,
            UPHC: 100,
            U_HWC: 100,
            A_HWC: 100,
          };
          targetValue = dvdmsTargets[facility.facility_type.name] || 50;
          targetDescription = `Target: ${targetValue} issues`;
          break;

        case "EC001": // Elderly Clinic
          const clinicTargets: Record<string, number> = {
            SC_HWC: 1,
            PHC: 4,
            UPHC: 4,
            U_HWC: 4,
            A_HWC: 4,
          };
          targetValue = clinicTargets[facility.facility_type.name] || 4;
          targetDescription = `Target: ${targetValue} clinics`;
          break;

        default:
          // Fallback to formula config or target field
          if (formulaConfig.targetValue) {
            targetValue = formulaConfig.targetValue;
            targetDescription = `Target: ${formulaConfig.targetValue}`;
          } else if (indicator.target_field_id) {
            const targetFieldValue = fieldValueMap.get(
              indicator.target_field_id
            );
            if (targetFieldValue !== undefined) {
              targetValue = targetFieldValue;
              targetDescription = `Target: ${targetFieldValue}`;
            }
          }
          break;
      }

      // Calculate remuneration
      const actualValue = fieldValueMap.get(indicator.numerator_field_id) || 0;
      const denominatorValue =
        fieldValueMap.get(indicator.denominator_field_id) || 1;

      // Calculate achievement percentage based on target value
      let achievementPercentage = 0;
      if (targetValue > 0) {
        achievementPercentage = (actualValue / targetValue) * 100;
      }

      const result = FormulaCalculator.calculateRemuneration(
        actualValue,
        denominatorValue,
        parseFloat(remuneration.base_amount.toString()),
        formulaConfig,
        facility.facility_type.name,
        undefined,
        Object.fromEntries(fieldValueMap)
      );

      console.log(`📋 ${indicator.code} - ${indicator.name}`);
      console.log(`   Formula Type: ${indicator.formula_type}`);
      console.log(`   Target: ${targetValue} (${targetDescription})`);
      console.log(`   Actual: ${actualValue}`);
      console.log(`   Denominator: ${denominatorValue}`);
      console.log(`   Achievement: ${achievementPercentage.toFixed(1)}%`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Remuneration: Rs. ${result.remuneration}`);
      console.log(`   Max Remuneration: Rs. ${remuneration.base_amount}`);

      // Show expected targets for specific indicators
      if (indicator.code === "TF001") {
        console.log(`   ✅ Expected: 5% target (range: 3%-5%)`);
      } else if (indicator.code === "TC001") {
        const expectedTarget =
          facility.facility_type.name === "SC_HWC" ? 25 : 50;
        console.log(`   ✅ Expected: ${expectedTarget} calls target`);
      } else if (indicator.code === "DI001") {
        const expectedTargets: Record<string, number> = {
          SC_HWC: 20,
          PHC: 50,
          UPHC: 100,
          U_HWC: 100,
          A_HWC: 100,
        };
        const expectedTarget =
          expectedTargets[facility.facility_type.name] || 50;
        console.log(`   ✅ Expected: ${expectedTarget} issues target`);
      } else if (indicator.code === "JM001") {
        console.log(`   ✅ Expected: 1 meeting target`);
      }
      console.log("");
    }

    console.log("✅ Target calculation test completed successfully!");
  } catch (error) {
    console.error("❌ Error testing facility reports targets:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testFacilityReportsTargets();
