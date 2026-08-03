import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const body = await request.json();

		const { facilityTypeIds, ...fieldData } = body;
		const fieldId = parseInt(id, 10);

		const updatedField = await prisma.field.update({
			where: { id: fieldId },
			data: fieldData,
		});

		// Update facility_field_mapping if facilityTypeIds array is passed
		if (Array.isArray(facilityTypeIds)) {
			// Fetch existing mappings for this field to preserve group_id and conditional settings
			const existingMappings = await prisma.facility_field_mapping.findMany({
				where: { field_id: fieldId },
			});

			const existingMap = new Map<
				string,
				{
					group_id: number | null;
					parent_field_id: number | null;
					show_on_value: string | null;
				}
			>();

			existingMappings.forEach((m) => {
				existingMap.set(m.facility_type_id, {
					group_id: m.group_id,
					parent_field_id: m.parent_field_id,
					show_on_value: m.show_on_value,
				});
			});

			// Delete existing mappings for this field
			await prisma.facility_field_mapping.deleteMany({
				where: { field_id: fieldId },
			});

			// Re-create mappings for selected facility types (excluding "none")
			const validFacilityTypeIds = facilityTypeIds.filter(
				(typeId: string) => typeId && typeId !== "none"
			);

			if (validFacilityTypeIds.length > 0) {
				const mappingData = validFacilityTypeIds.map((facTypeId: string) => {
					const existing = existingMap.get(facTypeId);
					return {
						facility_type_id: facTypeId,
						field_id: fieldId,
						is_required: false,
						display_order: 999,
						group_id: existing?.group_id ?? null,
						parent_field_id: existing?.parent_field_id ?? null,
						show_on_value: existing?.show_on_value ?? null,
						updated_at: new Date(),
					};
				});

				await prisma.facility_field_mapping.createMany({
					data: mappingData,
				});
			}
		}

		return NextResponse.json(updatedField);
	} catch (error: any) {
		console.error("Error updating field:", error);

		// Handle unique constraint violation (duplicate code)
		if (error?.code === "P2002") {
			return NextResponse.json(
				{ error: "A field with this code already exists" },
				{ status: 400 }
			);
		}

		// Handle record not found
		if (error?.code === "P2025") {
			return NextResponse.json({ error: "Field not found" }, { status: 404 });
		}

		return NextResponse.json(
			{ error: "Failed to update field" },
			{ status: 500 }
		);
	}
}
