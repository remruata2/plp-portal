import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";



export async function GET(_request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== "admin") {
			return NextResponse.json(
				{ error: "Unauthorized - Admin access required" },
				{ status: 401 }
			);
		}

		// Prefer remunerationCalculation months, but include performance and raw submissions months too
		    const rcMonths = await prisma.remunerationCalculation.findMany({
        select: { report_month: true },
        distinct: ["report_month"],
        orderBy: { report_month: "desc" },
        take: 120,
    });

		    const frMonths = await prisma.facilityRemunerationRecord.findMany({
        select: { report_month: true },
        distinct: ["report_month"],
        orderBy: { report_month: "desc" },
        take: 120,
    });
		    const fvMonths = await prisma.fieldValue.findMany({
        select: { report_month: true },
        distinct: ["report_month"],
        orderBy: { report_month: "desc" },
        take: 120,
    });

		        let months = rcMonths
            .map((r) => r.report_month as string)
            .concat(frMonths.map((r) => r.report_month as string))
            .concat(fvMonths.map((r) => r.report_month as string))
            .filter((m): m is string => typeof m === "string" && m.length > 0);

		// Ensure sorted unique list (desc)
		const unique = Array.from(new Set(months)).sort((a, b) =>
			b.localeCompare(a)
		);

		return NextResponse.json({ months: unique });
	} catch (error) {
		console.error("Error fetching available months:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
