import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function testCB001FieldLookup() {
  console.log("🧪 Testing CB001 field value lookup logic for PHC facilities...");
  
  try {
    const month = "2025-08";
    
    // First, let's find CB001 indicator and see which facility types it's configured for
    const cb001Indicator = await prisma.indicator.findFirst({
      where: { code: "CB001" },
      include: {
        remunerations: {
          include: {
            facility_type_remuneration: {
              include: {
                facility_type: true,
              },
            },
          },
        },
        numerator_field: true,
        denominator_field: true,
        target_field: true,
      },
    });

    if (!cb001Indicator) {
      console.log("❌ CB001 indicator not found!");
      return;
    }

    console.log(`🔍 CB001 Indicator Details:`);
    console.log(`  ID: ${cb001Indicator.id}`);
    console.log(`  Name: ${cb001Indicator.name}`);
    console.log(`  Formula: ${(cb001Indicator.formula_config as any)?.calculationFormula || "Not set"}`);
    console.log(`  Numerator Field: ${cb001Indicator.numerator_field?.name} (ID: ${cb001Indicator.numerator_field_id})`);
    console.log(`  Denominator Field: ${cb001Indicator.denominator_field?.name} (ID: ${cb001Indicator.denominator_field_id})`);
    console.log(`  Target Field: ${cb001Indicator.target_field?.name} (ID: ${cb001Indicator.target_field_id})`);

    console.log(`\n📋 CB001 is configured for these facility types:`);
    cb001Indicator.remunerations.forEach(rem => {
      const facilityType = rem.facility_type_remuneration.facility_type;
      console.log(`  - ${facilityType.name} (ID: ${facilityType.id})`);
    });

    // Now let's find a PHC facility that has CB001 configured
    const phcFacilityType = cb001Indicator.remunerations.find(rem => 
      rem.facility_type_remuneration.facility_type.name.toLowerCase().includes('phc') &&
      !rem.facility_type_remuneration.facility_type.name.toLowerCase().includes('uphc')
    );

    if (!phcFacilityType) {
      console.log("❌ No PHC facility type found with CB001 configured!");
      return;
    }

    const phcType = phcFacilityType.facility_type_remuneration.facility_type;
    console.log(`\n🏥 Looking for PHC facility of type: ${phcType.name} (ID: ${phcType.id})`);

    // Find a PHC facility with field values for this month
    const phcFacility = await prisma.facility.findFirst({
      where: {
        facility_type_id: phcType.id,
        field_values: {
          some: {
            report_month: month,
          },
        },
      },
      include: { 
        facility_type: true,
        field_values: {
          where: { report_month: month },
          include: { field: true },
        },
      },
    });

    if (!phcFacility) {
      console.log(`❌ No PHC facility found with field values for month ${month}!`);
      return;
    }

    console.log(`✅ Found PHC facility: ${phcFacility.name} (${phcFacility.facility_type.name}) - ID: ${phcFacility.id}`);
    console.log(`📊 Facility has ${phcFacility.field_values.length} field values for ${month}`);

    // Now simulate the API route logic
    console.log(`\n🔄 Simulating API route logic for CB001...`);

    // Create fieldValueMap like in the API route
    const fieldValueMap = new Map();
    phcFacility.field_values.forEach(fv => {
      const value = fv.string_value || fv.numeric_value || fv.boolean_value;
      fieldValueMap.set(fv.field_id, value);
      console.log(`  Field ${fv.field.name} (${fv.field_id}): ${value}`);
    });

    // Get CB001 indicator for this facility type
    const cb001ForPhc = cb001Indicator.remunerations.find(rem => 
      rem.facility_type_remuneration.facility_type_id === phcType.id
    );

    if (!cb001ForPhc) {
      console.log("❌ CB001 not configured for this PHC facility type!");
      return;
    }

    // Simulate the calculation logic
    const actualValue = fieldValueMap.get(cb001Indicator.numerator_field_id) || 0;
    let denominatorValue = fieldValueMap.get(cb001Indicator.denominator_field_id);

    console.log(`\n🧮 CB001 Calculation Simulation:`);
    console.log(`  Numerator Field ID: ${cb001Indicator.numerator_field_id}`);
    console.log(`  Denominator Field ID: ${cb001Indicator.denominator_field_id}`);
    console.log(`  Actual Value (A): ${actualValue}`);
    console.log(`  Denominator Value (B): ${denominatorValue}`);

    if (denominatorValue === undefined || denominatorValue === null) {
      console.log(`  ⚠️  Denominator value is ${denominatorValue}, will use fallback logic`);
      
      // Simulate the fallback logic from the API route
      if (phcType.name.toLowerCase().includes('phc') && !phcType.name.toLowerCase().includes('uphc')) {
        denominatorValue = 25000; // PHC default population
        console.log(`  🔄 Using PHC default population: ${denominatorValue}`);
      } else if (phcType.name.toLowerCase().includes('sc')) {
        denominatorValue = 5000; // SC default population
        console.log(`  🔄 Using SC default population: ${denominatorValue}`);
      } else if (phcType.name.toLowerCase().includes('uphc')) {
        denominatorValue = 50000; // UPHC default population
        console.log(`  🔄 Using UPHC default population: ${denominatorValue}`);
      } else {
        denominatorValue = 1; // General fallback
        console.log(`  🔄 Using general fallback: ${denominatorValue}`);
      }
    }

    // Calculate percentage
    const formula = (cb001Indicator.formula_config as any)?.calculationFormula || "(A/B)*100";
    let percentage: number;

    if (formula === "(A/(B/12))*100") {
      percentage = (actualValue / (denominatorValue / 12)) * 100;
      console.log(`  📐 Using population-based formula: (${actualValue}/(${denominatorValue}/12))*100 = ${percentage.toFixed(2)}%`);
    } else if (formula === "(A/(B/60))*100") {
      percentage = (actualValue / (denominatorValue / 60)) * 100;
      console.log(`  📐 Using population-based formula: (${actualValue}/(${denominatorValue}/60))*100 = ${percentage.toFixed(2)}%`);
    } else {
      percentage = (actualValue / denominatorValue) * 100;
      console.log(`  📐 Using standard formula: (${actualValue}/${denominatorValue})*100 = ${percentage.toFixed(2)}%`);
    }

    console.log(`\n🎯 Final Result:`);
    console.log(`  Formula: ${formula}`);
    console.log(`  Numerator: ${actualValue}`);
    console.log(`  Denominator: ${denominatorValue}`);
    console.log(`  Percentage: ${percentage.toFixed(2)}%`);

    // Check if this matches what we're seeing in the UI (denominator = 100)
    if (denominatorValue === 100) {
      console.log(`\n🚨 ALERT: Denominator is 100! This matches the UI issue.`);
      console.log(`  The problem might be in the API route's fallback logic or data transformation.`);
    } else {
      console.log(`\n✅ Denominator is ${denominatorValue}, which is correct.`);
      console.log(`  The issue might be elsewhere in the data flow.`);
    }

  } catch (error) {
    console.error("❌ Error testing CB001 field lookup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testCB001FieldLookup();
