import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { UserRole } from "@/generated/prisma";
import { sortIndicatorsBySourceOrder } from "@/lib/utils/indicator-sort-order";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const facilityTypeId = searchParams.get("facilityTypeId");
    const includeConfigs = searchParams.get("includeConfigs") === "true";

    let indicatorsQuery: any = {
      where: {
        type: "enhanced", // Only get enhanced indicators
      },
      orderBy: { name: "asc" },
      include: {
        indicator_configurations: {
          include: {
            facility_type: true,
          },
        },
      },
    };

    const indicators = await prisma.indicator.findMany(indicatorsQuery);

    // Transform the data to include formula information
    const enhancedIndicators = indicators.map((indicator: any) => {
      return {
        id: indicator.id,
        code: indicator.code,
        name: indicator.name,
        description: indicator.description,
        type: indicator.type,
        target_type: indicator.target_type,
        formula_config: indicator.formula_config,
        indicator_configurations: indicator.indicator_configurations || [],
        created_at: indicator.created_at,
        updated_at: indicator.updated_at,
      };
    });

    // Sort indicators by source file order
    const sortedIndicators = sortIndicatorsBySourceOrder(enhancedIndicators);

    return NextResponse.json({
      success: true,
      data: sortedIndicators,
      count: sortedIndicators.length,
    });
  } catch (error) {
    console.error("Error fetching enhanced indicators:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch enhanced indicators" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== UserRole.admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      code,
      name,
      description,
      target_type,
      formula_config,
      configurations,
    } = body;

    if (!code || !name || !target_type) {
      return NextResponse.json(
        { success: false, error: "Code, name and target_type are required" },
        { status: 400 }
      );
    }

    // Create the indicator
    const newIndicator = await prisma.indicator.create({
      data: {
        code,
        name,
        description: description || null,
        type: "enhanced",
        target_type,
        formula_config: formula_config || null,
      },
    });

    return NextResponse.json(
      { success: true, data: newIndicator },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating enhanced indicator:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("code")) {
      return NextResponse.json(
        {
          success: false,
          error: "An indicator with this code already exists.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create enhanced indicator",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
