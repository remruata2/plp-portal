import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const PARENT_FACILITY_ID = 'cmehxjz27006z1fx12zjrd7zk'; // Zuangtui SC

// Helper functions
function generateVoterID(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = letters[Math.floor(Math.random() * letters.length)] + 
                 letters[Math.floor(Math.random() * letters.length)] + 
                 letters[Math.floor(Math.random() * letters.length)];
  const numbers = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${numbers}`;
}

function generatePhone(): string {
  const prefixes = ['6', '7', '8', '9'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const numbers = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  return `${prefix}${numbers}`;
}

function getRandomAge(min: number, max: number): Date {
  const today = new Date();
  const age = Math.floor(Math.random() * (max - min + 1)) + min;
  const birthYear = today.getFullYear() - age;
  const birthMonth = Math.floor(Math.random() * 12);
  const birthDay = Math.floor(Math.random() * 28) + 1;
  return new Date(birthYear, birthMonth, birthDay);
}

const FIRST_NAMES = ['Lalthanga', 'Vanlalruata', 'Lalnunmawia', 'Lalremsiami', 'Vanlalzawna', 'Lalthanpuii', 'Ramthanga', 'Lalnunfeli', 'Vanlalrema', 'Lalhmingthanga'];
const LAST_NAMES = ['Sailo', 'Pachuau', 'Ralte', 'Hnamte', 'Tochhawng', 'Fanai', 'Chawngthu', 'Renthlei', 'Hrahsel', 'Varte'];

function generateName(): string {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
}

const OCCUPATIONS = ['Farmer', 'Teacher', 'Shopkeeper', 'Driver', 'Carpenter', 'Mason', 'Tailor', 'Student', 'Homemaker', 'Government Employee'];

async function main() {
  console.log('🌱 Starting clinic and Long Roll data seeding...\n');

  // Check if parent facility exists
  const parentFacility = await prisma.facility.findUnique({
    where: { id: PARENT_FACILITY_ID },
  });

  if (!parentFacility) {
    console.error(`❌ Parent facility with ID ${PARENT_FACILITY_ID} not found!`);
    return;
  }

  console.log(`✅ Found parent facility: ${parentFacility.name}\n`);

  // Get parent facility's district and facility_type for child clinics
  const districtId = parentFacility.district_id;
  const facilityTypeId = parentFacility.facility_type_id;

  // Create 2 child clinics
  const clinics = [
    {
      name: 'Durtlang Clinic A',
      display_name: 'Durtlang Clinic A',
      has_clinic: true,
      villages: [
        { name: 'Durtlang Veng A', sections: ['Section 1', 'Section 2'] },
        { name: 'Durtlang Veng B', sections: ['Section 1'] },
      ],
    },
    {
      name: 'Durtlang Clinic B',
      display_name: 'Durtlang Clinic B',
      has_clinic: true,
      villages: [
        { name: 'Durtlang Veng C', sections: ['Section 1', 'Section 2', 'Section 3'] },
        { name: 'Durtlang Veng D', sections: ['Section 1', 'Section 2'] },
      ],
    },
  ];

  for (const clinicData of clinics) {
    console.log(`\n🏥 Creating clinic: ${clinicData.name}`);

    // Create clinic
    const clinic = await prisma.facility.create({
      data: {
        name: clinicData.name,
        display_name: clinicData.display_name,
        district_id: districtId,
        facility_type_id: facilityTypeId,
        parent_facility_id: PARENT_FACILITY_ID,
        has_clinic: clinicData.has_clinic,
        is_active: true,
      },
    });

    console.log(`  ✅ Clinic created: ${clinic.name} (${clinic.id})`);

    let clinicTotalFamilies = 0;
    let clinicTotalMembers = 0;

    // Create villages for this clinic
    for (const villageData of clinicData.villages) {
      console.log(`\n  📍 Creating village: ${villageData.name}`);

      const village = await prisma.village.create({
        data: {
          name: villageData.name,
          facility_id: clinic.id,
          is_active: true,
        },
      });

      console.log(`    ✅ Village created: ${village.name}`);

      // Create sections for this village
      for (const sectionName of villageData.sections) {
        console.log(`    📌 Creating section: ${sectionName}`);

        const section = await prisma.section.create({
          data: {
            name: sectionName,
            village_id: village.id,
            is_active: true,
          },
        });

        // Create 8-12 families per section
        const numFamilies = Math.floor(Math.random() * 5) + 8;

        for (let i = 0; i < numFamilies; i++) {
          const houseNo = `H${i + 1}`;
          const floorNo = Math.random() > 0.7 ? (Math.floor(Math.random() * 3) + 1).toString() : null;
          const noCouples = Math.floor(Math.random() * 3) + 1;
          const habitationType = Math.random() > 0.2 ? 'PERMANENT' : 'TEMPORARY';

          const family = await prisma.family.create({
            data: {
              house_no: houseNo,
              floor_no: floorNo,
              no_of_couples: noCouples,
              habitation_type: habitationType as any,
              section_id: section.id,
              is_active: true,
            },
          });

          clinicTotalFamilies++;

          // Create family members (3-7 members per family)
          const numMembers = Math.floor(Math.random() * 5) + 3;
          const relationships = ['SELF', 'WIFE', 'SON', 'DAUGHTER', 'FATHER', 'MOTHER'];

          for (let j = 0; j < numMembers; j++) {
            const relationship = j === 0 ? 'SELF' : relationships[Math.floor(Math.random() * relationships.length)];
            const sex = relationship === 'WIFE' || relationship === 'MOTHER' || relationship === 'DAUGHTER' 
              ? 'FEMALE' 
              : relationship === 'SELF' || relationship === 'FATHER' || relationship === 'SON'
              ? 'MALE'
              : Math.random() > 0.5 ? 'MALE' : 'FEMALE';

            let ageRange = { min: 20, max: 60 };
            if (relationship === 'SON' || relationship === 'DAUGHTER') {
              ageRange = { min: 0, max: 25 };
            } else if (relationship === 'FATHER' || relationship === 'MOTHER') {
              ageRange = { min: 45, max: 75 };
            }

            const dob = getRandomAge(ageRange.min, ageRange.max);
            const age = new Date().getFullYear() - dob.getFullYear();

            await prisma.family_member.create({
              data: {
                family_id: family.id,
                name: generateName(),
                relationship_with_hof: relationship as any,
                voter_id: age >= 18 ? generateVoterID() : null,
                phone: age >= 18 && Math.random() > 0.3 ? generatePhone() : null,
                sex: sex as any,
                occupation: age >= 18 && age < 65 ? OCCUPATIONS[Math.floor(Math.random() * OCCUPATIONS.length)] : null,
                abha_id: Math.random() > 0.5 ? Math.floor(Math.random() * 100000000000000).toString().padStart(14, '0') : null,
                dob,
                is_active: true,
              },
            });

            clinicTotalMembers++;
          }
        }

        console.log(`      ✅ Section ${sectionName}: ${numFamilies} families created`);
      }
    }

    console.log(`\n  📊 Clinic ${clinic.name} Summary:`);
    console.log(`     - Villages: ${clinicData.villages.length}`);
    console.log(`     - Total Families: ${clinicTotalFamilies}`);
    console.log(`     - Total Members: ${clinicTotalMembers}`);
  }

  console.log('\n✅ Seeding completed!');
  console.log('\n📊 Overall Summary:');
  console.log(`   - Clinics Created: ${clinics.length}`);
  
  // Get final counts
  const totalVillages = await prisma.village.count({
    where: {
      facility: {
        parent_facility_id: PARENT_FACILITY_ID,
      },
    },
  });

  const totalFamilies = await prisma.family.count({
    where: {
      section: {
        village: {
          facility: {
            parent_facility_id: PARENT_FACILITY_ID,
          },
        },
      },
    },
  });

  const totalMembers = await prisma.family_member.count({
    where: {
      family: {
        section: {
          village: {
            facility: {
              parent_facility_id: PARENT_FACILITY_ID,
            },
          },
        },
      },
    },
  });

  console.log(`   - Total Villages: ${totalVillages}`);
  console.log(`   - Total Families: ${totalFamilies}`);
  console.log(`   - Total Members: ${totalMembers}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
