import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function seedComplete() {
  console.log("🌱 Starting complete database seeding...");

  try {
    // Step 1: Basic structure (already handled by prisma/seed.ts)
    console.log("✅ Basic structure already seeded by prisma/seed.ts");

    // Step 2: Enhanced facility types
    console.log("\n📋 Step 2: Seeding enhanced facility types...");
    await seedEnhancedFacilityTypes();

    // Step 5: Facility seeding
    console.log("\n📋 Step 5: Seeding facilities...");
    await seedFacilities();

    // Step 6: Remuneration system
    console.log("\n📋 Step 6: Seeding remuneration system...");
    await seedRemunerationSystem();

    console.log("\n🎉 Complete seeding finished successfully!");
    console.log("\n📊 Database Summary:");
    await printDatabaseSummary();
  } catch (error) {
    console.error("❌ Error during complete seeding:", error);
    throw error;
  }
}

async function seedEnhancedFacilityTypes() {
  console.log("📋 Step 2: Seeding enhanced facility types...");

  const facilityTypes = [
    { name: "PHC", display_name: "Primary Health Centre" },
    { name: "UPHC", display_name: "Urban Primary Health Centre" },
    { name: "SC_HWC", display_name: "Sub Centre Health & Wellness Centre" },
    { name: "U_HWC", display_name: "Urban Health & Wellness Centre" },
    { name: "A_HWC", display_name: "AYUSH Health & Wellness Centre" },
  ];

  let createdCount = 0;
  let skippedCount = 0;

  for (const facilityType of facilityTypes) {
    const existingType = await prisma.facilityType.findUnique({
      where: { name: facilityType.name },
    });

    if (existingType) {
      console.log(
        `⏭️ Facility type ${facilityType.name} already exists. Skipping.`
      );
      skippedCount++;
    } else {
      await prisma.facilityType.create({
        data: {
          name: facilityType.name,
          display_name: facilityType.display_name,
        },
      });
      createdCount++;
      console.log(`✅ Created facility type: ${facilityType.name}`);
    }
  }

  console.log(`   - ${createdCount} facility types created.`);
  console.log(`   - ${skippedCount} facility types skipped (already existed).`);
}

