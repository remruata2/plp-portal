import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Indicator, Facility } from "@/generated/prisma";

export async function GET() {
  try {
    // Get all active simple indicators to be used as columns
    const indicators = await db.indicator.findMany({
      where: { type: 'simple' },
      orderBy: { code: 'asc' },
    });

    // Get all facilities to be used as rows
    const facilities = await db.facility.findMany({
      orderBy: { name: 'asc' },
    });

    // Create CSV headers using indicator codes
    const indicatorHeaders = indicators.map((i: Indicator) => `"${i.code}"`);
    const headers = ['"facility_code"', '"facility_name"', ...indicatorHeaders];

    // Create sample rows for all facilities
    const sampleRows = facilities.map((facility: Facility) => {
      // Create a placeholder for each indicator value
      const indicatorValues = indicators.map(() => '0'); // Default value of 0
      return [
        `"${facility.facility_code}"`,
        `"${facility.name}"`,
        ...indicatorValues,
      ].join(',');
    });

    const csvRows = [headers.join(','), ...sampleRows];
    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="health-data-template.csv"',
      },
    });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}
