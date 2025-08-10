import { PrismaClient, UserRole } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function updateUserEmails() {
  try {
    console.log("🚀 Starting user email updates...");

    // Get all facility users (excluding admin)
    const users = await prisma.user.findMany({
      where: {
        role: UserRole.facility,
        facility_id: {
          not: null,
        },
      },
      include: {
        facility: {
          include: {
            district: true,
          },
        },
      },
      orderBy: {
        username: "asc",
      },
    });

    console.log(`📋 Found ${users.length} facility users to update`);

    let updatedCount = 0;

    for (const user of users) {
      if (!user.facility) {
        console.log(`⚠️  User ${user.username} has no facility association`);
        continue;
      }

      // Generate email address
      const email = `${user.username}@${user.facility.district.name
        .toLowerCase()
        .replace(/\s+/g, "")}.com`;

      // Update user with email
      await prisma.user.update({
        where: { id: user.id },
        data: {
          email: email,
        },
      });

      console.log(`✅ Updated ${user.username} with email: ${email}`);
      updatedCount++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Updated: ${updatedCount} users with email addresses`);
    console.log(`📧 Email format: username@district.com`);
  } catch (error) {
    console.error("❌ Error updating user emails:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserEmails();
