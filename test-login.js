const { PrismaClient } = require("./src/generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log("🔍 Testing login system...");

    // Test admin user
    const adminUser = await prisma.user.findUnique({
      where: { username: "admin" },
    });

    if (adminUser) {
      console.log("✅ Admin user found:", adminUser.username);
      console.log("📧 Email:", adminUser.email);
      console.log("🔑 Has password hash:", !!adminUser.password_hash);
    } else {
      console.log("❌ Admin user not found");
    }

    // Test facility user
    const facilityUser = await prisma.user.findFirst({
      where: {
        role: "facility",
        username: "aibawkphc",
      },
    });

    if (facilityUser) {
      console.log("✅ Facility user found:", facilityUser.username);
      console.log("📧 Email:", facilityUser.email);
      console.log("🔑 Has password hash:", !!facilityUser.password_hash);
      console.log("🏥 Facility ID:", facilityUser.facility_id);

      // Test password verification
      const isPasswordValid = await bcrypt.compare(
        "facility123",
        facilityUser.password_hash
      );
      console.log(
        "🔐 Password verification:",
        isPasswordValid ? "✅ Valid" : "❌ Invalid"
      );
    } else {
      console.log("❌ Facility user not found");
    }

    // Test email login
    const emailUser = await prisma.user.findFirst({
      where: {
        email: "aibawkphc@aizawlwest.com",
      },
    });

    if (emailUser) {
      console.log("✅ Email login user found:", emailUser.username);
      console.log("📧 Email:", emailUser.email);
    } else {
      console.log("❌ Email login user not found");
    }
  } catch (error) {
    console.error("❌ Error testing login:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
