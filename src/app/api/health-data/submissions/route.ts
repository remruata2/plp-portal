import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const facilityId = searchParams.get("facilityId");

    if (!facilityId) {
      return NextResponse.json(
        { error: "facilityId is required" },
        { status: 400 }
      );
    }

    // Get existing field value submissions for this facility
    const submissions = await prisma.fieldValue.findMany({
      where: {
        facility_id: facilityId,
      },
      select: {
        report_month: true,
        created_at: true,
      },
      distinct: ['report_month'],
      orderBy: {
        report_month: 'desc',
      },
    });

    // Also check for remuneration records (alternative submission tracking)
    const remunerationSubmissions = await prisma.facilityRemunerationRecord.findMany({
      where: {
        facility_id: facilityId,
      },
      select: {
        report_month: true,
        calculation_date: true,
      },
      distinct: ['report_month'],
      orderBy: {
        report_month: 'desc',
      },
    });

    // Combine and deduplicate submissions
    const allSubmissions = new Map();
    
    submissions.forEach(sub => {
      allSubmissions.set(sub.report_month, {
        report_month: sub.report_month,
        submission_date: sub.created_at,
        type: 'field_value'
      });
    });

    remunerationSubmissions.forEach(sub => {
      if (!allSubmissions.has(sub.report_month)) {
        allSubmissions.set(sub.report_month, {
          report_month: sub.report_month,
          submission_date: sub.calculation_date,
          type: 'remuneration_record'
        });
      }
    });

    const uniqueSubmissions = Array.from(allSubmissions.values())
      .sort((a, b) => b.report_month.localeCompare(a.report_month));

    return NextResponse.json({
      submissions: uniqueSubmissions,
      count: uniqueSubmissions.length,
    });

  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}