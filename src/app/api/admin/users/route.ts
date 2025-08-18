import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";



export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const whereClause: any = {};

    if (role && role !== "all") {
      whereClause.role = role;
    }

    if (status && status !== "all") {
      whereClause.is_active = status === "active";
    }

    if (search) {
      whereClause.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { role: { contains: search, mode: "insensitive" } },
        { facility: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        facility: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ role: "asc" }, { username: "asc" }],
    });

    // Transform the data to handle optional fields
    const transformedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email || "",
      role: user.role,
      is_active: user.is_active || false,
      last_login: user.last_login?.toISOString() || null,
      created_at: user.created_at?.toISOString() || new Date().toISOString(),
      facility: user.facility
        ? {
            id: user.facility.id,
            name: user.facility.name,
          }
        : null,
    }));

    return NextResponse.json({ users: transformedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
