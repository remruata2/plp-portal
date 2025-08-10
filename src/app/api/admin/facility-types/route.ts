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
        "Development mode: Allowing unauthenticated access to facility types"
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

    // Get facility types from the database
    const facilityTypes = await prisma.facilityType.findMany({
      where: { is_active: true },
      select: {
        id: true,
        name: true,
        display_name: true,
      },
      orderBy: { name: "asc" },
    });

    // Transform to match the expected interface
    const transformedFacilityTypes = facilityTypes.map((ft) => ({
      id: ft.id,
      name: ft.name,
      displayName: ft.display_name || ft.name,
    }));

    return NextResponse.json(transformedFacilityTypes);
  } catch (error) {
    console.error("Error fetching facility types:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
