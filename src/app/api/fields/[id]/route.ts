import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const body = await request.json();

		const updatedField = await prisma.field.update({
			where: { id: parseInt(id) },
			data: body,
		});

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
