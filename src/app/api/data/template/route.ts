import { NextRequest, NextResponse } from "next/server";
import { excelTemplateGenerator } from "@/lib/excel-template";
import * as XLSX from "xlsx";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      reportMonth,
      districtId,
      facilityIds,
      includeSubCentres = true,
    } = body;

    if (!reportMonth) {
      return NextResponse.json(
        { error: "Report month is required" },
        { status: 400 }
      );
    }

    // Validate reportMonth format (YYYY-MM)
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(reportMonth)) {
      return NextResponse.json(
        { error: "Report month must be in YYYY-MM format" },
        { status: 400 }
      );
    }

    // Generate template
    const workbook = await excelTemplateGenerator.generateTemplate({
      reportMonth,
      districtId: districtId ? parseInt(districtId) : undefined,
      facilityIds: facilityIds?.map((id: string) => parseInt(id)),
      includeSubCentres,
    });

    // Convert workbook to buffer
    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Create filename
    const filename = `health_data_template_${reportMonth}${
      districtId ? `_district_${districtId}` : ""
    }.xlsx`;

    // Return file as download
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Template generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate template",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportMonth = searchParams.get("reportMonth");
    const districtId = searchParams.get("districtId");
    const facilityIds = searchParams.get("facilityIds")?.split(",");
    const includeSubCentres = searchParams.get("includeSubCentres") !== "false";

    if (!reportMonth) {
      return NextResponse.json(
        { error: "Report month is required" },
        { status: 400 }
      );
    }

    // Generate template
    const workbook = await excelTemplateGenerator.generateTemplate({
      reportMonth,
      districtId: districtId ? parseInt(districtId) : undefined,
      facilityIds: facilityIds?.map((id) => parseInt(id)),
      includeSubCentres,
    });

    // Convert workbook to buffer
    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Create filename
    const filename = `health_data_template_${reportMonth}${
      districtId ? `_district_${districtId}` : ""
    }.xlsx`;

    // Return file as download
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Template generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate template",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
