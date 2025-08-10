const { PrismaClient } = require("./src/generated/prisma");

const prisma = new PrismaClient();

async function updateAdminEmail() {
  try {
    console.log("🔧 Updating admin email...");

    const adminUser = await prisma.user.update({
      where: { username: "admin" },
      data: { email: "admin@plp-portal.com" },
    });

    console.log("✅ Admin email updated:", adminUser.email);
  } catch (error) {
    console.error("❌ Error updating admin email:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminEmail();
