import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../../src/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facility_type_id: string }> }
) {
  try {
    const { facility_type_id } = await params;

    if (!facility_type_id) {
      return NextResponse.json(
        { error: "Facility type ID is required" },
        { status: 400 }
      );
    }

    const facilityTypeRemuneration =
      await prisma.facilityTypeRemuneration.findUnique({
        where: { facility_type_id },
        include: {
          indicator_remunerations: {
            include: {
              indicator: true,
            },
          },
        },
      });

    if (!facilityTypeRemuneration) {
      return NextResponse.json({ data: [] });
    }

    const configs = facilityTypeRemuneration.indicator_remunerations.map(
      (ir) => ({
        indicator_id: ir.indicator_id,
        facility_type_id,
        with_tb_patients: Number(ir.base_amount),
        without_tb_patients: Number(ir.conditional_amount || 0),
        indicator: ir.indicator,
      })
    );

    return NextResponse.json({ data: configs });
  } catch (error) {
    console.error("Error fetching remuneration configurations:", error);
    return NextResponse.json(
      { error: "Failed to fetch remuneration configurations" },
      { status: 500 }
    );
  }
}
