import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.indicator_category.findMany({
      orderBy: { sort_order: "asc" },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching indicator categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch indicator categories" },
      { status: 500 }
    );
  }
}
