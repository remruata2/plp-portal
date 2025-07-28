import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const aizawlEastFacilities = {
  "District Hospital": [
    {
      name: "Aizawl Civil Hospital, Dawrpui",
      facility_code: null,
      nin: null,
    },
  ],
  "Private Hospital": [
    {
      name: "Agape Multispeciality Hospital, Chanmari",
      facility_code: "2063905",
      nin: "Notmapped",
    },
    {
      name: "Care Hospital, Dawrpui",
      facility_code: "2063906",
      nin: "Notmapped",
    },
    {
      name: "Greenwood Hospital, Bawngkawn",
      facility_code: "2069044",
      nin: "Notmapped",
    },
    {
      name: "LRM Hospital, Ramhlun Vengtai",
      facility_code: null,
      nin: null,
    },
    {
      name: "Nazareth Hospital, Ramhlun North",
      facility_code: null,
      nin: null,
    },
    {
      name: "Nazareth Hospital, Chaltlang",
      facility_code: null,
      nin: null,
    },
    {
      name: "Redeem Hospital, College Veng",
      facility_code: "2063904",
      nin: "Notmapped",
    },
    {
      name: "Synod Hospital, Durtlang",
      facility_code: "323643",
      nin: "Notmapped",
    },
  ],
  "Community Health Centre": [
    {
      name: "Sakawrdai CHC",
      facility_code: "235532",
      nin: "1513527174",
      subCentres: [
        {
          name: "Sakawrdai AHWC - SC",
          facility_code: "235643",
          nin: "4127625111",
        },
        {
          name: "Mauchar HWC - SC",
          facility_code: "235641",
          nin: "4262374681",
        },
        {
          name: "Palsang HWC - SC",
          facility_code: "235642",
          nin: "3823853852",
        },
        {
          name: "Thingsat HWC - SC",
          facility_code: "235644",
          nin: "6548546859",
        },
        {
          name: "Tinghmun HWC - SC",
          facility_code: "235645",
          nin: "7182676382",
        },
        { name: "Vaitin HWC - SC", facility_code: "235646", nin: "7242474331" },
        {
          name: "New Vervek HWC - SC",
          facility_code: "235647",
          nin: "1686846633",
        },
        { name: "Zohmun HWC - SC", facility_code: "235648", nin: "7731675844" },
      ],
    },
    {
      name: "Thingsulthliah CHC",
      facility_code: "235552",
      nin: "4567273687",
      subCentres: [
        {
          name: "Thingsulthliah HWC - SC",
          facility_code: "235657",
          nin: "4325468678",
        },
        { name: "Seling HWC - SC", facility_code: "235655", nin: "1845828456" },
        {
          name: "Sesawng AHWC - SC",
          facility_code: "235656",
          nin: "1887716676",
        },
        {
          name: "Tlungvel HWC - SC",
          facility_code: "235658",
          nin: "7563873723",
        },
        {
          name: "Khumtung AHWC - SC",
          facility_code: "235654",
          nin: "6447733350",
        },
        {
          name: "Baktawng AHWC - SC",
          facility_code: "235653",
          nin: "8127754862",
        },
      ],
    },
  ],
  "Primary Health Centre": [
    {
      name: "Darlawn PHC",
      facility_code: "235549",
      nin: "8138243343",
      subCentres: [
        {
          name: "Darlawn Sub-Centre",
          facility_code: "235619",
          nin: "7653773437",
        },
        {
          name: "N Serzawl HWC - SC",
          facility_code: "235622",
          nin: "2184588271",
        },
        {
          name: "Sawleng AHWC - SC",
          facility_code: "235621",
          nin: "4865258737",
        },
        { name: "Kepran HWC - SC", facility_code: "235623", nin: "5714121174" },
      ],
    },
    {
      name: "Ratu PHC",
      facility_code: "2041764",
      nin: "1122286550",
      subCentres: [
        { name: "Ratu SC", facility_code: "235620", nin: "4972773459" },
      ],
    },
    {
      name: "Khawruhlian PHC",
      facility_code: "235550",
      nin: "5472377372",
      subCentres: [
        {
          name: "Khawruhlian Sub-Centre",
          facility_code: "235625",
          nin: "3444667327",
        },
        {
          name: "E Phaileng HWC - SC",
          facility_code: "235626",
          nin: "2558734477",
        },
      ],
    },
  ],
  "Urban Primary Health Centre": [
    {
      name: "Sihphir UPHC",
      facility_code: "451776",
      nin: "1114575267",
      subCentres: [
        {
          name: "Sihphir HWC - SC",
          facility_code: "235616",
          nin: "6152631179",
        },
        {
          name: "Durtlang HWC - SC",
          facility_code: "235614",
          nin: "8415848558",
        },
      ],
    },
    {
      name: "ITI UPHC",
      facility_code: "451777",
      nin: "1114575143",
      subCentres: [
        {
          name: "Armed Veng AHWC - SC",
          facility_code: "235601",
          nin: "3151766122",
        },
        { name: "Bazar HWC - SC", facility_code: "235603", nin: "7738372411" },
        {
          name: "Bethlehem Vengthlang HWC - SC",
          facility_code: "349144",
          nin: "2555413612",
        },
        {
          name: "Chhinga Veng HWC - SC",
          facility_code: "235606",
          nin: "2832673749",
        },
        {
          name: "Electric HWC - SC",
          facility_code: "235608",
          nin: "9688253411",
        },
        {
          name: "Ramthar HWC - SC",
          facility_code: "2042854",
          nin: "6768233436",
        },
        {
          name: "Venghlui HWC - SC",
          facility_code: "235610",
          nin: "5418937729",
        },
        {
          name: "Edenthar HWC - SC",
          facility_code: "235607",
          nin: "2552665255",
        },
        { name: "ESIC Dispensary", facility_code: "2064148", nin: "NA" },
        { name: "ITI HWC - SC", facility_code: "2031271", nin: "8417644146" },
        {
          name: "Chanmari HWC - SC",
          facility_code: "2042829",
          nin: "6275773387",
        },
        {
          name: "Chanmari West HWC - SC",
          facility_code: "235605",
          nin: "1135172662",
        },
      ],
    },
    {
      name: "Zemabawk UPHC",
      facility_code: "451775",
      nin: "1114575234",
      subCentres: [
        {
          name: "Zemabawk HWC - SC",
          facility_code: "235618",
          nin: "3556384836",
        },
        {
          name: "Bawngkawn HWC - SC",
          facility_code: "323660",
          nin: "7768154648",
        },
        {
          name: "Chaltlang HWC - SC",
          facility_code: "235613",
          nin: "1621114857",
        },
        {
          name: "Ramhlun AHWC - SC",
          facility_code: "235615",
          nin: "7124473345",
        },
        {
          name: "Ramhlun South HWC - SC",
          facility_code: "349146",
          nin: "7515352313",
        },
        {
          name: "Tuirial HWC - SC",
          facility_code: "235617",
          nin: "2477831586",
        },
        {
          name: "Thuampui HWC - SC",
          facility_code: "2042853",
          nin: "7521653159",
        },
        {
          name: "Zuangtui HWC - SC",
          facility_code: "323661",
          nin: "1486532444",
        },
      ],
    },
  ],
};

