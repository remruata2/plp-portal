import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const lawngtlaiFacilities = {
  "District Hospital": [
    {
      name: "Lawngtlai District Hospital",
      facility_code: "235544",
      nin: "6432786454",
    },
  ],
  "Private Hospital": [
    {
      name: "Christian Hospital",
      facility_code: "286617",
      nin: null, // "Notmapped"
    },
    {
      name: "Lairam Christian Medical Centre",
      facility_code: "286620",
      nin: null, // "Notmapped"
    },
  ],
  "Main Centre": [
    {
      name: "Lawngtlai Main Centre",
      facility_code: null,
      nin: null,
      subCentres: [
        {
          name: "College Veng HWC - SC",
          facility_code: "235805",
          nin: "4636475370",
        },
        {
          name: "Khawmawi AHWC - SC",
          facility_code: "235807",
          nin: "8316134884",
        },
        {
          name: "Kawlchaw HWC - SC",
          facility_code: "235806",
          nin: "2573787187",
        },
        {
          name: "Lawngtlai AHWC - SC",
          facility_code: "235809",
          nin: "3773783315",
        },
        { name: "Mampui HWC - SC", facility_code: "235810", nin: "4114664883" },
        {
          name: "Paithar AHWC - SC",
          facility_code: "235811",
          nin: "7526587741",
        },
        {
          name: "Thingkah HWC - SC",
          facility_code: "235812",
          nin: "2778282273",
        },
      ],
    },
  ],
  "Community Health Centre": [
    {
      name: "Chawngte CHC",
      facility_code: "235537",
      nin: "5767187288",
      subCentres: [
        {
          name: "Chawngte C AHWC - SC",
          facility_code: "235798",
          nin: "6765377731",
        },
        {
          name: "Chawngte P HWC - SC",
          facility_code: "235799",
          nin: "1621761715",
        },
        {
          name: "Hmunlai HWC - SC",
          facility_code: "235800",
          nin: "3654727860",
        },
        {
          name: "Saizawh W HWC - SC",
          facility_code: "235803",
          nin: "6734558346",
        },
        {
          name: "Sumsilui HWC - SC",
          facility_code: "235804",
          nin: "6278536773",
        },
      ],
    },
  ],
  "Primary Health Centre": [
    {
      name: "Borapansury PHC / Non functional (temporary closed)",
      facility_code: null,
      nin: null,
      subCentres: [
        {
          name: "Borapansury Sub-Centre",
          facility_code: "235786",
          nin: "1723671119",
        },
        {
          name: "Jarulsury HWC - SC",
          facility_code: "235787",
          nin: "4714447176",
        },
      ],
    },
    {
      name: "Bualpui NG PHC",
      facility_code: "235576",
      nin: "2743762383",
      subCentres: [
        {
          name: "Bualpui NG Sub-Centre",
          facility_code: "235788",
          nin: "6582817778",
        },
        {
          name: "Lungzarhtum HWC - SC",
          facility_code: "235789",
          nin: "7787225379",
        },
      ],
    },
    {
      name: "S Lungpher PHC",
      facility_code: "235577",
      nin: "1888772611",
      subCentres: [
        {
          name: "S Lungpher Sub-Centre",
          facility_code: "235813",
          nin: "3847742529",
        },
        {
          name: "Siachangkawn HWC - SC",
          facility_code: "235814",
          nin: "6745472370",
        },
        {
          name: "Vawmbuk HWC - SC",
          facility_code: "235815",
          nin: "3542747856",
        },
      ],
    },
    {
      name: "Sangau PHC",
      facility_code: "235578",
      nin: "1788182283",
      subCentres: [
        {
          name: "Cheural HWC - SC",
          facility_code: "235816",
          nin: "4465787523",
        },
        { name: "Rawlbuk HWC - SC", facility_code: "Map thar tur", nin: null },
        {
          name: "Lungtian HWC - SC",
          facility_code: "235817",
          nin: "3714878315",
        },
        {
          name: "Pangkhua HWC - SC",
          facility_code: "235818",
          nin: "7385457572",
        },
        {
          name: "Sangau Sub-Centre",
          facility_code: "235819",
          nin: "5826717877",
        },
      ],
    },
    {
      name: "Bungtlang S PHC",
      facility_code: "415900",
      nin: "8446761663",
      subCentres: [
        {
          name: "Ajasora HWC - SC",
          facility_code: "235820",
          nin: "3347634630",
        },
        {
          name: "Bungtlang S Sub-Centre",
          facility_code: "235791",
          nin: "1146541162",
        },
        {
          name: "Chamdur P HWC - SC",
          facility_code: "235792",
          nin: "2126133178",
        },
        {
          name: "Damdep AHWC - SC",
          facility_code: "235821",
          nin: "1856784572",
        },
        {
          name: "Devasora S HWC - SC",
          facility_code: "235822",
          nin: "1883824714",
        },
        {
          name: "Diltlang HWC - SC",
          facility_code: "235793",
          nin: "3587422779",
        },
        {
          name: "Longpuighat HWC - SC (Vaseitlang)",
          facility_code: "235825",
          nin: "5716846778",
        },
        {
          name: "M Kawnpui HWC - SC",
          facility_code: "235794",
          nin: "5567628879",
        },
        {
          name: "Mautlang HWC - SC",
          facility_code: "235795",
          nin: "7668464139",
        },
        { name: "Parva AHWC - SC", facility_code: "235823", nin: "7645663837" },
        {
          name: "Tuiitumhnar AHWC - SC",
          facility_code: "235796",
          nin: "2464543442",
        },
        {
          name: "Vathuampui HWC - SC",
          facility_code: "235797",
          nin: "8658742179",
        },
      ],
    },
  ],
};

async function seedLawngtlaiDistrictFacilities() {
  try {
    console.log("🌱 Starting to seed Lawngtlai district facilities...");

    // Get Lawngtlai district
    const lawngtlai = await prisma.district.findFirst({
      where: { name: "Lawngtlai" },
    });

    if (!lawngtlai) {
      throw new Error(
        "Lawngtlai district not found. Please run the main seed first."
      );
    }

    console.log("✅ Found Lawngtlai district");

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
      lawngtlaiFacilities
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
              district_id: lawngtlai.id,
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
                  subCentreData.facility_code &&
                  subCentreData.facility_code !== "Map thar tur"
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
                facility_code:
                  subCentreData.facility_code === "Map thar tur"
                    ? null
                    : subCentreData.facility_code,
                nin:
                  subCentreData.nin === "Notmapped" ? null : subCentreData.nin,
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
    console.error("❌ Error seeding Lawngtlai district facilities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedLawngtlaiDistrictFacilities().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedLawngtlaiDistrictFacilities;
