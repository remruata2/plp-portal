import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Default settings
const DEFAULT_SETTINGS = {
  monthly_submission_deadline: "15", // Day of month (1-31)
};

// GET /api/admin/settings - Get all system settings
export async function GET(req: NextRequest) {
  try {
    // Get all settings from the database
    const settings = await prisma.systemSetting.findMany();
    
    // Convert to key-value object and apply defaults for missing settings
    const settingsObject: Record<string, string> = {};
    
    // First apply defaults
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      settingsObject[key] = value;
    }
    
    // Then override with actual settings from database
    for (const setting of settings) {
      settingsObject[setting.key] = setting.value;
    }
    
    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error("Error getting settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings - Update system settings
export async function POST(req: NextRequest) {
  try {
    // Get request body
    const body = await req.json();
    
    // Validate submission deadline day
    const submissionDeadlineDay = parseInt(body.monthly_submission_deadline);
    if (isNaN(submissionDeadlineDay) || submissionDeadlineDay < 1 || submissionDeadlineDay > 31) {
      return NextResponse.json(
        { error: "Submission deadline day must be between 1 and 31" },
        { status: 400 }
      );
    }
    
    // Update or create the setting
    await prisma.systemSetting.upsert({
      where: { key: "monthly_submission_deadline" },
      update: { 
        value: submissionDeadlineDay.toString(),
        updated_at: new Date()
      },
      create: {
        key: "monthly_submission_deadline",
        value: submissionDeadlineDay.toString()
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: `Submission deadline updated to ${submissionDeadlineDay}th of each month` 
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
