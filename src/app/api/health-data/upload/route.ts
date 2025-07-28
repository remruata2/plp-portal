import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import * as XLSX from "xlsx";
import { promises as fs } from "fs";
import path from "path";

const prisma = new PrismaClient();

// Main function to handle the POST request
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const reportMonth = formData.get("reportMonth") as string;

    if (!file || !reportMonth) {
      return NextResponse.json(
        { success: false, error: "File and report month are required" },
        { status: 400 }
      );
    }

    // 1. Save file to a temporary location
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempDir = path.join(process.cwd(), "temp");
    await fs.mkdir(tempDir, { recursive: true });
    const tempFilePath = path.join(tempDir, `${Date.now()}-${file.name}`);
    await fs.writeFile(tempFilePath, buffer);

    // 2. Create a session record in the DB
    const uploadedBy = 1; // TODO: Get user from session
    const session = await prisma.dataUploadSession.create({
      data: {
        file_name: file.name,
        file_path: tempFilePath,
        report_month: reportMonth,
        uploaded_by: uploadedBy,
        status: "PROCESSING",
        total_records: 0,
      },
    });

    // 3. Trigger background processing (fire-and-forget)
    processFileInBackground(session.id);

    // 4. Immediately return the session ID
    return NextResponse.json({
      success: true,
      data: { sessionId: session.id },
    });
  } catch (error: any) {
    console.error("[UPLOAD_API] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}

// NOTE: In a production environment, this should be handled by a dedicated job queue (e.g., BullMQ, RabbitMQ).
async function processFileInBackground(sessionId: number) {
  const prisma = new PrismaClient(); // New Prisma client for this scope

  try {
    const session = await prisma.dataUploadSession.findUnique({
      where: { id: sessionId },
    });
    if (!session || !session.file_path) {
      throw new Error(
        `Session or file path not found for session ID: ${sessionId}`
      );
    }

    // Update status to PROCESSING
    await prisma.dataUploadSession.update({
      where: { id: sessionId },
      data: { status: "PROCESSING" },
    });

    const buffer = await fs.readFile(session.file_path);
    const rows = parseFile(buffer, session.file_name);

    if (!rows || rows.length === 0) {
      throw new Error("No data found in file");
    }

    const indicators = await prisma.indicator.findMany({
      where: { type: "simple" },
      select: { id: true, code: true }, // Select only necessary fields
    });

    // The template uses indicator CODES as headers. Match against them.
    // Using a Map for efficient lookup, matching case-insensitively.
    const indicatorMap = new Map(
      indicators.map((i) => [i.code.toLowerCase(), i])
    );

    const errors: any[] = [];
    const dataToUpsert: any[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;
      const facilityCode = row.facility_code?.toString().trim();

      if (!facilityCode) {
        errors.push({ row: rowNumber, error: "Missing facility_code" });
        continue;
      }

      const facility = await prisma.facility.findUnique({
        where: { facility_code: facilityCode },
      });

      if (!facility) {
        errors.push({
          row: rowNumber,
          error: `Facility with code '${facilityCode}' not found`,
        });
        continue;
      }

      for (const header in row) {
        const trimmedHeader = header.trim();
        if (
          ["facility_code", "facility_name"].includes(
            trimmedHeader.toLowerCase()
          )
        )
          continue;

        // Match header against indicator code (case-insensitive)
        const indicator = indicatorMap.get(trimmedHeader.toLowerCase());

        if (indicator) {
          const value = parseFloat(row[header]);
          if (isNaN(value)) {
            errors.push({
              row: rowNumber,
              error: `Invalid value for indicator '${header}': '${row[header]}'`,
            });
            continue;
          }

          dataToUpsert.push(
            prisma.monthlyHealthData.upsert({
              where: {
                facility_id_sub_centre_id_indicator_id_report_month: {
                  facility_id: facility.id,
                  sub_centre_id: null as any,
                  indicator_id: indicator.id,
                  report_month: session.report_month,
                },
              },
              update: {
                value,
                uploaded_by: session.uploaded_by,
                data_quality: "PENDING",
              },
              create: {
                indicator_id: indicator.id,
                facility_id: facility.id,
                district_id: facility.district_id,
                sub_centre_id: null as any,
                report_month: session.report_month,
                value,
                uploaded_by: session.uploaded_by,
                data_quality: "PENDING",
              },
            })
          );
        }
      }
    }

    let successCount = 0;
    if (dataToUpsert.length > 0) {
      const result = await prisma.$transaction(dataToUpsert);
      successCount = result.length;
    }

    await prisma.dataUploadSession.update({
      where: { id: sessionId },
      data: {
        total_records: rows.length,
        success_count: successCount,
        error_count: errors.length,
        status: errors.length > 0 ? "FAILED" : "COMPLETED",
        upload_summary: { errors },
        completed_at: new Date(),
      },
    });
  } catch (e: any) {
    console.error(
      `[BACKGROUND_PROCESS] Error processing session ${sessionId}:`,
      e
    );
    await prisma.dataUploadSession.update({
      where: { id: sessionId },
      data: {
        status: "FAILED",
        upload_summary: {
          errors: [{ row: "N/A", error: `Processing failed: ${e.message}` }],
        },
        completed_at: new Date(),
      },
    });
  } finally {
    // Clean up the temporary file
    const session = await prisma.dataUploadSession.findUnique({
      where: { id: sessionId },
    });
    if (session?.file_path) {
      try {
        await fs.unlink(session.file_path);
      } catch (unlinkError) {
        console.error(
          `Failed to delete temp file ${session.file_path}:`,
          unlinkError
        );
      }
    }
    await prisma.$disconnect();
  }
}

function parseFile(buffer: Buffer, filename: string): any[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}
