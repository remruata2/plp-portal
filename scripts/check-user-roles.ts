import { PrismaClient, UserRole } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function checkUserRoles() {
  try {
    console.log("📊 Checking user roles...");

    // Get all users with their roles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        is_active: true,
      },
      orderBy: {
        username: "asc",
      },
    });

    console.log(`📋 Found ${users.length} total users`);

    // Group by role
    const roleCounts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("\n📈 Role distribution:");
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`  ${role}: ${count} users`);
    });

    console.log("\n👥 User details:");
    users.forEach((user) => {
      const status = user.is_active ? "✅" : "❌";
      console.log(`  ${status} ${user.username} (${user.role})`);
    });
  } catch (error) {
    console.error("❌ Error checking user roles:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
checkUserRoles();
