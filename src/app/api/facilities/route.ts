import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { UserRole } from "@/types/user";



export async function GET(request: NextRequest) {
  try {
    console.log("Facilities API: Request received");
    const session = await getServerSession(authOptions);

    console.log("Facilities API: Session:", session);
    console.log("Facilities API: Session user:", session?.user);

    if (!session) {
      console.log("Facilities API: No session, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Allow admin and facility users to access facilities
    if (
      session.user.role !== UserRole.admin &&
      session.user.role !== UserRole.facility
    ) {
      console.log("Facilities API: User role not allowed:", session.user.role);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const districtId = searchParams.get("districtId");
    const facilityTypeId = searchParams.get("facilityTypeId");
    const searchQuery = searchParams.get("search");

    console.log("Facilities API: Filter params:", {
      districtId,
      facilityTypeId,
      searchQuery,
    });

    // If an explicit ID is provided, return that single facility
    if (id) {
      console.log("Facilities API: Fetch by id:", id);
      const facility = await prisma.facility.findUnique({
        where: { id },
        include: {
          facility_type: true,
          district: true,
        },
      });

      if (!facility) {
        return NextResponse.json({ error: "Facility not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: facility });
    }

    // Build where clause for filtering
    const where: any = {};

    if (districtId) {
      where.district_id = districtId;
    }

    if (facilityTypeId) {
      where.facility_type_id = facilityTypeId;
    }

    if (searchQuery) {
      where.name = {
        contains: searchQuery,
        mode: "insensitive" as any,
      };
    }

    console.log("Facilities API: User authorized, fetching facilities");
    const facilities = await prisma.facility.findMany({
      where,
      include: {
        facility_type: true,
        district: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log("Facilities API: Found facilities:", facilities.length);
    return NextResponse.json({
      success: true,
      data: facilities,
    });
  } catch (error: any) {
    console.error("Error fetching facilities:", error);
    return NextResponse.json(
      { error: "Failed to fetch facilities", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      district_id, 
      facility_type_id, 
      description,
      parent_facility_id,
      has_clinic 
    } = body;

    if (!name || !district_id || !facility_type_id) {
      return NextResponse.json(
        { error: "Facility name, district, and facility type are required" },
        { status: 400 }
      );
    }

    const createData: any = {
      name,
      display_name: name,
      district: {
        connect: { id: district_id }
      },
      facility_type: {
        connect: { id: facility_type_id }
      },
      updated_at: new Date(),
    };

    // Add optional fields if provided
    if (description) createData.description = description;
    
    // Handle parent_facility_id (empty string should be null)
    if (parent_facility_id && parent_facility_id !== "") {
      createData.parent_facility = {
        connect: { id: parent_facility_id }
      };
    }
    
    // Handle has_clinic boolean (default to false if not provided)
    createData.has_clinic = Boolean(has_clinic);

    const facility = await prisma.facility.create({
      data: createData,
      include: {
        district: true,
        facility_type: true,
      },
    });

    return NextResponse.json(facility, { status: 201 });
  } catch (error) {
    console.error("Error creating facility:", error);
    return NextResponse.json(
      { error: "Failed to create facility" },
      { status: 500 }
    );
  }
}
