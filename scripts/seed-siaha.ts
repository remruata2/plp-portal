import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const siahaFacilities = {
  "District Hospital": [
    {
      name: "Siaha District Hospital",
      facility_code: "235547",
      nin: "3584226876",
    },
  ],
  "Private Hospital": [
    {
      name: "Maraland Gospel Centenary Hospital",
      facility_code: "286625",
      nin: null,
    },
  ],
  "Main Centre": [
    {
      name: "Siaha Main Centre",
      facility_code: null,
      nin: null,
      subCentres: [
        {
          name: "Maubawk HWC - SC (Amobyu)",
          facility_code: "235941",
          nin: "3328581842",
        },
        {
          name: "Old Siaha HWC - SC",
          facility_code: "235943",
          nin: "1833771874",
        },
        {
          name: "Phalhrang HWC - SC (Thiahra)",
          facility_code: "235944",
          nin: "4732282449",
        },
        {
          name: "Saihatlangkawn HWC - SC (Siahatlah)",
          facility_code: "235947",
          nin: "2878146634",
        },
        { name: "Theiva HWC - SC", facility_code: "350463", nin: "4858681143" },
        {
          name: "Tuipuiferi HWC - SC (Tipi Ferry)",
          facility_code: "235948",
          nin: "6755116529",
        },
        {
          name: "Tuisumpui HWC - SC (Tisopi)",
          facility_code: "350462",
          nin: "2765251133",
        },
        {
          name: "Rawmibawk HWC - SC (Amotlah)",
          facility_code: "235945",
          nin: "3662827744",
        },
        {
          name: "New Latawh HWC - SC (New Laty)",
          facility_code: "206135",
          nin: null,
        },
      ],
    },
  ],
  "Primary Health Centre (PHC)": [
    {
      name: "Chakhang PHC (Chakhei)",
      facility_code: "323718",
      nin: "8181178776",
      subCentres: [
        {
          name: "Chakhang Sub-Centre (Chakhei)",
          facility_code: "235931",
          nin: "8157375844",
        },
        { name: "Siata HWC - SC", facility_code: "235932", nin: "5336153126" },
      ],
    },
    {
      name: "Chhuarlung PHC (Chhaolo)",
      facility_code: "323705",
      nin: "8481434168",
      subCentres: [
        {
          name: "Chhuarlung Sub-Centre (Chhaolo)",
          facility_code: "235934",
          nin: "4134434580",
        },
        {
          name: "Niawhtlang AHWC - SC (Noaotlah)",
          facility_code: "235935",
          nin: "3881238756",
        },
      ],
    },
    {
      name: "Tuipang PHC (Tipa)",
      facility_code: "323714",
      nin: "2752418885",
      subCentres: [
        {
          name: "Chapui HWC - SC (Chapi)",
          facility_code: "235950",
          nin: "4577685722",
        },
        { name: "Laki HWC - SC", facility_code: "235951", nin: "6768657758" },
        {
          name: "Serkawr HWC - SC (Saikao)",
          facility_code: "235952",
          nin: "2377388612",
        },
        {
          name: "Tuipang B HWC - SC (Tipa B)",
          facility_code: "235954",
          nin: "1264531615",
        },
        {
          name: "Tuipang V Sub-Centre (Tipa V)",
          facility_code: "235956",
          nin: "8572467457",
        },
        {
          name: "Tuisih HWC - SC (Tisi)",
          facility_code: "235957",
          nin: "1748177852",
        },
        {
          name: "Zawngling HWC - SC (Zyhno)",
          facility_code: "235958",
          nin: "1156554329",
        },
      ],
    },
    {
      name: "Phura PHC",
      facility_code: "323706",
      nin: "3387686250",
      subCentres: [
        {
          name: "Lawngban HWC - SC (Pala)",
          facility_code: "235936",
          nin: "8377236362",
        },
        {
          name: "Phura Sub-Centre",
          facility_code: "235938",
          nin: "8247581732",
        },
        {
          name: "Tongkolong HWC - SC (Tokalo)",
          facility_code: "235939",
          nin: "6628782339",
        },
        {
          name: "Vahai (Vahia) HWC - SC",
          facility_code: "235940",
          nin: "7281432786",
        },
      ],
    },
  ],
};

async function seedSiahaDistrictFacilities() {
  try {
    console.log("🌱 Starting to seed Siaha district facilities...");

    // Get Siaha district
    const siaha = await prisma.district.findFirst({
      where: { name: "Siaha" },
    });

    if (!siaha) {
      throw new Error(
        "Siaha district not found. Please run the main seed first."
      );
    }

    console.log("✅ Found Siaha district");

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
      siahaFacilities
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
              district_id: siaha.id,
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
    console.error("❌ Error seeding Siaha district facilities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedSiahaDistrictFacilities().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedSiahaDistrictFacilities;
