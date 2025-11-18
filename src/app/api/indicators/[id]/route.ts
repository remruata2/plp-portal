import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { UserRole } from "@/types/user";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const indicator = await prisma.indicator.findUnique({
      where: { id: parseInt(id) },
      include: {
        numerator_field: true,
        denominator_field: true,
        target_field: true,
      },
    });

    if (!indicator) {
      return NextResponse.json(
        { error: "Indicator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(indicator);
  } catch (error) {
    console.error("Error fetching indicator:", error);
    return NextResponse.json(
      { error: "Failed to fetch indicator" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
		const {
			code,
			name,
			description,
			type,
			structure,
			target_type,
			formula_config,
			applicable_facility_types,
			numerator_field_id,
			denominator_field_id,
			numerator_label,
			denominator_label,
			target_field_id,
			target_value,
			target_formula,
			conditions,
		} = body;

    if (!name) {
      return NextResponse.json(
        { error: "Indicator name is required" },
        { status: 400 }
      );
    }

    const indicator = await prisma.indicator.update({
      where: { id: parseInt(id) },
      data: {
        code: code || undefined,
        name,
        description,
        type,
        structure,
        target_type,
				formula_config: (() => {
					if (typeof formula_config === "string") {
						try {
							return JSON.parse(formula_config);
						} catch (error) {
							console.error("Error parsing formula_config:", error);
							return {};
						}
					}
					return formula_config || {};
				})(),
				applicable_facility_types: Array.isArray(applicable_facility_types)
					? applicable_facility_types
					: [],
				numerator_field_id: numerator_field_id
					? parseInt(numerator_field_id)
					: null,
				denominator_field_id: denominator_field_id
					? parseInt(denominator_field_id)
					: null,
				numerator_label: numerator_label || null,
				denominator_label: denominator_label || null,
				target_field_id: target_field_id ? parseInt(target_field_id) : null,
				target_value: target_value || null,
				target_formula: target_formula || null,
				conditions: conditions || null,
      },
      include: {
        numerator_field: true,
        denominator_field: true,
        target_field: true,
      },
    });

    return NextResponse.json(indicator);
  } catch (error: any) {
    console.error("Error updating indicator:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Indicator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update indicator" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
	const session = await getServerSession(authOptions);
	if (session?.user?.role !== UserRole.admin) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

  try {
    const { id } = await params;
		const indicatorId = parseInt(id);

		// Check if indicator is being used in FacilityTarget
		const facilityTargetCount = await prisma.facility_target.count({
			where: { indicator_id: indicatorId },
		});

		// Check if indicator is being used in IndicatorRemuneration
		const indicatorRemunerationCount = await prisma.indicator_remuneration.count(
			{
				where: { indicator_id: indicatorId },
			}
		);

		// Check if indicator is being used in FacilityRemunerationRecord
		const facilityRemunerationCount =
			await prisma.facilityRemunerationRecord.count({
				where: { indicator_id: indicatorId },
			});

		// Check if indicator is being used in IndicatorWorkerAllocation
		// Note: This has onDelete: Cascade, so it will be auto-deleted, but we check for info
		const indicatorWorkerAllocationCount =
			await prisma.indicator_worker_allocation.count({
				where: { indicator_id: indicatorId },
    });

		// Block deletion if indicator is used in critical tables (worker allocations cascade, so they're OK)
		if (
			facilityTargetCount > 0 ||
			indicatorRemunerationCount > 0 ||
			facilityRemunerationCount > 0
		) {
      return NextResponse.json(
				{
					error: "Cannot delete indicator that is being used",
					details: {
						facilityTargets: facilityTargetCount,
						indicatorRemunerations: indicatorRemunerationCount,
						facilityRemunerationRecords: facilityRemunerationCount,
						indicatorWorkerAllocations: indicatorWorkerAllocationCount, // Info only - will cascade
					},
				},
        { status: 400 }
      );
    }

    await prisma.indicator.delete({
			where: { id: indicatorId },
    });

    return NextResponse.json({ message: "Indicator deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting indicator:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Indicator not found" },
        { status: 404 }
      );
    }

		// Handle foreign key constraint errors
		if (error?.code === "P2003") {
			return NextResponse.json(
				{
					error: "Cannot delete indicator that is being used by other records",
				},
				{ status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete indicator" },
      { status: 500 }
    );
  }
}
