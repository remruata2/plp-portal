import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../src/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { facility_type_id, configs } = body;

    if (!facility_type_id || !configs || !Array.isArray(configs)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Get or create facility type remuneration
    let facilityTypeRemuneration =
      await prisma.facilityTypeRemuneration.findUnique({
        where: { facility_type_id },
      });

    if (!facilityTypeRemuneration) {
      // Create new facility type remuneration
      facilityTypeRemuneration = await prisma.facilityTypeRemuneration.create({
        data: {
          facility_type_id,
          total_amount: 0, // Will be calculated from individual configs
        },
      });
    }

    // Process each remuneration configuration
    const results = await Promise.all(
      configs.map(async (config) => {
        const { indicator_id, with_tb_patients, without_tb_patients } = config;

        // Upsert indicator remuneration
        return await prisma.indicatorRemuneration.upsert({
          where: {
            facility_type_remuneration_id_indicator_id: {
              facility_type_remuneration_id: facilityTypeRemuneration.id,
              indicator_id,
            },
          },
          update: {
            base_amount: with_tb_patients,
            conditional_amount: without_tb_patients,
            condition_type: "WITH_TB_PATIENT",
          },
          create: {
            facility_type_remuneration_id: facilityTypeRemuneration.id,
            indicator_id,
            base_amount: with_tb_patients,
            conditional_amount: without_tb_patients,
            condition_type: "WITH_TB_PATIENT",
          },
        });
      })
    );

    // Calculate total amount
    const totalAmount = results.reduce(
      (sum, config) => sum + Number(config.base_amount),
      0
    );

    // Update facility type remuneration total
    await prisma.facilityTypeRemuneration.update({
      where: { id: facilityTypeRemuneration.id },
      data: { total_amount: totalAmount },
    });

    return NextResponse.json({
      success: true,
      message: "Remuneration configurations saved successfully",
      data: {
        facility_type_remuneration_id: facilityTypeRemuneration.id,
        total_amount: totalAmount,
        configs_count: results.length,
      },
    });
  } catch (error) {
    console.error("Error saving remuneration configurations:", error);
    return NextResponse.json(
      { error: "Failed to save remuneration configurations" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const facility_type_id = searchParams.get("facility_type_id");

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
