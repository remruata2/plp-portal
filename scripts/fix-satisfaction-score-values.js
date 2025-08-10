const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function fixSatisfactionScoreValues() {
  console.log("🔧 Checking and fixing patient satisfaction score values...");

  try {
    // Get all patient satisfaction score values
    const scoreValues = await prisma.fieldValue.findMany({
      where: {
        field: { code: 'patient_satisfaction_score' }
      },
      include: { 
        facility: true,
        field: true
      }
    });

    console.log(`\n📊 Found ${scoreValues.length} satisfaction score entries:`);
    
    for (const scoreValue of scoreValues) {
      const currentScore = Number(scoreValue.numeric_value);
      console.log(`  ${scoreValue.facility?.name}: ${currentScore}`);
      
      // If the score is > 5, it's likely entered as a percentage instead of 1-5 scale
      if (currentScore > 5) {
        console.log(`    ⚠️  Score ${currentScore} is > 5, likely entered as percentage`);
        
        // Convert percentage to 1-5 scale
        // 80% = 4/5, so score = (percentage/100) * 5
        const correctedScore = Math.round((currentScore / 100) * 5 * 10) / 10; // Round to 1 decimal place
        
        console.log(`    🔧 Converting ${currentScore}% to ${correctedScore}/5 scale`);
        
        // Update the score value
        await prisma.fieldValue.update({
          where: { id: scoreValue.id },
          data: { numeric_value: correctedScore }
        });
        
        console.log(`    ✅ Updated score to ${correctedScore}`);
      } else if (currentScore >= 1 && currentScore <= 5) {
        console.log(`    ✅ Score ${currentScore} is already in correct 1-5 range`);
      } else {
        console.log(`    ❓ Score ${currentScore} is unusual, please verify manually`);
      }
    }

    // Test the calculation after fixes
    console.log(`\n🧮 Testing calculation after fixes:`);
    const updatedScores = await prisma.fieldValue.findMany({
      where: {
        field: { code: 'patient_satisfaction_score' }
      },
      include: { facility: true }
    });

    for (const scoreValue of updatedScores) {
      const score = Number(scoreValue.numeric_value);
      const percentage = (score / 5) * 100;
      console.log(`  ${scoreValue.facility?.name}: ${score}/5 = ${percentage}%`);
      
      // Check if it meets the 70-100% target range (3.5-5.0 score)
      const status = percentage >= 70 ? "✅ Meets target" : "❌ Below target";
      console.log(`    Status: ${status} (target: 70-100%)`);
    }

  } catch (error) {
    console.error("❌ Error fixing satisfaction scores:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSatisfactionScoreValues();
