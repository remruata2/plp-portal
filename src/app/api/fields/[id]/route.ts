import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../../src/generated/prisma";

const prisma = new PrismaClient();

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
  } catch (error) {
    console.error("Error updating field:", error);
    return NextResponse.json(
      { error: "Failed to update field" },
      { status: 500 }
    );
  }
}
