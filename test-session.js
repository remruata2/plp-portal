const { PrismaClient } = require("./src/generated/prisma");

const prisma = new PrismaClient();

async function testSession() {
  try {
    console.log("🔍 Testing session data...");

    // Test facility user with facility_id
    const facilityUser = await prisma.user.findFirst({
      where: {
        role: "facility",
        username: "aibawkphc",
      },
      select: {
        id: true,
        username: true,
        role: true,
        email: true,
        facility_id: true,
      },
    });

    if (facilityUser) {
      console.log("✅ Facility user found:");
      console.log("  ID:", facilityUser.id);
      console.log("  Username:", facilityUser.username);
      console.log("  Role:", facilityUser.role);
      console.log("  Email:", facilityUser.email);
      console.log("  Facility ID:", facilityUser.facility_id);
    } else {
      console.log("❌ Facility user not found");
    }

    // Test admin user (should not have facility_id)
    const adminUser = await prisma.user.findUnique({
      where: { username: "admin" },
      select: {
        id: true,
        username: true,
        role: true,
        email: true,
        facility_id: true,
      },
    });

    if (adminUser) {
      console.log("\n✅ Admin user found:");
      console.log("  ID:", adminUser.id);
      console.log("  Username:", adminUser.username);
      console.log("  Role:", adminUser.role);
      console.log("  Email:", adminUser.email);
      console.log("  Facility ID:", adminUser.facility_id);
    } else {
      console.log("❌ Admin user not found");
    }
  } catch (error) {
    console.error("❌ Error testing session:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testSession();