async function seedFacilities() {
  console.log("   - Seeding facilities...");

  // First, get the districts and facility types for reference
  const districts = await prisma.district.findMany();
  const facilityTypes = await prisma.facilityType.findMany();

  // Get the existing facilities to avoid duplicates
  const existingFacilities = await prisma.facility.findMany();
  const existingNames = new Set(existingFacilities.map((f) => f.name));

  const facilitiesData = [
    // Urban Primary Health Centres (UPHC) - 9
    { name: "ITI UPHC", district: "Aizawl East", facilityType: "UPHC" },
    { name: "Sihphir UPHC", district: "Aizawl East", facilityType: "UPHC" },
    { name: "Zemabawk UPHC", district: "Aizawl East", facilityType: "UPHC" },
    { name: "Hlimen UPHC", district: "Aizawl West", facilityType: "UPHC" },
    { name: "Lawipu", district: "Aizawl West", facilityType: "UPHC" },
    { name: "Chawlhhmun", district: "Aizawl West", facilityType: "UPHC" },
    { name: "Champhai", district: "Champhai", facilityType: "UPHC" },
    { name: "Hrangchalkawn UPHC", district: "Lunglei", facilityType: "UPHC" },
    { name: "Sazaikawn UPHC", district: "Lunglei", facilityType: "UPHC" },

    // Primary Health Centres (PHC) - 61
    { name: "Darlawn PHC", district: "Serchhip", facilityType: "PHC" },
    { name: "Khawruhlian PHC", district: "Aizawl East", facilityType: "PHC" },
    { name: "Phuaibuang PHC", district: "Aizawl East", facilityType: "PHC" },
    { name: "Phullen PHC", district: "Aizawl East", facilityType: "PHC" },
    { name: "Suangpuilawn PHC", district: "Aizawl East", facilityType: "PHC" },
    {
      name: "Thingsulthliah PHC",
      district: "Aizawl East",
      facilityType: "PHC",
    },
    { name: "Ratu PHC", district: "Aizawl East", facilityType: "PHC" },
    { name: "Aibawk PHC", district: "Aizawl West", facilityType: "PHC" },
    { name: "Lengpui PHC", district: "Aizawl West", facilityType: "PHC" },
    { name: "Sairang PHC", district: "Aizawl West", facilityType: "PHC" },
    { name: "Sialsuk PHC", district: "Aizawl West", facilityType: "PHC" },
    { name: "Bungzung PHC", district: "Champhai", facilityType: "PHC" },
    { name: "Farkawn PHC", district: "Champhai", facilityType: "PHC" },
    { name: "Hnahlan PHC", district: "Champhai", facilityType: "PHC" },
    { name: "Kawlkulh PHC", district: "Champhai", facilityType: "PHC" },
    { name: "Khawbung PHC", district: "Champhai", facilityType: "PHC" },
    { name: "Khawhai PHC", district: "Champhai", facilityType: "PHC" },
    { name: "Khawzawl PHC", district: "Champhai", facilityType: "PHC" },
    { name: "Mimbung PHC", district: "Champhai", facilityType: "PHC" },
    { name: "NE Khawdungsei PHC", district: "Champhai", facilityType: "PHC" },
    { name: "Rabung PHC", district: "Champhai", facilityType: "PHC" },
    { name: "Sialhawk PHC", district: "Champhai", facilityType: "PHC" },
    { name: "Sesih PHC", district: "Champhai", facilityType: "PHC" },
    { name: "Thingsai PHC", district: "Lunglei", facilityType: "PHC" },
    { name: "Bairabi PHC", district: "Kolasib", facilityType: "PHC" },
    { name: "Bilkhawthlir PHC", district: "Kolasib", facilityType: "PHC" },
    { name: "Bukpui PHC", district: "Kolasib", facilityType: "PHC" },
    { name: "Kawnpui PHC", district: "Kolasib", facilityType: "PHC" },
    { name: "Lungdai PHC", district: "Kolasib", facilityType: "PHC" },
    { name: "Borapansury PHC", district: "Lawngtlai", facilityType: "PHC" },
    { name: "Bualpui NG PHC", district: "Lawngtlai", facilityType: "PHC" },
    { name: "Bungtlang S PHC", district: "Lawngtlai", facilityType: "PHC" },
    { name: "S. Lungpher PHC", district: "Lawngtlai", facilityType: "PHC" },
    { name: "Sangau PHC", district: "Lawngtlai", facilityType: "PHC" },
    { name: "Longpuighat PHC", district: "Lawngtlai", facilityType: "PHC" },
    { name: "Buarpui PHC", district: "Lunglei", facilityType: "PHC" },
    { name: "Bunghmun S PHC", district: "Lunglei", facilityType: "PHC" },
    { name: "Cherhlun PHC", district: "Lunglei", facilityType: "PHC" },
    { name: "Chhipphir PHC", district: "Lunglei", facilityType: "PHC" },
    { name: "Haulawng PHC", district: "Lunglei", facilityType: "PHC" },
    { name: "Lungsen PHC", district: "Lunglei", facilityType: "PHC" },
    { name: "Pangzawl PHC", district: "Lunglei", facilityType: "PHC" },
    { name: "S. Vanlaiphai PHC", district: "Lunglei", facilityType: "PHC" },
    { name: "Tawipui S PHC", district: "Lunglei", facilityType: "PHC" },
    { name: "Kawrtethawveng PHC", district: "Mamit", facilityType: "PHC" },
    { name: "Marpara PHC", district: "Mamit", facilityType: "PHC" },
    { name: "Phuldungsei PHC", district: "Mamit", facilityType: "PHC" },
    { name: "Rawpuichhip PHC", district: "Mamit", facilityType: "PHC" },
    { name: "W.Phaileng PHC", district: "Mamit", facilityType: "PHC" },
    { name: "Zawlnuam PHC", district: "Mamit", facilityType: "PHC" },
    { name: "Chakhang PHC", district: "Saiha", facilityType: "PHC" },
    { name: "Chhuarlung PHC", district: "Saiha", facilityType: "PHC" },
    { name: "Phura PHC", district: "Saiha", facilityType: "PHC" },
    { name: "Tuipang PHC", district: "Saiha", facilityType: "PHC" },
    { name: "Chhingchhip PHC", district: "Serchhip", facilityType: "PHC" },
    { name: "Khawlailung PHC", district: "Serchhip", facilityType: "PHC" },
    { name: "Lungdar E PHC", district: "Serchhip", facilityType: "PHC" },
    { name: "N.Vanlaiphai PHC", district: "Serchhip", facilityType: "PHC" },
    { name: "Ngentiang PHC", district: "Serchhip", facilityType: "PHC" },
    { name: "Kanghmun PHC", district: "Mamit", facilityType: "PHC" },
    { name: "Reiek PHC", district: "Mamit", facilityType: "PHC" },

    // Sub-Centres (SC) - 384
    { name: "Darlawn SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Ratu SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Sawleng SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Serzawl SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Armveng SC", district: "Aizawl East", facilityType: "SC_HWC" },
    {
      name: "Bazar Aizawl SC",
      district: "Aizawl East",
      facilityType: "SC_HWC",
    },
    {
      name: "Bethlehem Vengthlang SC",
      district: "Aizawl East",
      facilityType: "SC_HWC",
    },
    {
      name: "Chhinga veng SC",
      district: "Aizawl East",
      facilityType: "SC_HWC",
    },
    {
      name: "Electric Aizawl SC",
      district: "Aizawl East",
      facilityType: "SC_HWC",
    },
    { name: "Venghlui SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Venghnuai SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Kepran SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Khanpui SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Khawruhlian SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Phaileng E SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Daido SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Khawlian SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Phuaibuang SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Phullen SC", district: "Aizawl East", facilityType: "SC_HWC" },
    {
      name: "Thanglailung SC",
      district: "Aizawl East",
      facilityType: "SC_HWC",
    },
    { name: "Buhban SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Keifang SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Lenchim SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Maite SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Rulchawm SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Saitual SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Sihfa SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Tualbung SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Mauchar SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Palsang SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Sakawrdai SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Thingsat SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Tinghmun SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Vaitin SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Vervek SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Zohmun SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Rawlbuk", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Durtlang SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Sihphir SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "N.Khawlek SC", district: "Aizawl East", facilityType: "SC_HWC" },
    {
      name: "Suangpuilawn SC",
      district: "Aizawl East",
      facilityType: "SC_HWC",
    },
    { name: "Vanbawng SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Baktawng SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Khumtung SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Seling SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Sesawng SC", district: "Aizawl East", facilityType: "SC_HWC" },
    {
      name: "Thingsulthliah SC",
      district: "Aizawl East",
      facilityType: "SC_HWC",
    },
    { name: "Tlungvel SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Bawngkawn SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Chaltlang SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Chanmari SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Edenthar SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Ramhlun SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Tuirial SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Zemabawk SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Zuangtui SC", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Ramhlun South", district: "Aizawl East", facilityType: "SC_HWC" },
    {
      name: "Upper Republic SC",
      district: "Aizawl East",
      facilityType: "SC_HWC",
    },
    {
      name: "Thuampui_Aizawl_East SC",
      district: "Aizawl East",
      facilityType: "SC_HWC",
    },
    { name: "Chanmari West", district: "Aizawl East", facilityType: "SC_HWC" },
    { name: "Maubuang SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Muallungthu SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Phulpui SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Sateek SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Tachhip SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Chawnpui SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Dinthar SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Hunthar SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Luangmual SC", district: "Aizawl West", facilityType: "SC_HWC" },
    {
      name: "Sakawrtuichhun SC",
      district: "Aizawl West",
      facilityType: "SC_HWC",
    },
    { name: "Tanhril SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Tuikual SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Vaivakawn SC", district: "Aizawl West", facilityType: "SC_HWC" },
    {
      name: "Zotlang Aizawl SC",
      district: "Aizawl West",
      facilityType: "SC_HWC",
    },
    { name: "Hualngohmun SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Kulikawn SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Lungleng SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Melriat SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Melthum SC", district: "Aizawl West", facilityType: "SC_HWC" },
    {
      name: "Mission Veng SC",
      district: "Aizawl West",
      facilityType: "SC_HWC",
    },
    { name: "Tlangnuam SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "ITI SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Bungkawn SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Khatla SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Lawipu SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Hmunpui SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Lengpui SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Sairang SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Lamchhip SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Salem SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Samlukhai SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Sialsuk SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Sumsuih SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Republic SC", district: "Aizawl West", facilityType: "SC_HWC" },
    { name: "Tuivamit SC", district: "Aizawl West", facilityType: "SC_HWC" },
    {
      name: "Central Jail Veng SC",
      district: "Aizawl West",
      facilityType: "SC_HWC",
    },
    {
      name: "PTC Lungverh SC",
      district: "Aizawl West",
      facilityType: "SC_HWC",
    },
    { name: "N Hlimen SC", district: "Aizawl West", facilityType: "SC_HWC" },
    {
      name: "Dawrpui Vengthar SC",
      district: "Aizawl West",
      facilityType: "SC_HWC",
    },
    { name: "Bethel SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Bulfekzawl SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Champhai SC", district: "Champhai", facilityType: "SC_HWC" },
    {
      name: "Champhai Vengthlang SC",
      district: "Champhai",
      facilityType: "SC_HWC",
    },
    { name: "Hmunhmeltha SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Kelkang SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Khawbung N SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Khuangleng SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Lianpui SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Ngur SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Ruantlang SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Sesih SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Tlangsam SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Zokhawthar SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Zote Champhai SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Biate SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Riangtlei SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Bungzung SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Sazep SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Vanzau SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Vapar SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Farkawn SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Khankawn SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Vaphai SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Hnahlan SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Khuangphah SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Tualcheng SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Vaikhawtlang SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Chhawrtui SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Dulte SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Kawlkulh SC", district: "Champhai", facilityType: "SC_HWC" },
    {
      name: "NE Bualpui Hliappui SC",
      district: "Champhai",
      facilityType: "SC_HWC",
    },
    { name: "Pawlrang SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Saichal SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Vanchengpui SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Dungtlang SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Khawbung SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Khuangthing SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Samthang SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Khawhai SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Lungtan SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "New Chalrang SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Vantlang SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Chawngtlai SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Khawzawl SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Neihdawn SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Ngaizawl SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Tualpui SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Tualte SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Mimbung SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Teikhang SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Khawkawn SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "NE Khawdungsei SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Kawlbem SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Lamzawl SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Ngopa SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Selam SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Rabung SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Sialhawk SC", district: "Champhai", facilityType: "SC_HWC" },
    { name: "Tlangpui SC", district: "Champhai", facilityType: "SC_HWC" },
    {
      name: "Kolasib Vengthar SC",
      district: "Kolasib",
      facilityType: "SC_HWC",
    },
    { name: "Buhchangphai SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Diakkawn SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "New Builum SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Pangbalkawn SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Thingdawl SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Tuithaveng SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Tumpui SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Bairabi SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Bilkhawthlir SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "N Chawnpui SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Saiphai SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Saipum SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Bukpui SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "N Chaltlang SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Bualpui SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Hortoki SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Kawnpui SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Lungdai SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Lungmuat SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Nisapui SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Serkhan SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Zanlawn SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Phainuam SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Phaisen SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "Vairengte SC", district: "Kolasib", facilityType: "SC_HWC" },
    { name: "College Veng SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Kawlchaw SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Khawmawi SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Lawngtlai SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Mampui SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Phaithar SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Thingkah SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Borapansury SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Jarulsury SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Bualpui Ng SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Lungzarhtum SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Ajasora SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Bungtlang S SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    {
      name: "Chamdur Pilot Proj SC",
      district: "Lawngtlai",
      facilityType: "SC_HWC",
    },
    { name: "Damdep SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Devasora SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Diltlang SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Longpuighat", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "M. Kawnpui SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Mautlang SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Parva SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Tuithumhnar SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Vathuampui SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    {
      name: "Melbuk (Khawnuam) SC",
      district: "Lawngtlai",
      facilityType: "SC_HWC",
    },
    { name: "Chawngte C SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Chawngte P SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Hmunlai SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Lungrang S SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Rualalung SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Saizawh SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Sumsilui SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "S. Lungpher SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Siachangkawn SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Vawmbuk SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Cheural SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Lungtian SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Pangkhua SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Sangau SC", district: "Lawngtlai", facilityType: "SC_HWC" },
    { name: "Ramthar SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Buarpui SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Bazar Lunglei SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Bualpui H SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Bualpui V SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Bunghmun S SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Central SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Changpui SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Chawilung SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Cherhlun SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Chhipphir SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Darngawn W SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Darzo SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Diblibagh SC", district: "Lunglei", facilityType: "SC_HWC" },
    {
      name: "Electric Lunglei SC",
      district: "Lunglei",
      facilityType: "SC_HWC",
    },
    { name: "Farmveng SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Haulawng SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Hauruang SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Hnahthial SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Hrangchalkawn SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Kawlhawk SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Kawnpui W SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Khawlek SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Laisawral SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Leite SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Lungchem SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Lunglawn SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Lungsen SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Mamte SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Muallianpui SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Mualthuam N SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Nunsury SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Pangzawl SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Phairuangkai SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Puankhai SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Pukpui SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Putlungasih SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Rahsiveng SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Ralvawng SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Ramlaitui SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Rawpui SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "S Mualcheng SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "S Vanlaiphai SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Serte SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Sertlangpui SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Sesawm SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Tarpho SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Tawipui N SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Tawipui S SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Theiriat SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Thenhlum SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Thiltlang SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Thingfal SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Thingsai SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Thualthu SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Tiperaghat SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Tuichawng SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Tuipui D SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Tuisenchhuah SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Vaisam SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Venghlun SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Zawlpui SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Zobawk SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Zodin SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Zohnuai SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Zotlang Lunglei SC", district: "Lunglei", facilityType: "SC_HWC" },
    {
      name: "Thuampui_Lunglei SC",
      district: "Lunglei",
      facilityType: "SC_HWC",
    },
    {
      name: "Hnahchang / Zotuitlang SC",
      district: "Lunglei",
      facilityType: "SC_HWC",
    },
    { name: "Belthei SC", district: "Lunglei", facilityType: "SC_HWC" },
    { name: "Damdiai SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Dampui SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Darlak SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Mamit SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "N Sabual SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Nalzawl SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Suarhliap SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Kawrtethawveng SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "New Eden SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Tuidam SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "W Bunghmun SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Chuhvel SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Hriphaw SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Kawrthah SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Rengdil SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Saikhawthlir SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Zamuang SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Maubawk", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Marpara SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Silsuri SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Parvatui SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Phuldungsei SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Pukzing SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Rawpuichhip SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Rulpuihlim SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Damparengpui SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Lallen SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Tuipuibari SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "W.Phaileng SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Borai SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Bungthuam SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Kanhmun SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Thinghlun SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Zawlnuam SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Ailawng SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Darlung W SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Lungdar W SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Reiek SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Khawrihnim SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Kanghmun SC", district: "Mamit", facilityType: "SC_HWC" },
    { name: "Maubawk SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Old Saiha SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Phalhrang SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Rawmibawk SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Saihatlangkawn SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Theiva SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Tuipuiferry SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Tuisumpui SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Chakhang SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Siata SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Chhuarlung SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Niawhtlang SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Lawngban SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "New Latawh SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Phura SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Tongkolong SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Vahai SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Chapui SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Laki SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Serkawr SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Tuipang L SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Tuipang V SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Tuisih SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Zawngling SC", district: "Saiha", facilityType: "SC_HWC" },
    { name: "Bungtlang SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Chhiahtlang SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Keitum SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "New Serchhip SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Serchhip SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Sialhau SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Chhingchhip SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Hmuntha SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Hualtu SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Khawbel SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Thentlang SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Khawlailung SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Leng SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Lungdar E SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "N Mualcheng SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Sailulak SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Lungchhuan SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Lungkawlh SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "N Vanlaiphai SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "S Chawngtui SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Lungpho SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Rullam SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Thinglian SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Buangpui SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Kanghmun South SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Thenzawl SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Hriangtlang SC", district: "Serchhip", facilityType: "SC_HWC" },
    { name: "Zote S SC", district: "Serchhip", facilityType: "SC_HWC" },

    // Urban Health & Wellness Centre (U_HWC) facilities
    { name: "Chite UHWC", district: "Aizawl East", facilityType: "U_HWC" },
    { name: "MINECO UHWC", district: "Aizawl West", facilityType: "U_HWC" },
    { name: "Phunchawng UHWC", district: "Aizawl West", facilityType: "U_HWC" },
    { name: "Ruallung UHWC", district: "Aizawl East", facilityType: "U_HWC" },
    {
      name: "Tuirial Kai UHWC",
      district: "Aizawl East",
      facilityType: "U_HWC",
    },
    { name: "Tuivamit UHWC", district: "Aizawl West", facilityType: "U_HWC" },
    {
      name: "Zemabawk Lungbial UHWC",
      district: "Aizawl East",
      facilityType: "U_HWC",
    },
    {
      name: "Mission Veng UHWC",
      district: "Aizawl West",
      facilityType: "U_HWC",
    },
    {
      name: "Champhai Zotlang UHWC",
      district: "Champhai",
      facilityType: "U_HWC",
    },
    { name: "Zaingen Veng UHWC", district: "Champhai", facilityType: "U_HWC" },
    { name: "Hnahthial UHWC", district: "Lunglei", facilityType: "U_HWC" },
    { name: "Vengthar UHWC", district: "Kolasib", facilityType: "U_HWC" },
    { name: "Council Veng UHWC", district: "Lawngtlai", facilityType: "U_HWC" },
    { name: "Pukpui UHWC", district: "Lunglei", facilityType: "U_HWC" },
    { name: "Sethlun UHWC", district: "Lunglei", facilityType: "U_HWC" },
    { name: "Hmarveng UHWC", district: "Mamit", facilityType: "U_HWC" },
    { name: "Meisavaih UHWC", district: "Saiha", facilityType: "U_HWC" },
    {
      name: "New Serchhip North UHWC",
      district: "Serchhip",
      facilityType: "U_HWC",
    },

    // AYUSH Health & Wellness Centre (A_HWC) facilities
    { name: "Kelkang AYUSH SC", district: "Champhai", facilityType: "A_HWC" },
    { name: "New Sachan AYUSH SC", district: "Lunglei", facilityType: "A_HWC" },
    { name: "Ngopa AYUSH SC", district: "Saitual", facilityType: "A_HWC" },
    { name: "Champhai AYUSH SC", district: "Champhai", facilityType: "A_HWC" },
    { name: "Damdep AYUSH SC", district: "Lawngtlai", facilityType: "A_HWC" },
    { name: "Thuampui AYUSH SC", district: "Lunglei", facilityType: "A_HWC" },
    {
      name: "Sesawng AYUSH SC",
      district: "Aizawl East",
      facilityType: "A_HWC",
    },
    { name: "Vaphai AYUSH SC", district: "Champhai", facilityType: "A_HWC" },
    {
      name: "Bungkawn AYUSH SC",
      district: "Aizawl East",
      facilityType: "A_HWC",
    },
    {
      name: "Tuithumhnar AYUSH SC",
      district: "Lawngtlai",
      facilityType: "A_HWC",
    },
    {
      name: "Armed Veng AYUSH SC",
      district: "Aizawl East",
      facilityType: "A_HWC",
    },
    {
      name: "New Serchhip AYUSH SC",
      district: "Serchhip",
      facilityType: "A_HWC",
    },
    {
      name: "Khuangthing AYUSH SC",
      district: "Champhai",
      facilityType: "A_HWC",
    },
    {
      name: "Lawngtlai AYUSH SC",
      district: "Lawngtlai",
      facilityType: "A_HWC",
    },
    { name: "Niawhtlang AYUSH SC", district: "Saiha", facilityType: "A_HWC" },
    {
      name: "Sakawrdai AYUSH SC",
      district: "Aizawl East",
      facilityType: "A_HWC",
    },
    { name: "Tualcheng Ayush SC", district: "Champhai", facilityType: "A_HWC" },
    { name: "Chapui AYUSH SC", district: "Saiha", facilityType: "A_HWC" },
    { name: "Thingdawl AYUSH SC", district: "Kolasib", facilityType: "A_HWC" },
    {
      name: "Maubuang AYUSH SC",
      district: "Aizawl East",
      facilityType: "A_HWC",
    },
    {
      name: "Sawleng AYUSH SC",
      district: "Aizawl East",
      facilityType: "A_HWC",
    },
    {
      name: "Sakawrtuichhun AYUSH SC",
      district: "Aizawl East",
      facilityType: "A_HWC",
    },
    { name: "Theiriat AYUSH SC", district: "Lunglei", facilityType: "A_HWC" },
    { name: "Darzo AYUSH SC", district: "Hnahthial", facilityType: "A_HWC" },
    { name: "Tuichawng AYUSH SC", district: "Lunglei", facilityType: "A_HWC" },
    {
      name: "NE Bualpui / Hliappui AYUSH SC",
      district: "Khawzawl",
      facilityType: "A_HWC",
    },
    {
      name: "Venghnuai AYUSH SC",
      district: "Aizawl East",
      facilityType: "A_HWC",
    },
    {
      name: "Khumtung AYUSH SC",
      district: "Aizawl East",
      facilityType: "A_HWC",
    },
    { name: "Keitum AYUSH SC", district: "Serchhip", facilityType: "A_HWC" },
    { name: "Ruantlang AYUSH SC", district: "Champhai", facilityType: "A_HWC" },
    { name: "Thenhlum AYUSH SC", district: "Lunglei", facilityType: "A_HWC" },
    { name: "Khatla AYUSH SC", district: "Aizawl East", facilityType: "A_HWC" },
    {
      name: "Chawngte C AYUSH SC",
      district: "Lawngtlai",
      facilityType: "A_HWC",
    },
    {
      name: "Ramhlun AYUSH SC",
      district: "Aizawl East",
      facilityType: "A_HWC",
    },
    { name: "Pukpui AYUSH SC", district: "Lunglei", facilityType: "A_HWC" },
    { name: "Paithar AYUSH SC", district: "Lawngtlai", facilityType: "A_HWC" },
    { name: "Parva AYUSH SC", district: "Lawngtlai", facilityType: "A_HWC" },
    {
      name: "Baktawng AYUSH SC",
      district: "Aizawl East",
      facilityType: "A_HWC",
    },
    { name: "Khawmawi AYUSH SC", district: "Lawngtlai", facilityType: "A_HWC" },
    { name: "Tiperaghat AYUSH SC", district: "Lunglei", facilityType: "A_HWC" },
    { name: "Keifang AYUSH SC", district: "Saitual", facilityType: "A_HWC" },
  ];

  // Filter out existing facilities
  const newFacilities = facilitiesData.filter(
    (facility) => !existingNames.has(facility.name)
  );

  console.log(`Found ${newFacilities.length} new facilities to create`);

  // Create facilities
  let createdCount = 0;
  for (const facilityData of newFacilities) {
    const district = districts.find((d) => d.name === facilityData.district);
    const facilityType = facilityTypes.find(
      (t) => t.name === facilityData.facilityType
    );

    if (!district || !facilityType) {
      console.log(
        `Skipping facility ${facilityData.name} - missing district or facility type`
      );
      continue;
    }

    try {
      await prisma.facility.create({
        data: {
          name: facilityData.name,
          display_name: facilityData.name,
          facility_type_id: facilityType.id,
          district_id: district.id,
        },
      });
      createdCount++;
    } catch (error) {
      console.error(`Error creating facility ${facilityData.name}:`, error);
    }
  }

  console.log(`Created ${createdCount} facilities`);
}

async function seedRemunerationSystem() {
  console.log("   - Remuneration system seeding (placeholder)");
  // TODO: Implement remuneration seeding if needed
}

async function printDatabaseSummary() {
  const indicators = await prisma.indicator.count();
  const facilityTypes = await prisma.facilityType.count();
  const districts = await prisma.district.count();
  const facilities = await prisma.facility.count();

  console.log(`   • Indicators: ${indicators}`);
  console.log(`   • Facility Types: ${facilityTypes}`);
  console.log(`   • Districts: ${districts}`);
  console.log(`   • Facilities: ${facilities}`);
}

seedComplete()
  .catch((e: any) => {
    console.error("❌ Error during complete seeding:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
