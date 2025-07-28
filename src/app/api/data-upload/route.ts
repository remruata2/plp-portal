import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { UserRole } from '@/generated/prisma';
import Papa from 'papaparse';

const prisma = new PrismaClient();

interface ValidationResult {
  unrecognizedHeaders: string[];
  unrecognizedFacilities: string[];
  rowCount: number;
  dataForImport: any[];
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== UserRole.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const month = formData.get('month') as string | null;
    const year = formData.get('year') as string | null;

    if (!file || !month || !year) {
      return NextResponse.json({ error: 'Missing file, month, or year' }, { status: 400 });
    }

    const fileContent = await file.text();

    // --- Phase 1: Validation (Dry Run) ---
    const validationResult: ValidationResult = await new Promise((resolve, reject) => {
      Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const headers = results.meta.fields || [];
            const facilityHeader = headers[0]; // Assuming the first column is for facility names

            if (!facilityHeader) {
                return reject(new Error('CSV must have a header row.'));
            }
            
            const indicatorHeaders = headers.slice(1);

            // Fetch validation data from DB
            const dbFacilities = await prisma.facility.findMany();
            const dbIndicators = await prisma.indicator.findMany();

            const dbFacilityMap = new Map(dbFacilities.map(f => [f.name, f]));
            const dbIndicatorMap = new Map(dbIndicators.map(i => [i.code, i]));

            const dbIndicatorCodes = new Set(dbIndicators.map(i => i.code));

            // Validate headers
            const unrecognizedHeaders = indicatorHeaders.filter(h => !dbIndicatorCodes.has(h));

            // Validate facilities and prepare data
            const unrecognizedFacilities: string[] = [];
            const dataForImport: any[] = [];

            for (const row of results.data as any[]) {
              const facilityName = row[facilityHeader];
              const facility = dbFacilityMap.get(facilityName);

              if (facilityName && !facility) {
                unrecognizedFacilities.push(facilityName);
              } else if (facility) {
                for (const header of indicatorHeaders) {
                  const indicator = dbIndicatorMap.get(header);
                  const value = row[header];

                  if (indicator && value !== null && value !== '') {
                    const numericValue = parseFloat(value);
                    if (!isNaN(numericValue)) {
                      dataForImport.push({
                        facilityId: facility.id,
                        indicatorId: indicator.id,
                        districtId: facility.district_id,
                        value: numericValue,
                      });
                    }
                  }
                }
              }
            }

            resolve({
              unrecognizedHeaders,
              unrecognizedFacilities: [...new Set(unrecognizedFacilities)], // Unique names
              rowCount: results.data.length,
              dataForImport,
            });
          } catch (dbError) {
            reject(dbError);
          }
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });

    return NextResponse.json({ success: true, validation: validationResult });

  } catch (error: any) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ success: false, error: 'Failed to process file', details: error.message }, { status: 500 });
  }
}
