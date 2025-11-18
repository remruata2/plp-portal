import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const FACILITY_ID = 'cmehxjz27006z1fx12zjrd7zk';

// Helper to generate random date
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper to generate random age-based DOB
function generateDOB(minAge: number, maxAge: number): Date {
  const today = new Date();
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  const dob = new Date(today.getFullYear() - age, 
                       Math.floor(Math.random() * 12), 
                       Math.floor(Math.random() * 28) + 1);
  return dob;
}

// Common Mizo names
const maleFirstNames = ['Lalthanga', 'Vanlalruata', 'Lalnunmawia', 'Zoramthanga', 'Lalthangliana', 'Vanlalhlana', 'Lalnunzira', 'Ramdingliana', 'Lalnunfela', 'Vanlalrema'];
const femaleFirstNames = ['Lalrinpuii', 'Vanlalruati', 'Lalnunmawii', 'Zodingliani', 'Lalthansangi', 'Vanlalhruaii', 'Lalnunziri', 'Ramdingliani', 'Lalnunfeli', 'Vanlalremi'];
const lastNames = ['Sailo', 'Pachuau', 'Ralte', 'Hnamte', 'Tochhawng', 'Chawngthu', 'Rokhum', 'Varte', 'Renthlei', 'Khiangte'];

function generateName(sex: 'MALE' | 'FEMALE'): string {
  const firstNames = sex === 'MALE' ? maleFirstNames : femaleFirstNames;
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

// Generate voter ID
function generateVoterID(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = letters[Math.floor(Math.random() * letters.length)] + 
                 letters[Math.floor(Math.random() * letters.length)] + 
                 letters[Math.floor(Math.random() * letters.length)];
  const numbers = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${numbers}`;
}

// Generate phone number
function generatePhone(): string {
  return `${Math.floor(Math.random() * 9000000000) + 1000000000}`;
}

// Occupations
const occupations = ['Farmer', 'Teacher', 'Government Employee', 'Business', 'Student', 'Homemaker', 'Driver', 'Shopkeeper', 'Carpenter', 'Mason'];

async function main() {
  console.log('🌱 Starting Long Roll data seeding...');

  // Check if facility exists
  const facility = await prisma.facility.findUnique({
    where: { id: FACILITY_ID },
  });

  if (!facility) {
    console.error(`❌ Facility with ID ${FACILITY_ID} not found!`);
    return;
  }

  console.log(`✅ Found facility: ${facility.name}`);

  // Clean up existing Long Roll data for this facility
  console.log('🧹 Cleaning up existing Long Roll data...');
  
  // Delete in correct order (due to foreign keys)
  const existingVillages = await prisma.village.findMany({
    where: { facility_id: FACILITY_ID },
    select: { id: true },
  });

  for (const village of existingVillages) {
    const sections = await prisma.section.findMany({
      where: { village_id: village.id },
      select: { id: true },
    });

    for (const section of sections) {
      const families = await prisma.family.findMany({
        where: { section_id: section.id },
        select: { id: true },
      });

      // Delete family members
      for (const family of families) {
        await prisma.family_member.deleteMany({
          where: { family_id: family.id },
        });
      }

      // Delete families
      await prisma.family.deleteMany({
        where: { section_id: section.id },
      });
    }

    // Delete sections
    await prisma.section.deleteMany({
      where: { village_id: village.id },
    });
  }

  // Delete villages
  await prisma.village.deleteMany({
    where: { facility_id: FACILITY_ID },
  });

  console.log('✅ Cleanup completed!');

  // Create 3 villages
  const villages = [
    { name: 'Durtlang North', sections: ['Section A', 'Section B', 'Section C'] },
    { name: 'Durtlang South', sections: ['Section A', 'Section B'] },
    { name: 'Durtlang East', sections: ['Section A', 'Section B', 'Section C', 'Section D'] },
  ];

  let totalFamilies = 0;
  let totalMembers = 0;

  for (const villageData of villages) {
    console.log(`\n📍 Creating village: ${villageData.name}`);
    
    const village = await prisma.village.create({
      data: {
        name: villageData.name,
        facility_id: FACILITY_ID,
        is_active: true,
      },
    });

    console.log(`  ✅ Village created: ${village.name}`);

    // Create sections for this village
    for (const sectionName of villageData.sections) {
      console.log(`  📌 Creating section: ${sectionName}`);
      
      const section = await prisma.section.create({
        data: {
          name: sectionName,
          village_id: village.id,
          is_active: true,
        },
      });

      // Create 10-15 families per section
      const familiesCount = Math.floor(Math.random() * 6) + 10; // 10-15 families
      const usedHouseNumbers = new Set<string>();
      
      for (let f = 0; f < familiesCount; f++) {
        // Generate unique house number for this section
        let houseNo: string;
        do {
          houseNo = `V${Math.floor(Math.random() * 500) + 1}`;
        } while (usedHouseNumbers.has(houseNo));
        usedHouseNumbers.add(houseNo);
        
        const floorNo = Math.random() > 0.7 ? `${Math.floor(Math.random() * 3) + 1}` : null;
        const noCouples = Math.floor(Math.random() * 3) + 1; // 1-3 couples
        const habitationType = Math.random() > 0.2 ? 'PERMANENT' : 'TEMPORARY';

        const family = await prisma.family.create({
          data: {
            section_id: section.id,
            house_no: houseNo,
            floor_no: floorNo,
            no_of_couples: noCouples,
            habitation_type: habitationType,
            is_active: true,
          },
        });

        totalFamilies++;

        // Create family members
        // 1. Head of Family (SELF)
        const hofSex: 'MALE' | 'FEMALE' = Math.random() > 0.5 ? 'MALE' : 'FEMALE';
        const hofAge = Math.floor(Math.random() * 40) + 25; // 25-65 years
        
        await prisma.family_member.create({
          data: {
            family_id: family.id,
            name: generateName(hofSex),
            relationship_with_hof: 'SELF',
            sex: hofSex,
            dob: generateDOB(hofAge, hofAge),
            voter_id: Math.random() > 0.2 ? generateVoterID() : null,
            phone: Math.random() > 0.3 ? generatePhone() : null,
            occupation: occupations[Math.floor(Math.random() * occupations.length)],
            abha_id: Math.random() > 0.5 ? `${Math.floor(Math.random() * 90000000000000) + 10000000000000}` : null,
            is_active: true,
          },
        });
        totalMembers++;

        // 2. Spouse (if HOF is married)
        if (Math.random() > 0.2) {
          const spouseSex: 'MALE' | 'FEMALE' = hofSex === 'MALE' ? 'FEMALE' : 'MALE';
          const spouseRelation = hofSex === 'MALE' ? 'WIFE' : 'HUSBAND';
          
          await prisma.family_member.create({
            data: {
              family_id: family.id,
              name: generateName(spouseSex),
              relationship_with_hof: spouseRelation,
              sex: spouseSex,
              dob: generateDOB(hofAge - 5, hofAge + 5),
              voter_id: Math.random() > 0.2 ? generateVoterID() : null,
              phone: Math.random() > 0.3 ? generatePhone() : null,
              occupation: occupations[Math.floor(Math.random() * occupations.length)],
              abha_id: Math.random() > 0.5 ? `${Math.floor(Math.random() * 90000000000000) + 10000000000000}` : null,
              is_active: true,
            },
          });
          totalMembers++;
        }

        // 3. Children (2-4 children)
        const childrenCount = Math.floor(Math.random() * 3) + 2; // 2-4 children
        for (let c = 0; c < childrenCount; c++) {
          const childSex: 'MALE' | 'FEMALE' = Math.random() > 0.5 ? 'MALE' : 'FEMALE';
          const childRelation = childSex === 'MALE' ? 'SON' : 'DAUGHTER';
          const childAge = Math.floor(Math.random() * 25); // 0-25 years
          
          await prisma.family_member.create({
            data: {
              family_id: family.id,
              name: generateName(childSex),
              relationship_with_hof: childRelation,
              sex: childSex,
              dob: generateDOB(childAge, childAge),
              voter_id: childAge >= 18 && Math.random() > 0.3 ? generateVoterID() : null,
              phone: childAge >= 15 && Math.random() > 0.4 ? generatePhone() : null,
              occupation: childAge >= 18 ? occupations[Math.floor(Math.random() * occupations.length)] : 'Student',
              abha_id: Math.random() > 0.6 ? `${Math.floor(Math.random() * 90000000000000) + 10000000000000}` : null,
              is_active: true,
            },
          });
          totalMembers++;
        }

        // 4. Sometimes add parents/grandparents (20% chance)
        if (Math.random() > 0.8) {
          const parentSex: 'MALE' | 'FEMALE' = Math.random() > 0.5 ? 'MALE' : 'FEMALE';
          const parentRelation = parentSex === 'MALE' ? 'FATHER' : 'MOTHER';
          
          await prisma.family_member.create({
            data: {
              family_id: family.id,
              name: generateName(parentSex),
              relationship_with_hof: parentRelation,
              sex: parentSex,
              dob: generateDOB(60, 80),
              voter_id: Math.random() > 0.3 ? generateVoterID() : null,
              phone: Math.random() > 0.5 ? generatePhone() : null,
              occupation: 'Retired',
              is_active: true,
            },
          });
          totalMembers++;
        }

        // 5. Sometimes add married son/daughter with spouse (15% chance)
        if (Math.random() > 0.85) {
          const marriedChildSex: 'MALE' | 'FEMALE' = Math.random() > 0.5 ? 'MALE' : 'FEMALE';
          
          // Add married child
          await prisma.family_member.create({
            data: {
              family_id: family.id,
              name: generateName(marriedChildSex),
              relationship_with_hof: marriedChildSex === 'MALE' ? 'SON' : 'DAUGHTER',
              sex: marriedChildSex,
              dob: generateDOB(25, 35),
              voter_id: Math.random() > 0.2 ? generateVoterID() : null,
              phone: Math.random() > 0.3 ? generatePhone() : null,
              occupation: occupations[Math.floor(Math.random() * occupations.length)],
              is_active: true,
            },
          });
          totalMembers++;

          // Add their spouse
          const spouseOfChildSex: 'MALE' | 'FEMALE' = marriedChildSex === 'MALE' ? 'FEMALE' : 'MALE';
          const spouseOfChildRelation = marriedChildSex === 'MALE' ? 'DAUGHTER_IN_LAW' : 'SON_IN_LAW';
          
          await prisma.family_member.create({
            data: {
              family_id: family.id,
              name: generateName(spouseOfChildSex),
              relationship_with_hof: spouseOfChildRelation,
              sex: spouseOfChildSex,
              dob: generateDOB(22, 32),
              voter_id: Math.random() > 0.2 ? generateVoterID() : null,
              phone: Math.random() > 0.3 ? generatePhone() : null,
              occupation: occupations[Math.floor(Math.random() * occupations.length)],
              is_active: true,
            },
          });
          totalMembers++;
        }
      }

      console.log(`    ✅ Section ${sectionName}: ${familiesCount} families created`);
    }
  }

  console.log('\n✅ Seeding completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Villages: ${villages.length}`);
  console.log(`   - Total Families: ${totalFamilies}`);
  console.log(`   - Total Members: ${totalMembers}`);
  console.log(`   - Avg Members per Family: ${(totalMembers / totalFamilies).toFixed(2)}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
