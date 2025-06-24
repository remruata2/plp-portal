import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const champhaiFacilities = {
  "District Hospital": [
    {
      name: "Champhai District Hospital, Vengsang",
      facility_code: "235542",
      nin: "8128478131",
    },
  ],
  "Private Hospital": [
    {
      name: "Med-Aim Hospital, Champhai Zotlang",
      facility_code: "289051",
      nin: null, // "not mapped"
    },
    {
      name: "DM Hospital, Champhai Vengthlang",
      facility_code: null,
      nin: null,
    },
  ],
  "Urban Primary Health Centre": [
    {
      name: "Champhai UPHC",
      facility_code: "2042097",
      nin: "1131435172",
    },
  ],
  "Main Centre": [
    {
      name: "Champhai Main Centre",
      facility_code: null,
      nin: null,
      subCentres: [
        { name: "Bethel HWC - SC", facility_code: "235709", nin: "4237785540" },
        {
          name: "Bulfekzawl HWC - SC",
          facility_code: "289094",
          nin: "3267548737",
        },
        {
          name: "Champhai AHWC - SC",
          facility_code: "289078",
          nin: "1651253336",
        },
        {
          name: "Hmunhmeltha HWC - SC",
          facility_code: "289086",
          nin: "8182814767",
        },
        {
          name: "Kelkang AHWC - SC",
          facility_code: "289089",
          nin: "1133316537",
        },
        {
          name: "N Khawbung HWC - SC",
          facility_code: "289085",
          nin: "2428831479",
        },
        { name: "Ngur HWC - SC", facility_code: "289083", nin: "7168872245" },
        {
          name: "Ruantlang AHWC - SC",
          facility_code: "289087",
          nin: "6637728335",
        },
        {
          name: "Tlangsam HWC - SC",
          facility_code: "289088",
          nin: "3588336316",
        },
        {
          name: "Champhai Vengthlang HWC - SC",
          facility_code: "289080",
          nin: "5163176513",
        },
        {
          name: "Zokhawthar HWC - SC",
          facility_code: "289090",
          nin: "1114651647",
        },
        { name: "Zote HWC - SC", facility_code: "289084", nin: "7648118730" },
      ],
    },
  ],
  "Primary Health Centre": [
    {
      name: "Bungzung PHC",
      facility_code: "235559",
      nin: "7732238642",
      subCentres: [
        {
          name: "Bungzung Sub-Centre",
          facility_code: "235706",
          nin: "3868242243",
        },
        { name: "Sazep HWC - SC", facility_code: "235707", nin: "3477336337" },
        { name: "Vanzau HWC - SC", facility_code: "235708", nin: "2153138512" },
      ],
    },
    {
      name: "Farkawn PHC",
      facility_code: "235560",
      nin: "8373374555",
      subCentres: [
        {
          name: "Farkawn Sub-Centre",
          facility_code: "235717",
          nin: "6215514651",
        },
        {
          name: "Khankawn HWC - SC",
          facility_code: "235718",
          nin: "3343637769",
        },
        {
          name: "Vaphai AHWC - SC",
          facility_code: "235719",
          nin: "2324384854",
        },
      ],
    },
    {
      name: "Hnahlan PHC",
      facility_code: "235561",
      nin: "5774324734",
      subCentres: [
        {
          name: "Hnahlan Sub-Centre",
          facility_code: "235720",
          nin: "4522788720",
        },
        {
          name: "Khuangphah HWC - SC",
          facility_code: "235721",
          nin: "3457644577",
        },
        {
          name: "Tualcheng AHWC - SC",
          facility_code: "235722",
          nin: "4314122120",
        },
        {
          name: "Vaikhawtlang HWC - SC",
          facility_code: "235723",
          nin: "7717721379",
        },
        { name: "Selam HWC - SC", facility_code: "235752", nin: "5645828467" },
      ],
    },
    {
      name: "Khawbung PHC",
      facility_code: "235563",
      nin: "3555388838",
      subCentres: [
        {
          name: "Khawbung South Sub-Centre",
          facility_code: "235732",
          nin: "2632225617",
        },
        {
          name: "Dungtlang HWC - SC",
          facility_code: "235731",
          nin: "6473752779",
        },
        {
          name: "Khuangthing AHWC - SC",
          facility_code: "235733",
          nin: "3654846819",
        },
        {
          name: "Samthang HWC - SC",
          facility_code: "235734",
          nin: "4471842726",
        },
      ],
    },
    {
      name: "Sesih PHC",
      facility_code: "2018215",
      nin: "1122287129",
      subCentres: [
        {
          name: "Sesih Sub-Centre",
          facility_code: "289093",
          nin: "6515125463",
        },
        {
          name: "Khuangleng HWC - SC",
          facility_code: "289092",
          nin: "2173484730",
        },
        {
          name: "Lianpui HWC - SC",
          facility_code: "289091",
          nin: "3734176385",
        },
      ],
    },
  ],
};

async function seedChamphaiDistrictFacilities() {
  try {
    console.log("🌱 Starting to seed Champhai district facilities...");

    // Get Champhai district
    const champhai = await prisma.district.findFirst({
      where: { name: "Champhai" },
    });

    if (!champhai) {
      throw new Error(
        "Champhai district not found. Please run the main seed first."
      );
    }

    console.log("✅ Found Champhai district");

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
    const requiredFacilityTypes = ["Main Centre"];

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
      champhaiFacilities
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
                facilityData.nin === "not mapped" ||
                facilityData.nin === "Notmapped"
                  ? null
                  : facilityData.nin,
              district_id: champhai.id,
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
                  subCentreData.nin === "not mapped" ||
                  subCentreData.nin === "Notmapped" ||
                  subCentreData.nin === "NA"
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
    console.error("❌ Error seeding Champhai district facilities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedChamphaiDistrictFacilities().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedChamphaiDistrictFacilities;
