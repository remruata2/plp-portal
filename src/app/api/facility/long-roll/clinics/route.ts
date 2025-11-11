import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's facility
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: {
        facility_id: true,
      },
    });

    if (!user?.facility_id) {
      return NextResponse.json({ error: "No facility assigned" }, { status: 403 });
    }

    // Get facility details
    const facility = await prisma.facility.findUnique({
      where: { id: user.facility_id },
      select: {
        id: true,
        name: true,
        display_name: true,
        has_clinic: true,
        parent_facility_id: true,
      },
    });

    if (!facility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 });
    }

    // Check if this facility has clinic capability
    if (!facility.has_clinic) {
      return NextResponse.json({
        success: true,
        clinics: [], // No child clinics if this isn't a clinic
      });
    }

    // Fetch child clinics (facilities where parent_facility_id = current facility)
    const childClinics = await prisma.facility.findMany({
      where: {
        parent_facility_id: facility.id,
        has_clinic: true,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        display_name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Include the current facility as well
    const allClinics = [
      {
        id: facility.id,
        name: facility.name,
        display_name: facility.display_name,
      },
      ...childClinics,
    ];

    return NextResponse.json({
      success: true,
      clinics: allClinics,
    });
  } catch (error) {
    console.error("Error fetching clinics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
