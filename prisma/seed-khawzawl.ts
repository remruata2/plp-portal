import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const khawzawlFacilities = {
  "District Hospital": [
    {
      name: "Khawzawl District Hospital",
      facility_code: "235565",
      nin: "2644578367",
    },
  ],
  "Main Centre": [
    {
      name: "Khawzawl Main Centre",
      facility_code: null,
      nin: null,
      subCentres: [
        {
          name: "Khawzawl Sub-Centre",
          facility_code: "323693",
          nin: "8752567472",
        },
        {
          name: "Chawngtlai HWC - SC",
          facility_code: "235740",
          nin: "1435486749",
        },
        {
          name: "Neihdawn HWC - SC",
          facility_code: "235742",
          nin: "5145655139",
        },
        {
          name: "Ngaizawl HWC - SC",
          facility_code: "289047",
          nin: "5444667751",
        },
        {
          name: "Tualpui HWC - SC",
          facility_code: "235743",
          nin: "7317576481",
        },
        { name: "Tualte HWC - SC", facility_code: "235744", nin: "5684625873" },
      ],
    },
  ],
  "Community Health Centre": [
    {
      name: "Biate CHC",
      facility_code: "235534",
      nin: "1277783344",
      subCentres: [
        { name: "Biate HWC - SC", facility_code: "235702", nin: "7834522448" },
        {
          name: "Riangtlei HWC - SC",
          facility_code: "235703",
          nin: "7872568659",
        },
      ],
    },
  ],
  "Primary Health Centre": [
    {
      name: "Kawlkulh PHC",
      facility_code: "235562",
      nin: "2485414748",
      subCentres: [
        {
          name: "Kawlkulh Sub-Centre",
          facility_code: "235727",
          nin: "4271612212",
        },
        {
          name: "Chhawrtui HWC - SC",
          facility_code: "235724",
          nin: "1248785766",
        },
        { name: "Dulte HWC - SC", facility_code: "235725", nin: "2383646466" },
        {
          name: "Vanchengpui HWC - SC",
          facility_code: "235730",
          nin: "3752464382",
        },
      ],
    },
    {
      name: "Khawhai PHC",
      facility_code: "235564",
      nin: "1318175153",
      subCentres: [
        {
          name: "Khawhai Sub-Centre",
          facility_code: "235736",
          nin: "4183428723",
        },
        {
          name: "Lungtan HWC - SC",
          facility_code: "323692",
          nin: "7841462737",
        },
        {
          name: "New Chalrang HWC - SC",
          facility_code: "349162",
          nin: "2756826877",
        },
        {
          name: "Vangtlang HWC - SC",
          facility_code: "289066",
          nin: "1325651725",
        },
      ],
    },
    {
      name: "Rabung PHC",
      facility_code: "235568",
      nin: "2156581163",
      subCentres: [
        {
          name: "Rabung Sub-Centre",
          facility_code: "235753",
          nin: "4275113126",
        },
      ],
    },
    {
      name: "Sialhawk PHC",
      facility_code: "235569",
      nin: "3767465739",
      subCentres: [
        {
          name: "Sialhawk Sub-Centre",
          facility_code: "235756",
          nin: "4585288261",
        },
        {
          name: "Tlangpui HWC - SC",
          facility_code: "323696",
          nin: "4584565479",
        },
      ],
    },
  ],
};

async function seedKhawzawlDistrictFacilities() {
  try {
    console.log("🌱 Starting to seed Khawzawl district facilities...");

    // Get Khawzawl district
    const khawzawl = await prisma.district.findFirst({
      where: { name: "Khawzawl" },
    });

    if (!khawzawl) {
      throw new Error(
        "Khawzawl district not found. Please run the main seed first."
      );
    }

    console.log("✅ Found Khawzawl district");

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
      khawzawlFacilities
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
              district_id: khawzawl.id,
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
                nin: subCentreData.nin,
                district_id: khawzawl.id,
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
    console.error("❌ Error seeding Khawzawl district facilities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedKhawzawlDistrictFacilities().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedKhawzawlDistrictFacilities;
