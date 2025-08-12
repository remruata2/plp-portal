import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the current user with facility information
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      include: {
        facility: {
          include: {
            facility_type: true,
            district: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.facility) {
      return NextResponse.json(
        { error: "No facility assigned to user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      facility: {
        id: user.facility.id,
        name: user.facility.name,
        display_name: user.facility.display_name,
        facility_type: {
          id: user.facility.facility_type.id,
          name: user.facility.facility_type.name,
          display_name: user.facility.facility_type.display_name,
        },
        district: {
          id: user.facility.district.id,
          name: user.facility.district.name,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user facility:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
