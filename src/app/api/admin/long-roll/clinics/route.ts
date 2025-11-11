import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { UserRole } from "@/generated/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== UserRole.admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Fetch all facilities with clinic capability
    const clinics = await prisma.facility.findMany({
      where: {
        has_clinic: true,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        display_name: true,
        district: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        {
          district: {
            name: 'asc',
          },
        },
        {
          name: 'asc',
        },
      ],
    });

    return NextResponse.json({
      success: true,
      clinics,
    });
  } catch (error) {
    console.error("Error fetching clinics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
