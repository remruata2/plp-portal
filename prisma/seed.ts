import { PrismaClient, UserRole } from "../src/generated/prisma";
import bcrypt from "bcryptjs";
import { hmisIndicators } from "./seed-hmis-indicators";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Create sample users
  const adminPassword = await bcrypt.hash("password123", 10);
  const staffPassword = await bcrypt.hash("password123", 10);

  const users = [
    {
      username: "admin",
      password_hash: adminPassword,
      role: UserRole.admin,
    },
    {
      username: "staffuser",
      password_hash: staffPassword,
      role: UserRole.staff,
    },
  ];

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: u,
    });
    console.log(`Created/found user with id: ${user.id} (${user.username})`);
  }

  // Create facility types
  const facilityTypes = [
    { name: "District Hospital" },
    { name: "Private Hospital" },
    { name: "Community Health Centre" },
    { name: "Primary Health Centre" },
    { name: "Urban Primary Health Centre" },
    { name: "Sub Centre" },
  ];

  for (const ft of facilityTypes) {
    const facilityType = await prisma.facilityType.upsert({
      where: { name: ft.name },
      update: {},
      create: ft,
    });
    console.log(`Created facility type: ${facilityType.name}`);
  }

  // Create sample districts (Mizoram districts)
  const districts = [
    { name: "Aizawl East" },
    { name: "Aizawl West" },
    { name: "Champhai" },
    { name: "Hnahthial" },
    { name: "Khawzawl" },
    { name: "Kolasib" },
    { name: "Lawngtlai" },
    { name: "Lunglei" },
    { name: "Mamit" },
    { name: "Saitual" },
    { name: "Serchhip" },
    { name: "Siaha" },
  ];

  for (const d of districts) {
    const district = await prisma.district.upsert({
      where: { name: d.name },
      update: {},
      create: d,
    });
    console.log(`Created district: ${district.name}`);
  }

  // Get created districts and facility types to link them
  const aizawlEast = await prisma.district.findUnique({
    where: { name: "Aizawl East" },
  });
  const aizawlWest = await prisma.district.findUnique({
    where: { name: "Aizawl West" },
  });
  const chcType = await prisma.facilityType.findUnique({
    where: { name: "Community Health Centre" },
  });
  const phcType = await prisma.facilityType.findUnique({
    where: { name: "Primary Health Centre" },
  });
  const subCentreType = await prisma.facilityType.findUnique({
    where: { name: "Sub Centre" },
  });

  if (aizawlEast && aizawlWest && chcType && phcType && subCentreType) {
    // Create sample parent facilities
    const parentFacilitiesData = [
      {
        name: "CHC Sakawrdai",
        district_id: aizawlEast.id,
        facility_type_id: chcType.id,
        facility_code: "AE-CHC-01",
      },
      {
        name: "PHC Sialsuk",
        district_id: aizawlEast.id,
        facility_type_id: phcType.id,
        facility_code: "AE-PHC-01",
      },
      {
        name: "CHC Lengpui",
        district_id: aizawlWest.id,
        facility_type_id: chcType.id,
        facility_code: "AW-CHC-01",
      },
    ];

    const createdFacilities: { [key: string]: any } = {};

    for (const f of parentFacilitiesData) {
      const facility = await prisma.facility.upsert({
        where: { facility_code: f.facility_code },
        update: { name: f.name },
        create: f,
      });
      createdFacilities[facility.facility_code!] = facility;
      console.log(`Created/found facility: ${facility.name}`);
    }

    console.log("Skipping sub-centre creation due to schema changes.");
  } else {
    console.log(
      "Skipping facility and sub-centre seeding because required districts or types were not found."
    );
  }

  // Delete all existing indicators to ensure a clean slate
  await prisma.indicator.deleteMany({});
  console.log("Deleted all existing indicators.");

  // Seed all HMIS Indicators
  for (const indicator of hmisIndicators) {
    await prisma.indicator.upsert({
      where: { code: indicator.code },
      update: { name: indicator.name, type: indicator.type },
      create: indicator,
    });
  }

  console.log(`Upserted ${hmisIndicators.length} HMIS indicators.`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
