import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function investigateCB001Denominator() {
  console.log("🔍 Investigating CB001 denominator field issue...");

  try {
    // Get CB001 indicator details
    const cb001 = await prisma.indicator.findFirst({
      where: { code: "CB001" },
      include: {
        numerator_field: true,
        denominator_field: true,
      },
    });

    if (!cb001) {
      console.log("❌ CB001 indicator not found!");
      return;
    }

    console.log("\n📊 CB001 Indicator Details:");
    console.log(`  Code: ${cb001.code}`);
    console.log(`  Name: ${cb001.name}`);
    console.log(`  Target Type: ${cb001.target_type}`);
    console.log(`  Formula Config: ${JSON.stringify(cb001.formula_config, null, 2)}`);
    
    if (cb001.numerator_field) {
      console.log(`\n📈 Numerator Field:`);
      console.log(`  ID: ${cb001.numerator_field.id}`);
      console.log(`  Code: ${cb001.numerator_field.code}`);
      console.log(`  Name: ${cb001.numerator_field.name}`);
    }
    
    if (cb001.denominator_field) {
      console.log(`\n📉 Denominator Field:`);
      console.log(`  ID: ${cb001.denominator_field.id}`);
      console.log(`  Code: ${cb001.denominator_field.code}`);
      console.log(`  Name: ${cb001.denominator_field.name}`);
    }

    // Check if there are any field values for CB001's denominator field
    if (cb001.denominator_field) {
      console.log(`\n🔍 Checking field values for denominator field ${cb001.denominator_field.code}:`);
      
      const fieldValues = await prisma.fieldValue.findMany({
        where: {
          field_id: cb001.denominator_field.id,
        },
        include: {
          field: true,
          facility: {
            include: {
              facility_type: true,
            },
          },
        },
        take: 10, // Limit to first 10 for readability
      });

      if (fieldValues.length > 0) {
        console.log(`Found ${fieldValues.length} field values:`);
        fieldValues.forEach((fv, index) => {
          const value = fv.string_value || fv.numeric_value || fv.boolean_value;
          console.log(`  ${index + 1}. Facility: ${fv.facility.name} (${fv.facility.facility_type.name})`);
          console.log(`     Month: ${fv.report_month}`);
          console.log(`     Value: ${value}`);
        });
      } else {
        console.log("❌ No field values found for denominator field!");
      }
    }

    // Check if there are any existing reports with CB001
    console.log(`\n📋 Checking existing reports with CB001:`);
    
    const reports = await prisma.facilityReport.findMany({
      where: {
        indicators: {
          some: {
            indicator_code: "CB001",
          },
        },
      },
      include: {
        facility: {
          include: {
            facility_type: true,
          },
        },
        indicators: {
          where: {
            indicator_code: "CB001",
          },
        },
      },
      take: 5,
    });

    if (reports.length > 0) {
      console.log(`Found ${reports.length} reports with CB001:`);
      reports.forEach((report, index) => {
        console.log(`\n  Report ${index + 1}:`);
        console.log(`    Facility: ${report.facility.name} (${report.facility.facility_type.name})`);
        console.log(`    Month: ${report.report_month}`);
        report.indicators.forEach(indicator => {
          console.log(`    CB001: ${indicator.numerator_value}/${indicator.denominator_value} = ${indicator.achievement_percentage}%`);
        });
      });
    } else {
      console.log("❌ No reports found with CB001!");
    }

  } catch (error) {
    console.error("❌ Error investigating CB001:", error);
  } finally {
    await prisma.$disconnect();
  }
}

investigateCB001Denominator();
