import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const hnahthialFacilities = {
  "District Hospital": [
    {
      name: "Hnahthial District Hospital",
      facility_code: "235538",
      nin: "6818464353",
    },
  ],
  "Main Centre": [
    {
      name: "Hnahthial Main Centre",
      facility_code: null,
      nin: null,
      subCentres: [
        {
          name: "Hnahthial HWC - SC",
          facility_code: "235850",
          nin: "1787876166",
        },
        { name: "Leite HWC - SC", facility_code: "235851", nin: "5558432885" },
        { name: "Tarpho HWC - SC", facility_code: "235852", nin: "7781358663" },
        {
          name: "Tuipui D HWC - SC",
          facility_code: "235854",
          nin: "4354427439",
        },
      ],
    },
  ],
  "Primary Health Centre": [
    {
      name: "Cherhlun PHC",
      facility_code: "235581",
      nin: "2523486761",
      subCentres: [
        {
          name: "Cherhlun Sub-Centre",
          facility_code: "235840",
          nin: "2163561653",
        },
        {
          name: "South Chawngtui HWC - SC",
          facility_code: "235972",
          nin: "4367817360",
        },
      ],
    },
    {
      name: "Thingsai PHC",
      facility_code: "235841",
      nin: "1123351288",
      subCentres: [
        {
          name: "Thingsai Sub-Centre",
          facility_code: "2005542",
          nin: "3682476332",
        },
        {
          name: "Bualpui H HWC - SC",
          facility_code: "235839",
          nin: "8816811486",
        },
      ],
    },
    {
      name: "Chhipphir PHC",
      facility_code: "235582",
      nin: "3856678564",
      subCentres: [
        {
          name: "Chhipphir Sub-Centre",
          facility_code: "235843",
          nin: "3243476710",
        },
        {
          name: "Bualpui V HWC - SC",
          facility_code: "235842",
          nin: "3835518782",
        },
      ],
    },
    {
      name: "Pangzawl PHC",
      facility_code: "235585",
      nin: "2858645670",
      subCentres: [
        {
          name: "Pangzawl Sub-Centre",
          facility_code: "235877",
          nin: "2315236618",
        },
        { name: "Rawpui HWC - SC", facility_code: "235878", nin: "7353667681" },
        {
          name: "Thiltlang HWC - SC",
          facility_code: "235853",
          nin: "4747275545",
        },
      ],
    },
    {
      name: "S Vanlaiphai PHC",
      facility_code: "235586",
      nin: "1176313524",
      subCentres: [
        {
          name: "S Vanlaiphai Sub-Centre",
          facility_code: "316797",
          nin: "8665673730",
        },
        { name: "Darzo AHWC - SC", facility_code: "316796", nin: "5535252620" },
        {
          name: "Muallianpui HWC - SC",
          facility_code: "235880",
          nin: "4557817741",
        },
      ],
    },
  ],
};

async function seedHnahthialDistrictFacilities() {
  try {
    console.log("🌱 Starting to seed Hnahthial district facilities...");

    // Get Hnahthial district
    const hnahthial = await prisma.district.findFirst({
      where: { name: "Hnahthial" },
    });

    if (!hnahthial) {
      throw new Error(
        "Hnahthial district not found. Please run the main seed first."
      );
    }

    console.log("✅ Found Hnahthial district");

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
      hnahthialFacilities
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
              nin: facilityData.nin,
              district_id: hnahthial.id,
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
                nin: subCentreData.nin,
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
    console.error("❌ Error seeding Hnahthial district facilities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedHnahthialDistrictFacilities().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedHnahthialDistrictFacilities;
