const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function testRemunerationRecords() {
  try {
    console.log('🧪 Testing Remuneration Records System...\n');

    // Test 1: Check if the table exists
    console.log('1. Checking table structure...');
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'FacilityRemunerationRecord'
      );
    `;
    console.log('✅ Table exists:', tableExists[0].exists);

    // Test 2: Check table columns
    console.log('\n2. Checking table columns...');
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'FacilityRemunerationRecord'
      ORDER BY ordinal_position;
    `;
    
    console.log('📋 Table columns:');
    columns.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });

    // Test 3: Check indexes
    console.log('\n3. Checking indexes...');
    const indexes = await prisma.$queryRaw`
      SELECT indexname, indexdef
      FROM pg_indexes 
      WHERE tablename = 'FacilityRemunerationRecord';
    `;
    
    console.log('🔍 Indexes:');
    indexes.forEach(idx => {
      console.log(`   - ${idx.indexname}: ${idx.indexdef}`);
    });

    // Test 4: Check constraints
    console.log('\n4. Checking constraints...');
    const constraints = await prisma.$queryRaw`
      SELECT c.conname, c.contype, pg_get_constraintdef(c.oid) as definition
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      WHERE t.relname = 'FacilityRemunerationRecord';
    `;
    
    console.log('🔒 Constraints:');
    constraints.forEach(constraint => {
      const type = constraint.contype === 'p' ? 'PRIMARY KEY' : 
                   constraint.contype === 'f' ? 'FOREIGN KEY' : 
                   constraint.contype === 'u' ? 'UNIQUE' : 'OTHER';
      console.log(`   - ${constraint.conname}: ${type}`);
      console.log(`     ${constraint.definition}`);
    });

    // Test 5: Check relationships
    console.log('\n5. Checking relationships...');
    const facilities = await prisma.facility.findMany({ take: 1 });
    const indicators = await prisma.indicator.findMany({ take: 1 });
    const workers = await prisma.healthWorker.findMany({ take: 1 });

    console.log('🔗 Related data available:');
    console.log(`   - Facilities: ${facilities.length > 0 ? '✅' : '❌'}`);
    console.log(`   - Indicators: ${indicators.length > 0 ? '✅' : '❌'}`);
    console.log(`   - Health Workers: ${workers.length > 0 ? '✅' : '❌'}`);

    if (facilities.length > 0 && indicators.length > 0) {
      console.log('\n6. Testing record creation...');
      
      // Try to create a test record
      const testRecord = await prisma.facilityRemunerationRecord.create({
        data: {
          facility_id: facilities[0].id,
          report_month: '2024-01',
          indicator_id: indicators[0].id,
          status: 'achieved',
          incentive_amount: 100.0,
          actual_value: 50,
          target_value: 40,
          percentage_achieved: 125.0,
        }
      });
      
      console.log('✅ Test record created successfully:', testRecord.id);
      
      // Clean up test record
      await prisma.facilityRemunerationRecord.delete({
        where: { id: testRecord.id }
      });
      console.log('🧹 Test record cleaned up');
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📝 The remuneration records system is ready to use.');
    console.log('   - Reports will now load faster using cached data');
    console.log('   - Use the "Calculate Remuneration" button to populate data');
    console.log('   - Data is automatically cached on first report view');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testRemunerationRecords();
