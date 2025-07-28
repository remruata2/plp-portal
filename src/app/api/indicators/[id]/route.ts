import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { UserRole } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid indicator ID" }, { status: 400 });
    }

    const indicator = await prisma.indicator.findUnique({
      where: { id },
    });

    if (!indicator) {
      return NextResponse.json({ error: "Indicator not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: indicator });
  } catch (error) {
    console.error("Error fetching indicator:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch indicator" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== UserRole.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid indicator ID" }, { status: 400 });
    }

    // First, get the current indicator to check its type
    const currentIndicator = await prisma.indicator.findUnique({
      where: { id },
    });

    if (!currentIndicator) {
      return NextResponse.json(
        { success: false, error: "Indicator not found" },
        { status: 404 }
      );
    }

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
    }

    const updatedIndicator = await prisma.indicator.update({
      where: { id },
      data: {
        code,
        name,
        description: description || null,
        type,
        structure: type === 'formula' ? structure : null,
      },
    });

    return NextResponse.json({ success: true, data: updatedIndicator });
  } catch (error: any) {
    console.error("Error updating indicator:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('code')) {
      return NextResponse.json(
        {
          success: false,
          error: "An indicator with this code already exists.",
        },
        { status: 409 } // 409 Conflict
      );
    }
    if (error?.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Indicator not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update indicator" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== UserRole.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid indicator ID" }, { status: 400 });
    }

    await prisma.indicator.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Indicator deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting indicator:", error);
     if (error?.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Indicator not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to delete indicator" },
      { status: 500 }
    );
  }
}
