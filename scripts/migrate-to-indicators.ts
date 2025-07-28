import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function migrateToIndicators() {
  console.log('🔄 Starting migration of fields and formulas to indicators...');
  
  try {
    // Step 1: Get all fields
    const fields = await prisma.field.findMany();
    console.log(`📋 Found ${fields.length} fields to migrate`);
    
    // Step 2: Get all formulas
    const formulas = await prisma.formula.findMany();
    console.log(`📊 Found ${formulas.length} formulas to migrate`);
    
    // Step 3: Migrate fields to indicators (as simple type)
    console.log('🔄 Migrating fields to indicators...');
    for (const field of fields) {
      // Create new indicator for each field
      await prisma.indicator.create({
        data: {
          name: field.name,
          description: field.description,
          type: 'simple',
          created_at: field.created_at,
          updated_at: field.updated_at
        }
      });
      console.log(`✅ Created indicator for field: ${field.name}`);
    }
    
    // Step 4: Migrate formulas to indicators (as formula type)
    console.log('🔄 Migrating formulas to indicators...');
    for (const formula of formulas) {
      // Create new indicator for each formula
      await prisma.indicator.create({
        data: {
          name: formula.name,
          description: formula.description,
          type: 'formula',
          structure: formula.structure,
          created_at: formula.created_at,
          updated_at: formula.updated_at
        }
      });
      console.log(`✅ Created indicator for formula: ${formula.name}`);
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${fields.length} fields migrated`);
    console.log(`   - ${formulas.length} formulas migrated`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${fields.length} fields migrated`);
    console.log(`   - ${formulas.length} formulas migrated`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateToIndicators();
