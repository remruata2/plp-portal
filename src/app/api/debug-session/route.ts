import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log("Debug Session - Full session:", session);
    console.log("Debug Session - Session user:", session?.user);
    console.log("Debug Session - Session user role:", session?.user?.role);

    return NextResponse.json({
      hasSession: !!session,
      session: session,
      user: session?.user,
      role: session?.user?.role,
    });
  } catch (error) {
    console.error("Error in debug session:", error);
    return NextResponse.json(
      { error: "Failed to get session", details: error },
      { status: 500 }
    );
  }
}
