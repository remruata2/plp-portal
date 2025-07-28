import { PrismaClient } from '../src/generated/prisma';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Function to parse the indicator list
function parseIndicatorList(content: string) {
  const indicators: { code: string; name: string; description: string; type: string; }[] = [];
  // Regex to capture code and description
  const regex = /(\S+)\s*::\s*(.*?)(?=\s+\S+\s*::|$)/g;
  
  // Replace newline characters and collapse multiple spaces to simplify parsing
  const singleLineContent = content.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ');

  let match;
  while ((match = regex.exec(singleLineContent)) !== null) {
    const code = match[1].trim();
    const description = match[2].trim();
    indicators.push({
      code,
      name: description, // Using full description as name for now
      description,
      type: 'simple',
    });
  }
  return indicators;
}

async function seedIndicators() {
  console.log('🌱 Seeding indicators from list...');

  try {
    // Read the indicator list file
    const filePath = path.join(__dirname, '../../scripts/indicators_list.md');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Parse the indicators
    const indicators = parseIndicatorList(fileContent);

    if (indicators.length === 0) {
      console.log('⚠️ No indicators found in the list. Seeding aborted.');
      return;
    }

    console.log(`🔄 Found ${indicators.length} indicators. Seeding to database...`);

    let createdCount = 0;
    let skippedCount = 0;

    for (const indicator of indicators) {
      // Check if indicator already exists by its unique code
      const existingIndicator = await prisma.indicator.findUnique({
        where: { code: indicator.code },
      });

      if (existingIndicator) {
        // Optionally, update existing indicators if needed
        // For now, we just skip them to prevent errors
        // console.log(`⏭️ Indicator with code ${indicator.code} already exists. Skipping.`);
        skippedCount++;
      } else {
        // Create new indicator
        await prisma.indicator.create({
          data: {
            code: indicator.code,
            name: indicator.name,
            description: indicator.description,
            type: indicator.type,
          },
        });
        createdCount++;
      }
    }
    
    console.log(`
✅ Seeding complete!`);
    console.log(`   - ${createdCount} indicators created.`);
    console.log(`   - ${skippedCount} indicators skipped (already existed).`);

  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.error('❌ Error: The file scripts/indicators_list.md was not found.');
    } else {
      console.error('❌ An error occurred during seeding:', error);
    }
    throw error; // Rethrow to ensure the process exits with an error code
  }
}

seedIndicators()
  .catch((e: any) => {
    console.error('❌ Error seeding indicators:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
