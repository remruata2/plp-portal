import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const indicators = await prisma.indicator.count();
    const fields = await prisma.field.count();
    const facilities = await prisma.facility.count();
    const facilityTypes = await prisma.facility_type.count();
    const districts = await prisma.district.count();
    
    console.log('📊 Database Summary:');
    console.log(`   • Indicators: ${indicators}`);
    console.log(`   • Fields: ${fields}`);
    console.log(`   • Facilities: ${facilities}`);
    console.log(`   • Facility Types: ${facilityTypes}`);
    console.log(`   • Districts: ${districts}`);
    
    // Check some sample data
    const sampleIndicator = await prisma.indicator.findFirst();
    const sampleField = await prisma.field.findFirst();
    const sampleFacility = await prisma.facility.findFirst();
    
    if (sampleIndicator) {
      console.log('\n📋 Sample Indicator:');
      console.log(`   • Code: ${sampleIndicator.code}`);
      console.log(`   • Name: ${sampleIndicator.name}`);
      console.log(`   • Target Type: ${sampleIndicator.target_type}`);
    }
    
    if (sampleField) {
      console.log('\n📋 Sample Field:');
      console.log(`   • Code: ${sampleField.code}`);
      console.log(`   • Name: ${sampleField.name}`);
      console.log(`   • Type: ${sampleField.field_type}`);
    }
    
    if (sampleFacility) {
      console.log('\n📋 Sample Facility:');
      console.log(`   • Name: ${sampleFacility.name}`);
      console.log(`   • Type: ${sampleFacility.facility_type_id}`);
      console.log(`   • District: ${sampleFacility.district_id}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