async function seedAizawlEastFacilities() {
  try {
    console.log("🌱 Starting to seed Aizawl East district facilities...");

    // Get Aizawl East district
    const aizawlEast = await prisma.district.findFirst({
      where: { name: "Aizawl East" },
    });

    if (!aizawlEast) {
      throw new Error(
        "Aizawl East district not found. Please run the main seed first."
      );
    }

    console.log("✅ Found Aizawl East district");

    // Get all facility types
    const facilityTypes = await prisma.facilityType.findMany();
    const facilityTypeMap = facilityTypes.reduce((acc, ft) => {
      acc[ft.name] = ft.id;
      return acc;
    }, {} as Record<string, number>);

    console.log("✅ Retrieved facility types");

    let facilitiesCreated = 0;
    let subCentresCreated = 0;

    // Process each facility type
    for (const [facilityTypeName, facilities] of Object.entries(
      aizawlEastFacilities
    )) {
      const facilityTypeId = facilityTypeMap[facilityTypeName];

      if (!facilityTypeId) {
        console.log(
          `⚠️  Facility type '${facilityTypeName}' not found, skipping...`
        );
        continue;
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
        } else {
          // Create the main facility
          facility = await prisma.facility.create({
            data: {
              name: facilityData.name,
              facility_code: facilityData.facility_code,
              nin: facilityData.nin === "Notmapped" ? null : facilityData.nin,
              district_id: aizawlEast.id,
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
              continue;
            }

            await prisma.facility.create({
              data: {
                name: subCentreData.name,
                facility_code: subCentreData.facility_code,
                nin: subCentreData.nin === "NA" ? null : subCentreData.nin,
                district_id: aizawlEast.id,
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
    console.log(`   • Sub-centres created: ${subCentresCreated}`);
  } catch (error) {
    console.error("❌ Error seeding Aizawl East facilities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedAizawlEastFacilities().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedAizawlEastFacilities;
