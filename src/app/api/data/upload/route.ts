import { NextRequest, NextResponse } from "next/server";
import { dataUploadProcessor } from "@/lib/excel-template";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const reportMonth = formData.get("reportMonth") as string;
    const uploadedBy = parseInt(formData.get("uploadedBy") as string);

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!reportMonth) {
      return NextResponse.json(
        { error: "Report month is required" },
        { status: 400 }
      );
    }

    if (!uploadedBy) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls") &&
      !file.name.endsWith(".csv")
    ) {
      return NextResponse.json(
        {
          error:
            "Only Excel files (.xlsx, .xls) and CSV files (.csv) are allowed",
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Process the uploaded file
    const result = await dataUploadProcessor.processUploadedFile(
      fileBuffer,
      reportMonth,
      uploadedBy,
      file.name
    );

    return NextResponse.json({
      success: true,
      message: "File processed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to process upload",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get upload session status
    const { PrismaClient } = await import("@/generated/prisma");
    const prisma = new PrismaClient();

    const session = await prisma.dataUploadSession.findUnique({
      where: { id: parseInt(sessionId) },
      include: {
        uploader: {
          select: { username: true },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Session query error:", error);
    return NextResponse.json(
      { error: "Failed to get session status" },
      { status: 500 }
    );
  }
}
