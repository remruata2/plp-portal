import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const aizawlWestFacilities = {
  "Medical College and District Hospital": [
    {
      name: "Zoram Medical College & Hospital, Falkawn",
      facility_code: "2073965",
      nin: "Notmapped",
    },
  ],
  "Sub-District Hospital": [
    {
      name: "Kulikawn Sub-District Hospital",
      facility_code: "455008",
      nin: "6413284446",
    },
  ],
  "District Hospital": [
    {
      name: "Aizawl Hospital & Research Centre, Khatla",
      facility_code: "286623",
      nin: "Notmapped",
    },
  ],
  "Private Hospital": [
    {
      name: "Adventist Hospital, Vaivakawn",
      facility_code: "414470",
      nin: "Notmapped",
    },
    {
      name: "Alpha Hospital, Kulikawn",
      facility_code: "2063499",
      nin: "Notmapped",
    },
    {
      name: "BN Hospital & Research Centre, Kulikawn",
      facility_code: "422852",
      nin: "Notmapped",
    },
    {
      name: "City Hospital, Mission Veng",
      facility_code: "2069043",
      nin: "Notmapped",
    },
    {
      name: "Ebenezer Medical Centre, Chawnpui",
      facility_code: "323645",
      nin: "Notmapped",
    },
    {
      name: "Trinity Hospital, Melthum",
      facility_code: null,
      nin: null,
    },
  ],
  "Community Health Centre": [
    {
      name: "Lengpui CHC",
      facility_code: "235555",
      nin: "1114571662",
      subCentres: [
        {
          name: "Lengpui HWC - SC",
          facility_code: "235692",
          nin: "1114571811",
        },
        {
          name: "Hmunpui HWC - SC",
          facility_code: "235691",
          nin: "1114572140",
        },
      ],
    },
  ],
  "Primary Health Centre": [
    {
      name: "Sairang PHC",
      facility_code: "235557",
      nin: "3746684558",
      subCentres: [
        {
          name: "Sairang Sub-Centre",
          facility_code: "235696",
          nin: "3572686388",
        },
      ],
    },
    {
      name: "Aibawk PHC",
      facility_code: "235553",
      nin: "5283485372",
      subCentres: [
        { name: "Sateek HWC - SC", facility_code: "235663", nin: "8852676751" },
        {
          name: "Maubuang AHWC - SC",
          facility_code: "235660",
          nin: "4856372588",
        },
        {
          name: "Muallungthu HWC - SC",
          facility_code: "235661",
          nin: "7118212252",
        },
        {
          name: "Phulpui HWC - SC",
          facility_code: "235662",
          nin: "2744336377",
        },
        {
          name: "Tachhip HWC - SC",
          facility_code: "235664",
          nin: "4184258285",
        },
      ],
    },
    {
      name: "Sialsuk PHC",
      facility_code: "235558",
      nin: "3876573274",
      subCentres: [
        {
          name: "Sialsuk Sub-Centre",
          facility_code: "235700",
          nin: "2318213127",
        },
        {
          name: "Lamchhip HWC - SC",
          facility_code: "235697",
          nin: "2118615265",
        },
        {
          name: "Samlukhai HWC - SC",
          facility_code: "235699",
          nin: "8158481377",
        },
        {
          name: "Sumsuih HWC - SC",
          facility_code: "235701",
          nin: "5516256715",
        },
      ],
    },
  ],
  "Urban Primary Health Centre": [
    {
      name: "Lawipu UPHC",
      facility_code: "435269",
      nin: "1114572652",
      subCentres: [
        {
          name: "Lawipu HWC - SC",
          facility_code: "2024397",
          nin: "1114571365",
        },
        {
          name: "Bungkawn AHWC - SC",
          facility_code: "235677",
          nin: "2415113816",
        },
        {
          name: "Maubawk HWC - SC",
          facility_code: "2031273",
          nin: "5445664740",
        },
        {
          name: "Khatla AHWC - SC",
          facility_code: "235679",
          nin: "6745682432",
        },
      ],
    },
    {
      name: "Chawlhhmun UPHC",
      facility_code: "435267",
      nin: "5258886661",
      subCentres: [
        {
          name: "Chawnpui HWC - SC",
          facility_code: "323677",
          nin: "2485454587",
        },
        {
          name: "Dinthar HWC - SC",
          facility_code: "235678",
          nin: "8334376624",
        },
        {
          name: "Dawrpui Vengthar HWC - SC",
          facility_code: "2031270",
          nin: "1131562462",
        },
        {
          name: "Hunthar HWC - SC",
          facility_code: "323679",
          nin: "8277356468",
        },
        {
          name: "Luangmual HWC - SC",
          facility_code: "235680",
          nin: "6838632450",
        },
        {
          name: "Sakawrtuichhun AHWC - SC",
          facility_code: "235681",
          nin: "5165722553",
        },
        {
          name: "Tanhril HWC - SC",
          facility_code: "235682",
          nin: "5378627284",
        },
        {
          name: "Tuikual HWC - SC",
          facility_code: "235683",
          nin: "6827278539",
        },
        {
          name: "Vaivakawn HWC - SC",
          facility_code: "235684",
          nin: "1181621457",
        },
        { name: "Kanan HWC - SC", facility_code: "2063500", nin: "1135173233" },
        {
          name: "Zotlang HWC - SC",
          facility_code: "235685",
          nin: "3348124383",
        },
      ],
    },
    {
      name: "Hlimen UPHC",
      facility_code: "435268",
      nin: "7363663860",
      subCentres: [
        {
          name: "Hualngohhmun HWC - SC",
          facility_code: "235666",
          nin: "6871485360",
        },
        {
          name: "Kulikawn HWC - SC",
          facility_code: "235667",
          nin: "8355638852",
        },
        {
          name: "Lungleng HWC - SC",
          facility_code: "235668",
          nin: "2738777313",
        },
        {
          name: "Mel - 3 HWC - SC",
          facility_code: "235670",
          nin: "1382787271",
        },
        { name: "Hlimen HWC - SC", facility_code: "235685", nin: "3348124383" },
        {
          name: "Mel - 8 HWC - SC",
          facility_code: "235669",
          nin: "3481734360",
        },
        {
          name: "Mission Vengthlang HWC - SC",
          facility_code: "235671",
          nin: "2633778333",
        },
        {
          name: "Tlangnuam HWC - SC",
          facility_code: "235674",
          nin: "7478561850",
        },
        {
          name: "Upper Republic HWC - SC",
          facility_code: "2031272",
          nin: "3211582527",
        },
        {
          name: "Republic HWC - SC",
          facility_code: "235672",
          nin: "6168767371",
        },
        {
          name: "Venghnuai AHWC - SC",
          facility_code: "235675",
          nin: "6348246361",
        },
      ],
    },
  ],
};

