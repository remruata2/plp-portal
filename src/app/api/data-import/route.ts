import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

interface ImportData {
  facilityId: number;
  indicatorId: number;
  value: number;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { dataForImport, month, year } = await req.json();

    if (!dataForImport || !month || !year) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const reportMonth = `${year}-${String(month).padStart(2, '0')}`;
    let successCount = 0;

    for (const item of dataForImport) {
      const { facilityId, indicatorId, value, districtId } = item;

      // Ensure value is a number and not null/undefined
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        // Skip records with non-numeric values, or handle as an error
        console.warn(`Skipping record for facility ${facilityId}, indicator ${indicatorId} due to invalid value: ${value}`);
        continue;
      }

      await prisma.monthlyHealthData.upsert({
        where: {
          facility_id_indicator_id_report_month: {
            facility_id: facilityId,
            indicator_id: indicatorId,
            report_month: reportMonth,
          },
        },
        update: {
          value: numericValue,
          uploaded_by: session.user.id,
        },
        create: {
          facility_id: facilityId,
          indicator_id: indicatorId,
          district_id: districtId, // Assuming districtId is passed in dataForImport
          report_month: reportMonth,
          value: numericValue,
          uploaded_by: session.user.id,
        },
      });
      successCount++;
    }

    return NextResponse.json({ message: 'Data imported successfully', successCount });

  } catch (error: any) {
    console.error('Import failed:', error);
    return NextResponse.json({ error: 'Import failed', details: error.message }, { status: 500 });
  }
}
