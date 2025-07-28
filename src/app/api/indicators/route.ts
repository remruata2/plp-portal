import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { UserRole } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const indicators = await prisma.indicator.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, data: indicators });
  } catch (error) {
    console.error("Error fetching indicators:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch indicators" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== UserRole.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { code, name, description, type, structure } = body;

    if (!code || !name || !type) {
      return NextResponse.json(
        { success: false, error: "Code, name and type are required" },
        { status: 400 }
      );
    }

    // Validate based on indicator type
    if (type === 'formula') {
      if (!structure) {
        return NextResponse.json(
          { success: false, error: "Structure is required for formula indicators" },
          { status: 400 }
        );
      }
      
      // Basic validation for the structure object
      if (
        !structure.operands ||
        !Array.isArray(structure.operands) ||
        !structure.expression ||
        typeof structure.expression !== 'string'
      ) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid structure: must include an "operands" array and an "expression" string.',
          },
          { status: 400 }
        );
      }

      // Validate that all operands have a valid indicatorId
      const operandIndicatorIds = structure.operands.map((op: any) => op.indicatorId).filter((id: any) => id);

      if (operandIndicatorIds.length !== structure.operands.length) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid structure: each operand must have an "indicatorId".',
          },
          { status: 400 }
        );
      }

      const existingIndicators = await prisma.indicator.findMany({
        where: {
          id: { in: operandIndicatorIds },
        },
      });

      if (existingIndicators.length !== operandIndicatorIds.length) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid structure: one or more "indicatorId"s in operands do not exist.',
          },
          { status: 400 }
        );
      }
    }

    const newIndicator = await prisma.indicator.create({
      data: {
        code,
        name,
        description: description || null,
        type,
        structure: type === 'formula' ? structure : null,
      },
    });

    return NextResponse.json({ success: true, data: newIndicator }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating indicator:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('code')) {
        return NextResponse.json(
          {
            success: false,
            error: "An indicator with this code already exists.",
          },
          { status: 409 } // 409 Conflict
        );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create indicator",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