async function seedAizawlWestFacilities() {
  try {
    console.log("🌱 Starting to seed Aizawl West district facilities...");

    // Get Aizawl West district
    const aizawlWest = await prisma.district.findFirst({
      where: { name: "Aizawl West" },
    });

    if (!aizawlWest) {
      throw new Error(
        "Aizawl West district not found. Please run the main seed first."
      );
    }

    console.log("✅ Found Aizawl West district");

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

    // First, create any missing facility types
    const requiredFacilityTypes = [
      "Medical College and District Hospital",
      "Sub-District Hospital",
    ];

    for (const typeName of requiredFacilityTypes) {
      if (!facilityTypeMap[typeName]) {
        console.log(`🔧 Creating missing facility type: ${typeName}`);
        const newType = await prisma.facilityType.create({
          data: { name: typeName },
        });
        facilityTypeMap[typeName] = newType.id;
      }
    }

    // Process each facility type
    for (const [facilityTypeName, facilities] of Object.entries(
      aizawlWestFacilities
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
              nin: facilityData.nin === "Notmapped" ? null : facilityData.nin,
              district_id: aizawlWest.id,
              facility_type_id: facilityTypeId,
            },
          });

          facilitiesCreated++;
          console.log(`  ✅ Created facility: ${facility.name}`);
        }

        // Create sub-centres if they exist
        if ("subCentres" in facilityData && facilityData.subCentres) {
          // Get Sub Centre facility type
          const subCentreType = facilityTypes.find(
            (ft) => ft.name === "Sub Centre"
          );
          if (!subCentreType) {
            console.log(
              "⚠️  Sub Centre facility type not found, skipping sub-centres"
            );
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
                nin: subCentreData.nin === "NA" ? null : subCentreData.nin,
                district_id: aizawlWest.id,
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
    console.error("❌ Error seeding Aizawl West facilities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedAizawlWestFacilities().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedAizawlWestFacilities;
