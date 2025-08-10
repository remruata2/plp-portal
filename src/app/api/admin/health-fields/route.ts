import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Allow unauthenticated access in development mode
    if (process.env.NODE_ENV === "development") {
      console.log(
        "Development mode: Allowing unauthenticated access to health fields"
      );
    } else {
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Check if user is admin
      if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Get health fields from the database
    const healthFields = await prisma.field.findMany({
      where: { is_active: true },
      select: {
        id: true,
        code: true,
        name: true,
        field_type: true,
        user_type: true,
        is_active: true,
      },
      orderBy: { code: "asc" },
    });

    return NextResponse.json(healthFields);
  } catch (error) {
    console.error("Error fetching health fields:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
