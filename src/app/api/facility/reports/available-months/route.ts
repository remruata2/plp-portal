import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log("Available months API: Request received");
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log("Available months API: No session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const facilityId = session.user.facility_id;
    console.log("Available months API: Facility ID:", facilityId);

    if (!facilityId) {
      console.log("Available months API: No facility assigned");
      return NextResponse.json(
        { error: "No facility assigned" },
        { status: 400 }
      );
    }

    // Get all months where the facility has submitted data
    const fieldValues = await prisma.fieldValue.findMany({
      where: {
        facility_id: facilityId,
      },
      select: {
        report_month: true,
      },
      distinct: ["report_month"],
      orderBy: {
        report_month: "desc",
      },
    });

    console.log(
      "Available months API: Found field values:",
      fieldValues.length
    );
    console.log("Available months API: Field values:", fieldValues);

    const months = fieldValues.map((fv) => fv.report_month);
    console.log("Available months API: Returning months:", months);

    return NextResponse.json({
      months,
    });
  } catch (error) {
    console.error("Error getting available months:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
