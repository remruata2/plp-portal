import { NextRequest, NextResponse } from "next/server";
import { checkSubmissionAllowed } from "@/lib/submission-deadline";

// GET /api/submission-status - Get current submission status
export async function GET(req: NextRequest) {
  try {
    const submissionStatus = await checkSubmissionAllowed();
    
    return NextResponse.json(submissionStatus);
  } catch (error) {
    console.error("Error checking submission status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
