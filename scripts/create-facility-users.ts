import { PrismaClient, UserRole } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createFacilityUsers() {
  try {
    console.log("🚀 Starting facility user creation...");

    // Get all facilities with their districts and facility types
    const facilities = await prisma.facility.findMany({
      include: {
        district: true,
        facility_type: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log(`📋 Found ${facilities.length} facilities`);

    const commonPassword = "facility123"; // Common password for all facility users
    const hashedPassword = await bcrypt.hash(commonPassword, 10);

    let createdCount = 0;
    let skippedCount = 0;

    for (const facility of facilities) {
      // Create email using facility name and district
      const sanitizedFacilityName = facility.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "") // Remove special characters
        .replace(/\s+/g, ""); // Remove spaces

      const sanitizedDistrictName = facility.district.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace(/\s+/g, "");

      const email = `${sanitizedFacilityName}@${sanitizedDistrictName}.com`;
      const username = sanitizedFacilityName;

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { username: email }],
        },
      });

      if (existingUser) {
        console.log(`⏭️  Skipping ${facility.name} - user already exists`);
        skippedCount++;
        continue;
      }

      // Create the user with facility association
      const user = await prisma.user.create({
        data: {
          username,
          email, // Store the generated email address
          password_hash: hashedPassword,
          role: UserRole.facility,
          facility_id: facility.id, // Associate with facility
          is_active: true,
        },
      });

      console.log(
        `✅ Created user for ${facility.name} (${facility.facility_type.name}): ${username} (${email})`
      );
      createdCount++;
    }

    console.log("\n📊 Summary:");
    console.log(`✅ Created: ${createdCount} users`);
    console.log(`⏭️  Skipped: ${skippedCount} users (already existed)`);
    console.log(`🔑 Common password: ${commonPassword}`);
    console.log("\n📧 Email format: facilityname@district.com");
    console.log("👤 Username format: facilityname (lowercase, no spaces)");
    console.log("🏥 Each user is associated with their facility");
  } catch (error) {
    console.error("❌ Error creating facility users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createFacilityUsers();
