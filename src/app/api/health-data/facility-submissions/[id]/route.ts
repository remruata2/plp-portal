import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";
import { canFacilityEditSubmission } from "@/lib/submission-deadline";

const prisma = new PrismaClient();

// GET - Get a specific submission by ID for facilities to edit
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Only facility users can access this endpoint
		if (session.user.role !== "facility") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { id } = await params;

		// Handle the case where the ID contains facility_id-report_month format
		const match = id.match(/^(.*)-(\d{4}-\d{2})$/);

		if (!match) {
			return NextResponse.json(
				{ error: "Invalid submission ID" },
				{ status: 400 }
			);
		}

		const facilityId = match[1];
		const reportMonth = match[2];

		if (!facilityId || !reportMonth) {
			return NextResponse.json(
				{ error: "Invalid submission ID" },
				{ status: 400 }
			);
		}

		// Check if user has access to this facility
		const userFacility = await prisma.user.findUnique({
			where: { id: parseInt(session.user.id) },
			include: { facility: true },
		});

		if (!userFacility?.facility || userFacility.facility.id !== facilityId) {
			return NextResponse.json(
				{ error: "Access denied to this facility" },
				{ status: 403 }
			);
		}

		// Check if submission can be edited based on deadline
		const editability = await canFacilityEditSubmission(reportMonth);
		if (!editability.canEdit) {
			return NextResponse.json(
				{
					error: "Submission cannot be edited",
					reason: editability.reason,
				},
				{ status: 400 }
			);
		}

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

		if (fieldValues.length === 0) {
			return NextResponse.json(
				{ error: "Submission not found" },
				{ status: 404 }
			);
		}

		// Format the response for editing
		const submission = {
			id: `${facilityId}-${reportMonth}`,
			facilityId: facilityId,
			facilityName: fieldValues[0].facility.name,
			facilityType: fieldValues[0].facility.facility_type.name,
			reportMonth: reportMonth,
			submittedAt: fieldValues[0].created_at,
			canEdit: editability.canEdit,
			editDeadline: editability.deadlineDate,
			fieldValues: fieldValues.map((fv) => ({
				id: fv.id,
				fieldId: fv.field_id,
				fieldCode: fv.field.code,
				fieldName: fv.field.name,
				fieldType: fv.field.field_type,
				fieldCategory: fv.field.field_category,
				value:
					fv.numeric_value !== null
						? fv.numeric_value
						: fv.string_value !== null
						? fv.string_value
						: fv.boolean_value !== null
						? fv.boolean_value
						: fv.json_value,
				description: fv.field.description || "",
				remarks: fv.remarks,
			})),
		};

		return NextResponse.json({ submission });
	} catch (error) {
		console.error("Error fetching facility submission:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// PUT - Update a submission by a facility
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Only facility users can access this endpoint
		if (session.user.role !== "facility") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { id } = await params;

		// Handle the case where the ID contains facility_id-report_month format
		const match = id.match(/^(.*)-(\d{4}-\d{2})$/);

		if (!match) {
			return NextResponse.json(
				{ error: "Invalid submission ID" },
				{ status: 400 }
			);
		}

		const facilityId = match[1];
		const reportMonth = match[2];

		if (!facilityId || !reportMonth) {
			return NextResponse.json(
				{ error: "Invalid submission ID" },
				{ status: 400 }
			);
		}

		// Check if user has access to this facility
		const userFacility = await prisma.user.findUnique({
			where: { id: parseInt(session.user.id) },
			include: { facility: true },
		});

		if (!userFacility?.facility || userFacility.facility.id !== facilityId) {
			return NextResponse.json(
				{ error: "Access denied to this facility" },
				{ status: 403 }
			);
		}

		// Check if submission can be edited based on deadline
		const editability = await canFacilityEditSubmission(reportMonth);
		if (!editability.canEdit) {
			return NextResponse.json(
				{
					error: "Submission cannot be edited",
					reason: editability.reason,
				},
				{ status: 400 }
			);
		}

		const body = await request.json();
		const { fieldValues } = body;

		if (!fieldValues || !Array.isArray(fieldValues)) {
			return NextResponse.json(
				{ error: "Invalid field values" },
				{ status: 400 }
			);
		}

		// Update each field value
		const updatePromises = fieldValues.map(async (fieldValue: any) => {
			// Determine which value field to update based on the field type
			const updateData: any = {
				updated_at: new Date(),
			};

			if (typeof fieldValue.value === "number") {
				updateData.numeric_value = fieldValue.value;
				updateData.string_value = null;
				updateData.boolean_value = null;
				updateData.json_value = null;
			} else if (typeof fieldValue.value === "boolean") {
				updateData.boolean_value = fieldValue.value;
				updateData.numeric_value = null;
				updateData.string_value = null;
				updateData.json_value = null;
			} else if (typeof fieldValue.value === "string") {
				updateData.string_value = fieldValue.value;
				updateData.numeric_value = null;
				updateData.boolean_value = null;
				updateData.json_value = null;
			} else if (typeof fieldValue.value === "object") {
				updateData.json_value = fieldValue.value;
				updateData.numeric_value = null;
				updateData.string_value = null;
				updateData.boolean_value = null;
			}

			// Add remarks if provided
			if (fieldValue.remarks !== undefined) {
				updateData.remarks = fieldValue.remarks;
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
			updatedAt: new Date(),
		});
	} catch (error) {
		console.error("Error updating facility submission:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// DELETE - Delete a submission by a facility
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Only facility users can access this endpoint
		if (session.user.role !== "facility") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { id } = await params;

		// Handle the case where the ID contains facility_id-report_month format
		const match = id.match(/^(.*)-(\d{4}-\d{2})$/);

		if (!match) {
			return NextResponse.json(
				{ error: "Invalid submission ID" },
				{ status: 400 }
			);
		}

		const facilityId = match[1];
		const reportMonth = match[2];

		if (!facilityId || !reportMonth) {
			return NextResponse.json(
				{ error: "Invalid submission ID" },
				{ status: 400 }
			);
		}

		// Check if user has access to this facility
		const userFacility = await prisma.user.findUnique({
			where: { id: parseInt(session.user.id) },
			include: { facility: true },
		});

		if (!userFacility?.facility || userFacility.facility.id !== facilityId) {
			return NextResponse.json(
				{ error: "Access denied to this facility" },
				{ status: 403 }
			);
		}

		// Check if submission can be deleted based on deadline
		const editability = await canFacilityEditSubmission(reportMonth);
		if (!editability.canEdit) {
			return NextResponse.json(
				{
					error: "Submission cannot be deleted",
					reason: editability.reason,
				},
				{ status: 400 }
			);
		}

		// Get facility name for logging
		const facility = await prisma.facility.findUnique({
			where: { id: facilityId },
			select: { name: true },
		});

		console.log(
			`🗑️ Facility ${
				facility?.name || facilityId
			} deleting submission for ${reportMonth}`
		);

		// Use a transaction to ensure all deletions succeed or fail together
		const deleteResult = await prisma.$transaction(async (tx) => {
			let totalDeletedCount = 0;
			const breakdown: Record<string, number> = {};

			// 1. Delete all field values for this facility and report month
			const fieldValueResult = await tx.fieldValue.deleteMany({
				where: {
					facility_id: facilityId,
					report_month: reportMonth,
				},
			});
			totalDeletedCount += fieldValueResult.count;
			breakdown.fieldValues = fieldValueResult.count;
			console.log(`  📊 Deleted ${fieldValueResult.count} field values`);

			// 2. Delete remuneration calculations for this facility and report month
			const remunerationCalculationResult =
				await tx.remunerationCalculation.deleteMany({
					where: {
						facility_id: facilityId,
						report_month: reportMonth,
					},
				});
			totalDeletedCount += remunerationCalculationResult.count;
			breakdown.remunerationCalculations = remunerationCalculationResult.count;
			console.log(
				`  💰 Deleted ${remunerationCalculationResult.count} remuneration calculations`
			);

			// 3. Delete worker remunerations for this facility and report month
			const workerRemunerationResult = await tx.workerRemuneration.deleteMany({
				where: {
					facility_id: facilityId,
					report_month: reportMonth,
				},
			});
			totalDeletedCount += workerRemunerationResult.count;
			breakdown.workerRemunerations = workerRemunerationResult.count;
			console.log(
				`  👥 Deleted ${workerRemunerationResult.count} worker remunerations`
			);

			// 4. Delete facility remuneration records for this facility and report month
			const facilityRemunerationResult =
				await tx.facilityRemunerationRecord.deleteMany({
					where: {
						facility_id: facilityId,
						report_month: reportMonth,
					},
				});
			totalDeletedCount += facilityRemunerationResult.count;
			breakdown.facilityRemunerationRecords = facilityRemunerationResult.count;
			console.log(
				`  🏥 Deleted ${facilityRemunerationResult.count} facility remuneration records`
			);

			// 5. Delete facility targets for this facility and report month
			const facilityTargetResult = await tx.facilityTarget.deleteMany({
				where: {
					facility_id: facilityId,
					report_month: reportMonth,
				},
			});
			totalDeletedCount += facilityTargetResult.count;
			breakdown.facilityTargets = facilityTargetResult.count;
			console.log(
				`  🎯 Deleted ${facilityTargetResult.count} facility targets`
			);

			return { totalDeletedCount, breakdown };
		});

		console.log(
			`✅ Successfully deleted submission. Total records removed: ${deleteResult.totalDeletedCount}`
		);

		return NextResponse.json({
			message: "Submission deleted successfully",
			totalDeletedCount: deleteResult.totalDeletedCount,
			breakdown: deleteResult.breakdown,
			deletedAt: new Date(),
		});
	} catch (error) {
		console.error("Error deleting facility submission:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
