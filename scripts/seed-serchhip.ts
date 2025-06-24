import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const serchhipFacilities = {
  "District Hospital": [
    {
      name: "Serchhip District Hospital",
      facility_code: "235548",
      nin: "3766558682",
    },
  ],
  "Private Hospital": [
    {
      name: "Mercy Hospital",
      facility_code: "474206",
      nin: null,
    },
  ],
  "Main Centre": [
    {
      name: "Serchhip Main Centre",
      facility_code: null,
      nin: null,
      subCentres: [
        {
          name: "E Bungtlang HWC - SC",
          facility_code: "235976",
          nin: "8577463626",
        },
        {
          name: "Chhiahtlang HWC - SC",
          facility_code: "235977",
          nin: "8542573475",
        },
        {
          name: "Hriangtlang HWC - SC",
          facility_code: "235978",
          nin: "4271328943",
        },
        {
          name: "Keitum AHWC - SC",
          facility_code: "235979",
          nin: "6464587713",
        },
        {
          name: "New Serchhip AHWC - SC",
          facility_code: "235980",
          nin: "3463685820",
        },
        {
          name: "Serchhip HWC - SC",
          facility_code: "235982",
          nin: "5788832557",
        },
        {
          name: "Sialhau HWC - SC",
          facility_code: "235983",
          nin: "1321755710",
        },
      ],
    },
  ],
  "Community Health Centre (CHC)": [
    {
      name: "Thenzawl CHC",
      facility_code: "323723",
      nin: "1854385687",
      subCentres: [
        {
          name: "Buangpui HWC - SC",
          facility_code: "323721",
          nin: "2285444820",
        },
        {
          name: "Thenzawl HWC - SC",
          facility_code: "323722",
          nin: "6574744261",
        },
        {
          name: "Kanghmun South HWC - SC",
          facility_code: "235847",
          nin: "1114653536",
        },
        { name: "Zote S HWC - SC", facility_code: "235844", nin: "3225412224" },
      ],
    },
  ],
  "Primary Health Centre (PHC)": [
    {
      name: "Ngentiang PHC",
      facility_code: "235599",
      nin: "1432848180",
      subCentres: [
        {
          name: "Lungpho HWC - SC",
          facility_code: "235973",
          nin: "6314875771",
        },
        { name: "Rullam HWC - SC", facility_code: "235974", nin: "8435826188" },
        {
          name: "Thinglian HWC - SC",
          facility_code: "235975",
          nin: "5811114569",
        },
      ],
    },
    {
      name: "Chhingchhip PHC",
      facility_code: "235595",
      nin: "5161563233",
      subCentres: [
        {
          name: "Chhingchhip Sub-Centre",
          facility_code: "235959",
          nin: "7831623488",
        },
        {
          name: "Hmuntha HWC - SC",
          facility_code: "235960",
          nin: "6417888127",
        },
        { name: "Hualtu HWC - SC", facility_code: "235961", nin: "6588643145" },
        {
          name: "Khawbel HWC - SC",
          facility_code: "235962",
          nin: "6737586575",
        },
        {
          name: "Thentlang HWC - SC",
          facility_code: "235963",
          nin: "7152542515",
        },
      ],
    },
    {
      name: "Khawlailung PHC",
      facility_code: "235596",
      nin: "4233855842",
      subCentres: [
        {
          name: "Khawlailung Sub-Centre",
          facility_code: "235964",
          nin: "6357482469",
        },
      ],
    },
    {
      name: "East Lungdar PHC",
      facility_code: "235597",
      nin: "1143525143",
      subCentres: [
        { name: "Leng HWC - SC", facility_code: "235965", nin: "6235125173" },
        {
          name: "East Lungdar Sub-Centre",
          facility_code: "235966",
          nin: "5551143653",
        },
        {
          name: "Mualcheng HWC - SC",
          facility_code: "235967",
          nin: "3811847379",
        },
        {
          name: "Sailulak HWC - SC",
          facility_code: "235968",
          nin: "1741845877",
        },
      ],
    },
    {
      name: "N Vanlaiphai PHC",
      facility_code: "235598",
      nin: "4438538557",
      subCentres: [
        {
          name: "Lungchhuan HWC - SC",
          facility_code: "235969",
          nin: "1761255262",
        },
        {
          name: "Lungkawlh HWC - SC",
          facility_code: "235970",
          nin: "2851777777",
        },
        {
          name: "North Vanlaiphai Sub-Centre",
          facility_code: "235971",
          nin: "7785757530",
        },
      ],
    },
  ],
};

async function seedSerchhipDistrictFacilities() {
  try {
    console.log("🌱 Starting to seed Serchhip district facilities...");

    // Get Serchhip district
    const serchhip = await prisma.district.findFirst({
      where: { name: "Serchhip" },
    });

    if (!serchhip) {
      throw new Error(
        "Serchhip district not found. Please run the main seed first."
      );
    }

    console.log("✅ Found Serchhip district");

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
      serchhipFacilities
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
              district_id: serchhip.id,
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
    console.error("❌ Error seeding Serchhip district facilities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedSerchhipDistrictFacilities().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedSerchhipDistrictFacilities;
