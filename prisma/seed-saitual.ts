import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const saitualFacilities = {
  "District Hospital": [
    {
      name: "Saitual District Hospital",
      facility_code: "474205",
      nin: "6748245542",
    },
  ],
  "Main Centre": [
    {
      name: "Saitual Main Centre",
      facility_code: null,
      nin: null,
      subCentres: [
        { name: "Buhban HWC - SC", facility_code: "235633", nin: "3617388578" },
        {
          name: "Lenchim HWC - SC",
          facility_code: "235635",
          nin: "4482846518",
        },
        { name: "Maite HWC - SC", facility_code: "235636", nin: "4562488140" },
        { name: "Sihfa HWC - SC", facility_code: "235639", nin: "7474346132" },
        {
          name: "Tualbung HWC - SC",
          facility_code: "235640",
          nin: "2736247475",
        },
        {
          name: "Keifang AHWC - SC",
          facility_code: "235634",
          nin: "8843212385",
        },
        {
          name: "Rulchawm HWC - SC",
          facility_code: "235637",
          nin: "3752678676",
        },
        {
          name: "Khanpui HWC - SC",
          facility_code: "235624",
          nin: "7377337568",
        },
        {
          name: "Hliappui AHWC - SC",
          facility_code: "235726",
          nin: "6343734452",
        },
        {
          name: "Pawlrang HWC - SC",
          facility_code: "235728",
          nin: "7454276762",
        },
        {
          name: "Saichal HWC - SC",
          facility_code: "289071",
          nin: "4358457184",
        },
        {
          name: "Saitual HWC - SC",
          facility_code: "235638",
          nin: "6264483667",
        },
      ],
    },
  ],
  "Community Health Centre (CHC)": [
    {
      name: "Ngopa CHC",
      facility_code: "235535",
      nin: "8465356866",
      subCentres: [
        {
          name: "Kawlbem HWC - SC",
          facility_code: "235749",
          nin: "8238467222",
        },
        {
          name: "Lamzawl HWC - SC",
          facility_code: "235750",
          nin: "6867238534",
        },
        { name: "Ngopa AHWC - SC", facility_code: "235751", nin: "1428328833" },
      ],
    },
  ],
  "Primary Health Centre (PHC)": [
    {
      name: "Mimbung PHC",
      facility_code: "235566",
      nin: "3343757765",
      subCentres: [
        {
          name: "Mimbung Sub-Centre",
          facility_code: "289070",
          nin: "4675682464",
        },
        {
          name: "Teikhang HWC - SC",
          facility_code: "289071",
          nin: "4358457184",
        },
      ],
    },
    {
      name: "NE Khawdungsei PHC",
      facility_code: "235567",
      nin: "3411556222",
      subCentres: [
        {
          name: "Khawkawn HWC - SC",
          facility_code: "235747",
          nin: "3754772824",
        },
        {
          name: "NE Khawdungsei Sub-Centre",
          facility_code: "235748",
          nin: "3412173118",
        },
      ],
    },
    {
      name: "Phuaibuang PHC",
      facility_code: "235629",
      nin: "7463431747",
      subCentres: [
        { name: "Daido HWC - SC", facility_code: "235627", nin: "5666132120" },
        {
          name: "Khawlian HWC - SC",
          facility_code: "235628",
          nin: "3727675740",
        },
        {
          name: "Phuaibuang Sub-Centre",
          facility_code: "235630",
          nin: "3824343754",
        },
      ],
    },
    {
      name: "Phullen PHC",
      facility_code: "323640",
      nin: "3357785678",
      subCentres: [
        {
          name: "Phullen Sub-Centre",
          facility_code: "323641",
          nin: "4164677462",
        },
        {
          name: "Thanglailung HWC - SC",
          facility_code: "323642",
          nin: "7871865270",
        },
      ],
    },
    {
      name: "Suangpuilawn PHC",
      facility_code: "235551",
      nin: "8344672624",
      subCentres: [
        {
          name: "N Khawlek HWC - SC",
          facility_code: "235649",
          nin: "2485477562",
        },
        {
          name: "Suangpuilawn Sub-Centre",
          facility_code: "235651",
          nin: "3881577278",
        },
        {
          name: "Vanbawng HWC - SC",
          facility_code: "235652",
          nin: "3418413849",
        },
      ],
    },
  ],
};

