import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

// Helper function to calculate age from DOB
function calculateAge(dob: Date): number {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Helper function to check if age is in range
function isAgeInRange(dob: Date | null, minAge: number, maxAge?: number): boolean {
  if (!dob) return false;
  const age = calculateAge(dob);
  if (maxAge !== undefined) {
    return age >= minAge && age <= maxAge;
  }
  return age >= minAge;
}

// Relationship pairs for couple matching
const COUPLE_PAIRS: Record<string, string[]> = {
  'SELF': ['WIFE', 'HUSBAND'],
  'SON': ['DAUGHTER_IN_LAW'],
  'DAUGHTER': ['SON_IN_LAW'],
  'FATHER': ['MOTHER'],
  'GRANDFATHER': ['GRANDMOTHER'],
  'BROTHER': ['SISTER_IN_LAW'],
  'SISTER': ['BROTHER_IN_LAW'],
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestedFacilityId = searchParams.get("facility_id");
    const includeChildren = searchParams.get("include_children") === "true";
    
    const userFacilityId = session.user.facility_id;
    
    if (!userFacilityId) {
      return NextResponse.json(
        { error: "No facility associated with this user" },
        { status: 403 }
      );
    }
    
    // Determine which facility/facilities to query
    let facilityIds: string[] = [];
    
    if (requestedFacilityId) {
      // Specific facility requested
      facilityIds = [requestedFacilityId];
    } else if (includeChildren) {
      // Include current facility + all child clinics
      const childClinics = await prisma.facility.findMany({
        where: {
          parent_facility_id: userFacilityId,
          has_clinic: true,
          is_active: true,
        },
        select: { id: true },
      });
      
      facilityIds = [userFacilityId, ...childClinics.map(c => c.id)];
    } else {
      // Just current facility
      facilityIds = [userFacilityId];
    }
    
    const facility_id = requestedFacilityId || userFacilityId; // For facility info display

    if (!facility_id) {
      return NextResponse.json(
        { error: "No facility associated with this user" },
        { status: 403 }
      );
    }

    // Get facility details
    const facility = await prisma.facility.findUnique({
      where: { id: facility_id },
      select: {
        id: true,
        name: true,
        display_name: true,
        has_clinic: true,
      },
    });

    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }

    // Get all villages for the selected facility/facilities
    const villages = await prisma.village.findMany({
      where: {
        facility_id: {
          in: facilityIds,
        },
        is_active: true,
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Get all families with members for the selected facility/facilities
    const families = await prisma.family.findMany({
      where: {
        section: {
          village: {
            facility_id: {
              in: facilityIds,
            },
            is_active: true,
            deleted_at: null,
          },
        },
        is_active: true,
        deleted_at: null,
      },
      select: {
        id: true,
        house_no: true,
        floor_no: true,
        no_of_couples: true,
        members: {
          where: {
            is_active: true,
            deleted_at: null,
          },
          select: {
            id: true,
            name: true,
            sex: true,
            dob: true,
            relationship_with_hof: true,
          },
        },
      },
    });

    // Initialize counters
    let totalPopulation = 0;
    let maleCount = 0;
    let femaleCount = 0;
    let otherCount = 0;
    
    // Age group counters with gender breakdown
    const ageGroups = {
      "60+": { total: 0, male: 0, female: 0 },
      "30+": { total: 0, male: 0, female: 0 },
      "0-19": { total: 0, male: 0, female: 0 },
      "4-5": { total: 0, male: 0, female: 0 },
      "3-4": { total: 0, male: 0, female: 0 },
      "2-3": { total: 0, male: 0, female: 0 },
      "1-2": { total: 0, male: 0, female: 0 },
      "0-1": { total: 0, male: 0, female: 0 },
      "0-5": { total: 0, male: 0, female: 0 },
    };
    let age30PlusFemale = 0;
    
    let eligibleCouples = 0;
    let coupleBreakdown = {
      hofSpouse: 0,
      sonDIL: 0,
      daughterSIL: 0,
      parents: 0,
      grandparents: 0,
      siblings: 0,
    };

    // Count distinct buildings (house numbers)
    const distinctHouses = new Set<string>();

    // Process each family
    for (const family of families) {
      distinctHouses.add(family.house_no);
      
      // Count members by sex
      for (const member of family.members) {
        totalPopulation++;
        
        if (member.sex === 'MALE') maleCount++;
        else if (member.sex === 'FEMALE') femaleCount++;
        else otherCount++;
        
        // Age calculations (DOB is now required)
        const age = calculateAge(member.dob);
        const isMale = member.sex === 'MALE';
        const isFemale = member.sex === 'FEMALE';
        
        if (age >= 60) {
          ageGroups["60+"].total++;
          if (isMale) ageGroups["60+"].male++;
          if (isFemale) ageGroups["60+"].female++;
        }
        if (age >= 30) {
          ageGroups["30+"].total++;
          if (isMale) ageGroups["30+"].male++;
          if (isFemale) {
            ageGroups["30+"].female++;
            age30PlusFemale++;
          }
        }
        if (age >= 0 && age <= 19) {
          ageGroups["0-19"].total++;
          if (isMale) ageGroups["0-19"].male++;
          if (isFemale) ageGroups["0-19"].female++;
        }
        if (age >= 4 && age <= 5) {
          ageGroups["4-5"].total++;
          if (isMale) ageGroups["4-5"].male++;
          if (isFemale) ageGroups["4-5"].female++;
        }
        if (age >= 3 && age < 4) {
          ageGroups["3-4"].total++;
          if (isMale) ageGroups["3-4"].male++;
          if (isFemale) ageGroups["3-4"].female++;
        }
        if (age >= 2 && age < 3) {
          ageGroups["2-3"].total++;
          if (isMale) ageGroups["2-3"].male++;
          if (isFemale) ageGroups["2-3"].female++;
        }
        if (age >= 1 && age < 2) {
          ageGroups["1-2"].total++;
          if (isMale) ageGroups["1-2"].male++;
          if (isFemale) ageGroups["1-2"].female++;
        }
        if (age >= 0 && age < 1) {
          ageGroups["0-1"].total++;
          if (isMale) ageGroups["0-1"].male++;
          if (isFemale) ageGroups["0-1"].female++;
        }
        if (age >= 0 && age <= 5) {
          ageGroups["0-5"].total++;
          if (isMale) ageGroups["0-5"].male++;
          if (isFemale) ageGroups["0-5"].female++;
        }
      }
      
      // Calculate eligible couples for this family
      const membersByRelationship: Record<string, typeof family.members> = {};
      
      // Group members by relationship
      for (const member of family.members) {
        if (!membersByRelationship[member.relationship_with_hof]) {
          membersByRelationship[member.relationship_with_hof] = [];
        }
        membersByRelationship[member.relationship_with_hof].push(member);
      }
      
      // Check each couple pair type
      for (const [primary, partners] of Object.entries(COUPLE_PAIRS)) {
        const primaryMembers = membersByRelationship[primary] || [];
        
        for (const partnerType of partners) {
          const partnerMembers = membersByRelationship[partnerType] || [];
          
          // Match pairs (simplified: assumes 1:1 matching)
          const pairsCount = Math.min(primaryMembers.length, partnerMembers.length);
          
          for (let i = 0; i < pairsCount; i++) {
            const primaryMember = primaryMembers[i];
            const partnerMember = partnerMembers[i];
            
            // Check if both are age 15-49
            if (
              primaryMember.dob &&
              partnerMember.dob &&
              isAgeInRange(primaryMember.dob, 15, 49) &&
              isAgeInRange(partnerMember.dob, 15, 49)
            ) {
              eligibleCouples++;
              
              // Track breakdown
              if (primary === 'SELF') coupleBreakdown.hofSpouse++;
              else if (primary === 'SON') coupleBreakdown.sonDIL++;
              else if (primary === 'DAUGHTER') coupleBreakdown.daughterSIL++;
              else if (primary === 'FATHER') coupleBreakdown.parents++;
              else if (primary === 'GRANDFATHER') coupleBreakdown.grandparents++;
              else if (primary === 'BROTHER' || primary === 'SISTER') coupleBreakdown.siblings++;
            }
          }
        }
      }
    }

    // Build response
    const stats = {
      facility: {
        name: facility.name,
        displayName: facility.display_name,
        hasClinic: facility.has_clinic,
      },
      villages: {
        total: villages.length,
        covered: villages.map(v => v.name),
      },
      population: {
        total: totalPopulation,
        male: maleCount,
        female: femaleCount,
        other: otherCount,
      },
      ageGroups: {
        ...ageGroups,
        "30+Female": age30PlusFemale,
      },
      couples: {
        eligible: eligibleCouples,
        breakdown: {
          "HOF+Spouse": coupleBreakdown.hofSpouse,
          "Son+DIL": coupleBreakdown.sonDIL,
          "Daughter+SIL": coupleBreakdown.daughterSIL,
          "Parents": coupleBreakdown.parents,
          "Grandparents": coupleBreakdown.grandparents,
          "Siblings": coupleBreakdown.siblings,
        },
      },
      housing: {
        families: families.length,
        buildings: distinctHouses.size,
        avgFamiliesPerBuilding: distinctHouses.size > 0
          ? (families.length / distinctHouses.size).toFixed(2)
          : "0",
      },
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error fetching Long Roll stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
