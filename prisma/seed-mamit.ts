import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const mamitFacilities = {
  "District Hospital": [
    {
      name: "Mamit District Hospital",
      facility_code: "235546",
      nin: "4762748319",
    },
  ],
  "Main Centre": [
    {
      name: "Mamit Main Centre",
      facility_code: null,
      nin: null,
      subCentres: [
        {
          name: "Damdiai HWC - SC",
          facility_code: "235910",
          nin: "1114653171",
        },
        { name: "Dampui HWC - SC", facility_code: "235911", nin: "8658654754" },
        { name: "Darlak HWC - SC", facility_code: "235912", nin: "3786826234" },
        { name: "Mamit HWC - SC", facility_code: "235913", nin: "7322747580" },
        {
          name: "North Sabual HWC - SC",
          facility_code: "235915",
          nin: "8822418367",
        },
        {
          name: "Nalzawl HWC - SC",
          facility_code: "235914",
          nin: "7287453752",
        },
        {
          name: "Suarhliap HWC - SC",
          facility_code: "235760",
          nin: "1114653239",
        },
      ],
    },
  ],
  "Community Health Centre": [
    {
      name: "Kawrthah CHC",
      facility_code: "235539",
      nin: "3283437188",
      subCentres: [
        {
          name: "Chuhvel HWC - SC",
          facility_code: "235758",
          nin: "1114653262",
        },
        {
          name: "Hriphaw HWC - SC",
          facility_code: "235906",
          nin: "5744577429",
        },
        {
          name: "Kawrthah HWC - SC",
          facility_code: "235907",
          nin: "7881843127",
        },
        {
          name: "Rengdil HWC - SC",
          facility_code: "235908",
          nin: "3476343722",
        },
        {
          name: "Saikhawthlir HWC - SC",
          facility_code: "235759",
          nin: "1114653627",
        },
        {
          name: "Zamuang HWC - SC",
          facility_code: "235909",
          nin: "5824774565",
        },
      ],
    },
  ],
  "Primary Health Centre": [
    {
      name: "Kawrtethawveng PHC",
      facility_code: "286605",
      nin: "1517888853",
      subCentres: [
        {
          name: "W.Bunghmun HWC - SC",
          facility_code: "286602",
          nin: "4567577855",
        },
        {
          name: "Kawrtethawveng Sub-Centre",
          facility_code: "286597",
          nin: "7554848619",
        },
        {
          name: "New Eden HWC - SC",
          facility_code: "286603",
          nin: "8138881175",
        },
        {
          name: "Tuiclam HWC - SC",
          facility_code: "286604",
          nin: "4633865466",
        },
      ],
    },
    {
      name: "Marpara PHC",
      facility_code: "235590",
      nin: "3242374449",
      subCentres: [
        {
          name: "Marpara Sub-Centre",
          facility_code: "235916",
          nin: "1316226412",
        },
      ],
    },
    {
      name: "Phuldungsei PHC",
      facility_code: "235591",
      nin: "7836681572",
      subCentres: [
        {
          name: "Parvatui HWC - SC",
          facility_code: "235918",
          nin: "1164175133",
        },
        {
          name: "Phuldungsei Sub-Centre",
          facility_code: "235919",
          nin: "3825754744",
        },
        {
          name: "Pukzing HWC - SC",
          facility_code: "235920",
          nin: "8412865249",
        },
        {
          name: "Silsury HWC - SC",
          facility_code: "235917",
          nin: "1327122410",
        },
      ],
    },
    {
      name: "Reiek PHC",
      facility_code: "235556",
      nin: "1114572231",
      subCentres: [
        {
          name: "Reiek Sub-Centre",
          facility_code: "235695",
          nin: "1114572264",
        },
        {
          name: "Ailawng HWC - SC",
          facility_code: "235693",
          nin: "1114572355",
        },
        {
          name: "W Lungdar HWC - SC",
          facility_code: "235694",
          nin: "1114572413",
        },
      ],
    },
    {
      name: "Rawpuichhip PHC",
      facility_code: "235592",
      nin: "5747833530",
      subCentres: [
        {
          name: "Rawpuichhip Sub-Centre",
          facility_code: "235921",
          nin: "8815385763",
        },
        {
          name: "Hmunpui HWC - SC",
          facility_code: "235691",
          nin: "1114572140",
        },
        {
          name: "Rulpuihlim HWC - SC",
          facility_code: "235922",
          nin: "2777782141",
        },
      ],
    },
    {
      name: "West Phaileng PHC",
      facility_code: "286607",
      nin: "7726814671",
      subCentres: [
        {
          name: "Damparengpui HWC - SC",
          facility_code: "286609",
          nin: "7538468310",
        },
        { name: "Lallen HWC - SC", facility_code: "286611", nin: "2455368486" },
        {
          name: "Tuipuibari HWC - SC",
          facility_code: "286610",
          nin: "4723482180",
        },
        {
          name: "West Phaileng Sub-Centre",
          facility_code: "286608",
          nin: "5674784318",
        },
      ],
    },
    {
      name: "Zawlnuam PHC",
      facility_code: "235594",
      nin: "6346211516",
      subCentres: [
        {
          name: "Bungthuam HWC - SC",
          facility_code: "235928",
          nin: "7381772735",
        },
        { name: "Borai HWC - SC", facility_code: "235927", nin: "6436646852" },
        {
          name: "Kanhmun HWC - SC",
          facility_code: "235900",
          nin: "2336534884",
        },
        {
          name: "Thinghlun HWC - SC",
          facility_code: "235901",
          nin: "5381148781",
        },
        {
          name: "Zawlnuam Sub-Centre",
          facility_code: "235929",
          nin: "7714747321",
        },
      ],
    },
    {
      name: "Kanghmun PHC",
      facility_code: "235554",
      nin: "1114571423",
      subCentres: [
        {
          name: "Kanghmun Sub-Centre",
          facility_code: "235688",
          nin: "1114571571",
        },
        {
          name: "Darlung HWC - SC",
          facility_code: "235687",
          nin: "1114571456",
        },
        {
          name: "Khawrihnim HWC - SC",
          facility_code: "235689",
          nin: "1114571639",
        },
      ],
    },
  ],
};

async function seedMamitDistrictFacilities() {
  try {
    console.log("🌱 Starting to seed Mamit district facilities...");

    // Get Mamit district
    const mamit = await prisma.district.findFirst({
      where: { name: "Mamit" },
    });

    if (!mamit) {
      throw new Error(
        "Mamit district not found. Please run the main seed first."
      );
    }

    console.log("✅ Found Mamit district");

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
      mamitFacilities
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
              district_id: mamit.id,
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
                district_id: mamit.id,
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
    console.error("❌ Error seeding Mamit district facilities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedMamitDistrictFacilities().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedMamitDistrictFacilities;
