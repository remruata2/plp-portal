const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function fixPS001Denominator() {
  console.log("🔧 Fixing PS001 Patient Satisfaction denominator values...");

  try {
    // Get the patient_satisfaction_max field
    const maxScoreField = await prisma.field.findFirst({
      where: { code: 'patient_satisfaction_max' }
    });

    if (!maxScoreField) {
      console.log("❌ patient_satisfaction_max field not found");
      return;
    }

    console.log(`✅ Found field: ${maxScoreField.name} (ID: ${maxScoreField.id})`);

    // Get all facilities that have patient_satisfaction_score values
    const scoreValues = await prisma.fieldValue.findMany({
      where: {
        field: { code: 'patient_satisfaction_score' }
      },
      include: { facility: true }
    });

    console.log(`\n📊 Found ${scoreValues.length} facilities with satisfaction scores`);

    // Add patient_satisfaction_max = 5 for each facility that has a score
    let addedCount = 0;
    let skippedCount = 0;

    for (const scoreValue of scoreValues) {
      // Check if max value already exists
      const existingMax = await prisma.fieldValue.findFirst({
        where: {
          field_id: maxScoreField.id,
          facility_id: scoreValue.facility_id,
          report_month: scoreValue.report_month
        }
      });

      if (existingMax) {
        skippedCount++;
        continue;
      }

      // Add the max value (always 5 for satisfaction scores)
      await prisma.fieldValue.create({
        data: {
          field_id: maxScoreField.id,
          facility_id: scoreValue.facility_id,
          report_month: scoreValue.report_month,
          numeric_value: 5, // Patient satisfaction max score is always 5
          uploaded_by: scoreValue.uploaded_by
        }
      });

      console.log(`✅ Added max score (5) for ${scoreValue.facility?.name} - ${scoreValue.report_month}`);
      addedCount++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`  Added: ${addedCount} max score values`);
    console.log(`  Skipped (already exists): ${skippedCount}`);

    // Test the calculation now
    console.log(`\n🧮 Testing calculation after fix:`);
    const testScore = scoreValues[0];
    if (testScore) {
      const score = Number(testScore.numeric_value);
      const maxScore = 5;
      const percentage = (score / maxScore) * 100;
      console.log(`  Score: ${score}/5 = ${percentage}%`);
      console.log(`  This should now show correctly in the reports!`);
    }

  } catch (error) {
    console.error("❌ Error fixing PS001 denominator:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPS001Denominator();
