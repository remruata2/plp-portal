import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET - Get a specific submission by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("GET request received for submission");
    
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      console.log("User is not admin:", session.user.role);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    console.log("Received ID:", id);
    
    // Handle the case where the ID contains facility_id-report_month format
    // The format is: facility_id-report_month (e.g., cmdxyc98q000x1fnnunjuj8nv-2025-08)
    // We need to find the last occurrence of YYYY-MM pattern
    const match = id.match(/^(.*)-(\d{4}-\d{2})$/);
    
    if (!match) {
      console.log("Invalid submission ID format - no YYYY-MM pattern found");
      return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 });
    }
    
    const facilityId = match[1];
    const reportMonth = match[2];
    
    console.log("Parsed facilityId and reportMonth:", { facilityId, reportMonth });

    if (!facilityId || !reportMonth) {
      console.log("Invalid submission ID format - missing facilityId or reportMonth");
      return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 });
    }

    console.log("Looking for submission:", { facilityId, reportMonth });

    // Get all field values for this facility and report month
    const fieldValues = await prisma.fieldValue.findMany({
      where: {
        facility_id: facilityId,
        report_month: reportMonth,
        field: {
          is_active: true,
        },
      },
      include: {
        field: true,
        facility: {
          include: {
            facility_type: true,
          },
        },
      },
      orderBy: [
        { field: { field_category: "asc" } },
        { field: { name: "asc" } },
      ],
    });

    console.log("Found field values:", fieldValues.length);
    if (fieldValues.length > 0) {
      console.log("First field value:", {
        id: fieldValues[0].id,
        facility_id: fieldValues[0].facility_id,
        report_month: fieldValues[0].report_month,
        field_code: fieldValues[0].field.code,
      });
    }

    if (fieldValues.length === 0) {
      // Let's check if the facility exists
      const facility = await prisma.facility.findUnique({
        where: { id: facilityId },
        include: {
          facility_type: true,
        },
      });

      if (!facility) {
        return NextResponse.json({ error: "Facility not found" }, { status: 404 });
      }

      return NextResponse.json({ 
        error: "No submissions found for this facility and month",
        facility: {
          id: facility.id,
          name: facility.name,
          facilityType: facility.facility_type.name,
        },
        reportMonth 
      }, { status: 404 });
    }

    // Group field values by category
    const fieldValuesByCategory = fieldValues.reduce((acc, fieldValue) => {
      const category = fieldValue.field.field_category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      
      // Extract the actual value based on field type
      let value: string | number | boolean | null = null;
      if (fieldValue.numeric_value !== null) {
        value = Number(fieldValue.numeric_value);
      } else if (fieldValue.string_value !== null) {
        value = fieldValue.string_value;
      } else if (fieldValue.boolean_value !== null) {
        value = fieldValue.boolean_value;
      } else if (fieldValue.json_value !== null) {
        value = fieldValue.json_value as any;
      }
      
      acc[category].push({
        id: fieldValue.id,
        fieldId: fieldValue.field_id,
        fieldCode: fieldValue.field.code,
        fieldName: fieldValue.field.name,
        value: value,
        fieldType: fieldValue.field.field_type,
        description: fieldValue.field.description,
      });
      return acc;
    }, {} as Record<string, any[]>);

    const submission = {
      id,
      facilityId,
      facilityName: fieldValues[0].facility?.name || "Unknown Facility",
      facilityType: fieldValues[0].facility?.facility_type?.name || "Unknown Type",
      reportMonth,
      submittedAt: fieldValues[0].created_at,
      status: "submitted",
      fieldValues: fieldValuesByCategory,
    };

    return NextResponse.json({ submission });
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a submission
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    
    // Handle the case where the ID contains facility_id-report_month format
    const match = id.match(/^(.*)-(\d{4}-\d{2})$/);
    
    if (!match) {
      return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 });
    }
    
    const facilityId = match[1];
    const reportMonth = match[2];

    if (!facilityId || !reportMonth) {
      return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 });
    }

    const body = await request.json();
    const { fieldValues } = body;

    if (!fieldValues || !Array.isArray(fieldValues)) {
      return NextResponse.json({ error: "Invalid field values" }, { status: 400 });
    }

    // Update each field value
    const updatePromises = fieldValues.map(async (fieldValue: any) => {
      // Determine which value field to update based on the field type
      const updateData: any = {
        updated_at: new Date(),
      };

      if (typeof fieldValue.value === 'number') {
        updateData.numeric_value = fieldValue.value;
      } else if (typeof fieldValue.value === 'boolean') {
        updateData.boolean_value = fieldValue.value;
      } else if (typeof fieldValue.value === 'string') {
        updateData.string_value = fieldValue.value;
      } else if (typeof fieldValue.value === 'object') {
        updateData.json_value = fieldValue.value;
      }

      return prisma.fieldValue.update({
        where: {
          id: fieldValue.id,
        },
        data: updateData,
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ 
      message: "Submission updated successfully",
      submissionId: id 
    });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    
    // Handle the case where the ID contains facility_id-report_month format
    const match = id.match(/^(.*)-(\d{4}-\d{2})$/);
    
    if (!match) {
      return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 });
    }
    
    const facilityId = match[1];
    const reportMonth = match[2];

    if (!facilityId || !reportMonth) {
      return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 });
    }

    // Delete all field values for this facility and report month
    const deleteResult = await prisma.fieldValue.deleteMany({
      where: {
        facility_id: facilityId,
        report_month: reportMonth,
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Submission deleted successfully",
      deletedCount: deleteResult.count 
    });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