async function seedSaitualDistrictFacilities() {
  try {
    console.log("🌱 Starting to seed Saitual district facilities...");

    // Get Saitual district
    const saitual = await prisma.district.findFirst({
      where: { name: "Saitual" },
    });

    if (!saitual) {
      throw new Error(
        "Saitual district not found. Please run the main seed first."
      );
    }

    console.log("✅ Found Saitual district");

    // Get all facility types
    const facilityTypes = await prisma.facilityType.findMany();
    const facilityTypeMap = facilityTypes.reduce((acc, ft) => {
      acc[ft.name] = ft.id;
      return acc;
    }, {} as Record<string, number>);

    console.log("✅ Retrieved facility types");

    let facilitiesCreated = 0;
    let subCentresCreated = 0;
    let facilitiesSkipped = 0;
    let subCentresSkipped = 0;

    // Process each facility type
    for (const [facilityTypeName, facilities] of Object.entries(
      saitualFacilities
    )) {
      let facilityTypeId = facilityTypeMap[facilityTypeName];

      if (!facilityTypeId) {
        const coreTypeName = facilityTypeName.split('(')[0].trim();
        const existingType = await prisma.facilityType.findFirst({
          where: {
            name: {
              contains: coreTypeName,
              mode: 'insensitive',
            },
          },
        });

        if (existingType) {
          facilityTypeId = existingType.id;
          facilityTypeMap[facilityTypeName] = facilityTypeId;
        } else {
          console.log(
            `⚠️  Facility type '${facilityTypeName}' not found, creating it...`
          );
          const newType = await prisma.facilityType.create({
            data: { name: facilityTypeName },
          });
          facilityTypeId = newType.id;
          facilityTypeMap[facilityTypeName] = facilityTypeId;
        }
      }

      console.log(`\n📍 Processing ${facilityTypeName} facilities...`);

      for (const facilityData of facilities) {
        // Check if facility already exists
        const existingFacility = await prisma.facility.findFirst({
          where: {
            OR: [
              { name: facilityData.name },
              facilityData.facility_code
                ? { facility_code: facilityData.facility_code }
                : {},
            ].filter((condition) => Object.keys(condition).length > 0),
          },
        });

        let facility;
        if (existingFacility) {
          console.log(`  ⏭️  Facility already exists: ${facilityData.name}`);
          facility = existingFacility;
          facilitiesSkipped++;
        } else {
          // Create the main facility
          facility = await prisma.facility.create({
            data: {
              name: facilityData.name,
              facility_code: facilityData.facility_code,
              nin: facilityData.nin,
              district_id: saitual.id,
              facility_type_id: facilityTypeId,
            },
          });

          facilitiesCreated++;
          console.log(`  ✅ Created facility: ${facility.name}`);
        }

                // Create sub-centres if they exist
        if ("subCentres" in facilityData && facilityData.subCentres) {
          // Get Sub Centre facility type
          const subCentreType = facilityTypes.find(ft => ft.name === "Sub Centre");
          if (!subCentreType) {
            console.log("⚠️  Sub Centre facility type not found, skipping sub-centres");
            continue;
          }


          for (const subCentreData of facilityData.subCentres) {
            // Check if sub-centre already exists
            const existingSubCentre = await prisma.facility.findFirst({
              where: {
                OR: [
                  { name: subCentreData.name },
                  subCentreData.facility_code
                    ? { facility_code: subCentreData.facility_code }
                    : {},
                ].filter((condition) => Object.keys(condition).length > 0),
              },
            });

            if (existingSubCentre) {
              console.log(
                `    ⏭️  Sub-centre already exists: ${subCentreData.name}`
              );
              subCentresSkipped++;
              continue;
            }

            await prisma.facility.create({
              data: {
                name: subCentreData.name,
                facility_code: subCentreData.facility_code,
                nin: subCentreData.nin,
                district_id: saitual.id,
                facility_type_id: subCentreType.id,
              },
            });

            subCentresCreated++;
            console.log(`    ➕ Created sub-centre: ${subCentreData.name}`);
          }
        }
      }
    }

    console.log("\n🎉 Seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   • Facilities created: ${facilitiesCreated}`);
    console.log(
      `   • Facilities skipped (already exist): ${facilitiesSkipped}`
    );
    console.log(`   • Sub-centres created: ${subCentresCreated}`);
    console.log(
      `   • Sub-centres skipped (already exist): ${subCentresSkipped}`
    );
  } catch (error) {
    console.error("❌ Error seeding Saitual district facilities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedSaitualDistrictFacilities().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedSaitualDistrictFacilities;
