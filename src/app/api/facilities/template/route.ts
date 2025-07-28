import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const facilities = await db.facility.findMany({
      include: {
        district: true,
        facility_type: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    let csv = 'facility_code,name,district,type\n';
    facilities.forEach(facility => {
      const districtName = facility.district?.name || '';
      const typeName = facility.facility_type?.name || '';
      csv += `${facility.facility_code},"${facility.name}","${districtName}","${typeName}"\n`;
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="facilities-template.csv"',
      },
    });

  } catch (error) {
    console.error('Failed to generate facilities template:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate template' }, { status: 500 });
  }
}
