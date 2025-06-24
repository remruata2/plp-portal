import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const lungleiFacilities = {
  "District Hospital": [
    {
      name: "Lunglei District Hospital",
      facility_code: "235545",
      nin: "6542687857",
    },
  ],
  "Private Hospital": [
    {
      name: "Christian Hospital, Serkawn",
      facility_code: "2045606",
      nin: null, // "Notmapped"
    },
    {
      name: "John Williams Hospital, Chanmari",
      facility_code: "474207",
      nin: null, // "Notmapped"
    },
  ],
  "Sub-District Hospital": [
    {
      name: "Tlabung SDH",
      facility_code: "235986",
      nin: "5113632417",
      subCentres: [
        {
          name: "Chawitung HWC - SC",
          facility_code: "235888",
          nin: "1843338276",
        },
        {
          name: "Diblibagh HWC - SC",
          facility_code: "235889",
          nin: "4441757285",
        },
        {
          name: "Nunsury HWC - SC",
          facility_code: "235890",
          nin: "4715377869",
        },
        {
          name: "Puankhai HWC - SC",
          facility_code: "235891",
          nin: "3863826362",
        },
        {
          name: "Tiperaghat AHWC - SC",
          facility_code: "235892",
          nin: "8726641445",
        },
        {
          name: "Tuichawng AHWC - SC",
          facility_code: "235893",
          nin: "5653651223",
        },
        { name: "Zodin HWC - SC", facility_code: "235894", nin: "4342676584" },
      ],
    },
  ],
  "Primary Health Centre": [
    {
      name: "Buarpui PHC",
      facility_code: "235579",
      nin: "7588773213",
      subCentres: [
        {
          name: "Buarpui Sub-Centre",
          facility_code: "235826",
          nin: "8378264223",
        },
        {
          name: "Changpui HWC - SC",
          facility_code: "235827",
          nin: "6646657749",
        },
        {
          name: "Kawlhawk HWC - SC",
          facility_code: "235828",
          nin: "4568342671",
        },
        {
          name: "Khawlek HWC - SC",
          facility_code: "235829",
          nin: "4236247443",
        },
        {
          name: "Lungchem HWC - SC",
          facility_code: "235830",
          nin: "7734737252",
        },
        { name: "Serte HWC - SC", facility_code: "235831", nin: "7364434238" },
        {
          name: "Sertlangpui HWC - SC",
          facility_code: "235832",
          nin: "7776783156",
        },
      ],
    },
    {
      name: "Bunghmun PHC",
      facility_code: "235580",
      nin: "3478626181",
      subCentres: [
        {
          name: "Old Sachan HWC - SC",
          facility_code: "2043606",
          nin: "1135123345",
        },
        {
          name: "New Sachan AHWC - SC",
          facility_code: "2043607",
          nin: "1135122867",
        },
        {
          name: "Bunghmun Sub-Centre",
          facility_code: "235833",
          nin: "6676745828",
        },
        {
          name: "Laisawral HWC - SC",
          facility_code: "235836",
          nin: "8717576766",
        },
        { name: "Sesawm HWC - SC", facility_code: "235837", nin: "1528277880" },
        {
          name: "Thenhlum AHWC - SC",
          facility_code: "235838",
          nin: "6674288850",
        },
      ],
    },
    {
      name: "Haulawng PHC",
      facility_code: "235583",
      nin: "1844244572",
      subCentres: [
        {
          name: "Haulawng Sub-Centre",
          facility_code: "235845",
          nin: "3467554683",
        },
        {
          name: "Ramlaitui HWC - SC",
          facility_code: "235849",
          nin: "8674654325",
        },
        {
          name: "Hanhchang / Zotuiitlang HWC - SC",
          facility_code: "235846",
          nin: "1483766349",
        },
        {
          name: "Mualthuam N HWC - SC",
          facility_code: "235848",
          nin: "5487218678",
        },
      ],
    },
    {
      name: "Tawipui S PHC",
      facility_code: "235587",
      nin: "3184483539",
      subCentres: [
        { name: "Mamte HWC - SC", facility_code: "235882", nin: "4458553445" },
        {
          name: "Mualcheng S HWC - SC",
          facility_code: "235883",
          nin: "8253358389",
        },
        {
          name: "Tawipui N HWC - SC",
          facility_code: "235884",
          nin: "6743363829",
        },
        {
          name: "Tawipui S Sub-Centre",
          facility_code: "235885",
          nin: "1858678566",
        },
        {
          name: "Thingfal HWC - SC",
          facility_code: "235886",
          nin: "6332684858",
        },
        {
          name: "Thualthu HWC - SC",
          facility_code: "235887",
          nin: "8817833521",
        },
      ],
    },
    {
      name: "Lungsen PHC",
      facility_code: "235584",
      nin: "7227674822",
      subCentres: [
        {
          name: "Lungsen Sub-Centre",
          facility_code: "235872",
          nin: "7676737219",
        },
        {
          name: "Phairuangkai HWC - SC",
          facility_code: "235873",
          nin: "7468726174",
        },
        {
          name: "Putlungasih HWC - SC",
          facility_code: "235874",
          nin: "2565837487",
        },
        {
          name: "Tuisenchhuah HWC - SC",
          facility_code: "235875",
          nin: "8221437877",
        },
        {
          name: "Zawlpui HWC - SC",
          facility_code: "235876",
          nin: "6318474183",
        },
        {
          name: "Lungrang S HWC - SC",
          facility_code: "235801",
          nin: "7836287222",
        },
        {
          name: "Rualalung HWC - SC",
          facility_code: "235802",
          nin: "8316872673",
        },
        {
          name: "Belthei HWC - SC",
          facility_code: "235859",
          nin: "8444157336",
        },
      ],
    },
  ],
  "Urban Primary Health Centre": [
    {
      name: "Hrangchalkawn UPHC",
      facility_code: "286571",
      nin: "8662371186",
      subCentres: [
        {
          name: "Central HWC - SC",
          facility_code: "235864",
          nin: "6846861661",
        },
        {
          name: "Electric HWC - SC",
          facility_code: "235865",
          nin: "6825427682",
        },
        {
          name: "Farm Veng HWC - SC",
          facility_code: "235866",
          nin: "7812287733",
        },
        {
          name: "Lunglawn HWC - SC",
          facility_code: "235868",
          nin: "8714264341",
        },
        {
          name: "Ramthar HWC - SC",
          facility_code: "235870",
          nin: "4857856233",
        },
        {
          name: "Theiriat AHWC - SC",
          facility_code: "235871",
          nin: "5355371120",
        },
        { name: "Vaisam HWC - SC", facility_code: "289054", nin: "6444843152" },
        {
          name: "Hauruang HWC - SC",
          facility_code: "235867",
          nin: "2582777641",
        },
        {
          name: "Hrangchalkawn HWC - SC",
          facility_code: "235895",
          nin: "8827441539",
        },
        {
          name: "Ralvawng HWC - SC",
          facility_code: "235896",
          nin: "2278775677",
        },
        { name: "Zobawk HWC - SC", facility_code: "235899", nin: "2816864827" },
      ],
    },
    {
      name: "Sazaikawn UPHC",
      facility_code: "452999",
      nin: "1114653148",
      subCentres: [
        { name: "Bazar HWC - SC", facility_code: "235855", nin: "3564782377" },
        {
          name: "Pulpui AHWC - SC",
          facility_code: "235857",
          nin: "7468813238",
        },
        {
          name: "Rahsi Veng HWC - SC",
          facility_code: "235858",
          nin: "2544376474",
        },
        {
          name: "Thuampui AHWC - SC",
          facility_code: "235860",
          nin: "1882224469",
        },
        {
          name: "Venghlun HWC - SC",
          facility_code: "235861",
          nin: "8243354431",
        },
        {
          name: "Zohuual HWC - SC",
          facility_code: "235862",
          nin: "8334137430",
        },
        {
          name: "Zotlang HWC - SC",
          facility_code: "235863",
          nin: "8481114786",
        },
      ],
    },
  ],
};

async function seedLungleiDistrictFacilities() {
  try {
    console.log("🌱 Starting to seed Lunglei district facilities...");

    // Get Lunglei district
    const lunglei = await prisma.district.findFirst({
      where: { name: "Lunglei" },
    });

    if (!lunglei) {
      throw new Error(
        "Lunglei district not found. Please run the main seed first."
      );
    }

    console.log("✅ Found Lunglei district");

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
      lungleiFacilities
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
              district_id: lunglei.id,
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
    console.error("❌ Error seeding Lunglei district facilities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedLungleiDistrictFacilities().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedLungleiDistrictFacilities;
