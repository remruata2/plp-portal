import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  let sessionId: string;
  try {
    const resolvedParams = await params;
    sessionId = resolvedParams.sessionId;
    const sessionIdNum = parseInt(sessionId, 10);

    if (isNaN(sessionIdNum)) {
      return NextResponse.json(
        { success: false, error: "Invalid session ID" },
        { status: 400 }
      );
    }

    const session = await prisma.dataUploadSession.findUnique({
      where: { id: sessionIdNum },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: session });
  } catch (error: any) {
    console.error(`[API_SESSION_STATUS] Error fetching session:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch session status",
      },
      { status: 500 }
    );
  }
}
