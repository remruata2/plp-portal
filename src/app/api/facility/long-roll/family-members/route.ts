import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient, Gender, HOFRelationship } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const facility_id = session.user.facility_id;

    if (!facility_id) {
      return NextResponse.json(
        { error: "No facility associated with this user" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const family_id = searchParams.get("family_id");

    if (!family_id) {
      return NextResponse.json(
        { error: "family_id parameter is required" },
        { status: 400 }
      );
    }

    const family = await prisma.family.findFirst({
      where: {
        id: family_id,
        section: {
          village: {
            facility_id,
          },
        },
        deleted_at: null,
      },
    });

    if (!family) {
      return NextResponse.json(
        { error: "Family not found or access denied" },
        { status: 404 }
      );
    }

    const members = await prisma.family_member.findMany({
      where: {
        family_id,
        is_active: true,
        deleted_at: null,
      },
      include: {
        family: {
          select: {
            id: true,
            house_no: true,
            section: {
              select: {
                id: true,
                name: true,
                village: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [
        {
          relationship_with_hof: "asc",
        },
        {
          created_at: "asc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      members,
      count: members.length,
    });
  } catch (error) {
    console.error("Error fetching family members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const facility_id = session.user.facility_id;

    if (!facility_id) {
      return NextResponse.json(
        { error: "No facility associated with this user" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      family_id,
      name,
      relationship_with_hof,
      voter_id,
      phone,
      sex,
      occupation,
      abha_id,
      abha_address,
      dob,
    } = body;

    if (!family_id) {
      return NextResponse.json(
        { error: "family_id is required" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    if (!relationship_with_hof) {
      return NextResponse.json(
        { error: "relationship_with_hof is required" },
        { status: 400 }
      );
    }

    if (!sex) {
      return NextResponse.json(
        { error: "sex is required" },
        { status: 400 }
      );
    }

    const family = await prisma.family.findFirst({
      where: {
        id: family_id,
        section: {
          village: {
            facility_id,
          },
        },
        deleted_at: null,
      },
    });

    if (!family) {
      return NextResponse.json(
        { error: "Family not found or access denied" },
        { status: 404 }
      );
    }

    const validGenders: Gender[] = ["MALE", "FEMALE", "OTHER"];
    if (!validGenders.includes(sex)) {
      return NextResponse.json(
        { error: "Invalid sex value. Must be MALE, FEMALE, or OTHER" },
        { status: 400 }
      );
    }

    const validRelationships: HOFRelationship[] = [
      "SELF", "HUSBAND", "WIFE", "SON", "DAUGHTER", "FATHER", "MOTHER",
      "BROTHER", "SISTER", "GRANDFATHER", "GRANDMOTHER", "GRANDSON",
      "GRANDDAUGHTER", "FATHER_IN_LAW", "MOTHER_IN_LAW", "SON_IN_LAW",
      "DAUGHTER_IN_LAW", "BROTHER_IN_LAW", "SISTER_IN_LAW", "UNCLE",
      "AUNT", "NEPHEW", "NIECE", "COUSIN", "OTHER"
    ];

    if (!validRelationships.includes(relationship_with_hof)) {
      return NextResponse.json(
        { error: `Invalid relationship_with_hof value. Must be one of: ${validRelationships.join(", ")}` },
        { status: 400 }
      );
    }

    const member = await prisma.family_member.create({
      data: {
        family_id,
        name: name.trim(),
        relationship_with_hof,
        voter_id: voter_id?.trim() || null,
        phone: phone?.trim() || null,
        sex,
        occupation: occupation?.trim() || null,
        abha_id: abha_id?.trim() || null,
        abha_address: abha_address?.trim() || null,
        dob: dob ? new Date(dob) : null,
      },
      include: {
        family: {
          select: {
            id: true,
            house_no: true,
            section: {
              select: {
                id: true,
                name: true,
                village: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Family member created successfully",
      member,
    });
  } catch (error) {
    console.error("Error creating family member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
