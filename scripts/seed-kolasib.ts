import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const kolasibFacilities = {
  "District Hospital": [
    {
      name: "Kolasib District Hospital",
      facility_code: "235543",
      nin: "5824628670",
    },
  ],
  "Private Hospital": [
    {
      name: "Nazareth Nursing Home",
      facility_code: null,
      nin: null, // "Notmapped"
    },
  ],
  "Urban Primary Health Centre": [
    {
      name: "Vengthar Urban Primary Health Centre (UPHC)",
      facility_code: "2075635",
      nin: null, // "????"
    },
  ],
  "Main Centre": [
    {
      name: "Kolasib Main Centre",
      facility_code: null,
      nin: null,
      subCentres: [
        {
          name: "Buhchangphai HWC - SC",
          facility_code: "235771",
          nin: "8722473330",
        },
        {
          name: "Diakkawn HWC - SC",
          facility_code: "235772",
          nin: "1557511670",
        },
        {
          name: "New Builum HWC - SC",
          facility_code: "235774",
          nin: "7684371540",
        },
        {
          name: "Thingdawl AHWC - SC",
          facility_code: "235775",
          nin: "4718855432",
        },
        {
          name: "Tuitha Veng HWC - SC",
          facility_code: "235776",
          nin: "4174747651",
        },
        { name: "Tumpui HWC - SC", facility_code: "235777", nin: "6151515779" },
        {
          name: "Phaisen HWC - SC",
          facility_code: "235784",
          nin: "2115728210",
        },
        {
          name: "Hmarveng Sub-Centre",
          facility_code: "2031371",
          nin: "6123868744",
        },
        {
          name: "Venglai HWC - SC",
          facility_code: "2031370",
          nin: "1135122776",
        },
        {
          name: "Venglai East Urban Primary Health Centre (UPHC)",
          facility_code: "2076377",
          nin: null,
        }, // "Notmapped"
      ],
    },
  ],
  "Community Health Centre": [
    {
      name: "Vairengte CHC",
      facility_code: "235536",
      nin: "5285858675",
      subCentres: [
        {
          name: "Vairengte HWC - SC",
          facility_code: "235785",
          nin: "8248417266",
        },
        {
          name: "Phainuam HWC - SC",
          facility_code: "235783",
          nin: "3543386373",
        },
      ],
    },
  ],
  "Primary Health Centre": [
    {
      name: "Bairabi PHC",
      facility_code: "235570",
      nin: "7285383720",
      subCentres: [
        {
          name: "Bairabi Sub-Centre",
          facility_code: "235757",
          nin: "5457867363",
        },
        {
          name: "Pangbalkawn HWC - SC",
          facility_code: "235773",
          nin: "2746831862",
        },
      ],
    },
    {
      name: "Bilkhawthlir PHC",
      facility_code: "235571",
      nin: "1187758477",
      subCentres: [
        {
          name: "Bilkhawthlir Sub-Centre",
          facility_code: "235761",
          nin: "4132876774",
        },
        {
          name: "N Chawnpui HWC - SC",
          facility_code: "235762",
          nin: "6677424332",
        },
        {
          name: "Saiphai HWC - SC",
          facility_code: "235763",
          nin: "3585585486",
        },
        { name: "Saipum HWC - SC", facility_code: "235764", nin: "4172211353" },
      ],
    },
    {
      name: "Bukpui PHC",
      facility_code: "235572",
      nin: "8388117726",
      subCentres: [
        {
          name: "Bukpui Sub-Centre",
          facility_code: "235768",
          nin: "5856574743",
        },
        {
          name: "N Hlimen HWC - SC",
          facility_code: "235767",
          nin: "6183373866",
        },
        {
          name: "N Chaltlang HWC - SC",
          facility_code: "235766",
          nin: "3464643364",
        },
      ],
    },
    {
      name: "Kawnpui PHC",
      facility_code: "235573",
      nin: "5873872237",
      subCentres: [
        {
          name: "Kawnpui Sub-Centre",
          facility_code: "235770",
          nin: "1112641640",
        },
        {
          name: "Bualpui HWC - SC",
          facility_code: "235768",
          nin: "5856574743",
        },
        {
          name: "Hortoki HWC - SC",
          facility_code: "235769",
          nin: "3745642441",
        },
      ],
    },
    {
      name: "Lungdai PHC",
      facility_code: "235574",
      nin: "5757418446",
      subCentres: [
        {
          name: "Lungdai Sub-Centre",
          facility_code: "235778",
          nin: "5167768471",
        },
        {
          name: "Lungmuat HWC - SC",
          facility_code: "235779",
          nin: "5326778437",
        },
        {
          name: "Nisapui HWC - SC",
          facility_code: "235780",
          nin: "3383833716",
        },
        {
          name: "Serkhan HWC - SC",
          facility_code: "235781",
          nin: "8764162478",
        },
        {
          name: "Zanlawn HWC - SC",
          facility_code: "235782",
          nin: "6113155821",
        },
      ],
    },
  ],
};

async function seedKolasibDistrictFacilities() {
  try {
    console.log("🌱 Starting to seed Kolasib district facilities...");

    // Get Kolasib district
    const kolasib = await prisma.district.findFirst({
      where: { name: "Kolasib" },
    });

    if (!kolasib) {
      throw new Error(
        "Kolasib district not found. Please run the main seed first."
      );
    }

    console.log("✅ Found Kolasib district");

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
      kolasibFacilities
    )) {
      let facilityTypeId = facilityTypeMap[facilityTypeName];

      if (!facilityTypeId) {
        console.log(
          `⚠️  Facility type '${facilityTypeName}' not found, creating it...`
        );
        const newType = await prisma.facilityType.create({
          data: { name: facilityTypeName },
        });
        facilityTypeId = newType.id;
        facilityTypeMap[facilityTypeName] = facilityTypeId;
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
              nin:
                facilityData.nin === "Notmapped" || facilityData.nin === "????"
                  ? null
                  : facilityData.nin,
              district_id: kolasib.id,
              facility_type_id: facilityTypeId,
            },
          });

          facilitiesCreated++;
          console.log(`  ✅ Created facility: ${facility.name}`);
        }

        // Create sub-centres if they exist
        if ("subCentres" in facilityData && facilityData.subCentres) {
          for (const subCentreData of facilityData.subCentres) {
            // Check if sub-centre already exists
            const existingSubCentre = await prisma.subCentre.findFirst({
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

            await prisma.subCentre.create({
              data: {
                name: subCentreData.name,
                facility_code: subCentreData.facility_code,
                nin:
                  subCentreData.nin === "Notmapped" ||
                  subCentreData.nin === "????"
                    ? null
                    : subCentreData.nin,
                facility_id: facility.id,
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
    console.error("❌ Error seeding Kolasib district facilities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedKolasibDistrictFacilities().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedKolasibDistrictFacilities;
