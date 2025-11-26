import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

/**
 * Test performance percentage calculation for a specific facility
 * 
 * Facility ID: cme99emde004rjncdrbil23gt
 * Report Month: 2024-10 (October 2024)
 */
async function testSpecificFacility() {
    console.log('🧪 Testing performance percentage calculation for specific facility...\n');

    const facilityId = 'cme99emde004rjncdrbil23gt';
    const reportMonth = '2025-10';

    try {
        // Get facility details
        const facility = await prisma.facility.findUnique({
            where: { id: facilityId },
            include: {
                facility_type: true,
            },
        });

        if (!facility) {
            console.log('❌ Facility not found');
            return;
        }

        console.log(`📍 Facility: ${facility.display_name || facility.name}`);
        console.log(`   Facility Type: ${facility.facility_type.name}`);
        console.log(`   Report Month: ${reportMonth}\n`);

        // Get conditional answer fields
        const ct001Field = await prisma.field_value.findFirst({
            where: {
                facility_id: facilityId,
                report_month: reportMonth,
                field: {
                    code: 'indicator_ct001_conditional_answer',
                },
            },
            include: {
                field: true,
            },
        });

        const dc001Field = await prisma.field_value.findFirst({
            where: {
                facility_id: facilityId,
                report_month: reportMonth,
                field: {
                    code: 'indicator_dc001_conditional_answer',
                },
            },
            include: {
                field: true,
            },
        });

        const ct001Answer = ct001Field?.boolean_value === true;
        const dc001Answer = dc001Field?.boolean_value === true;

        console.log('📊 Conditional Answers:');
        console.log(`   CT001 (Household visited for TB contact tracing): ${ct001Answer ? 'Yes' : 'No'}`);
        console.log(`   DC001 (TB patients visited for Differentiated TB Care): ${dc001Answer ? 'Yes' : 'No'}\n`);

        // Get all indicator records
        const indicatorRecords = await prisma.facilityRemunerationRecord.findMany({
            where: {
                facility_id: facilityId,
                report_month: reportMonth,
            },
            include: {
                indicator: true,
            },
            orderBy: {
                indicator: {
                    code: 'asc',
                },
            },
        });

        if (indicatorRecords.length === 0) {
            console.log('❌ No indicator records found');
            return;
        }

        console.log(`📈 Indicator Records (${indicatorRecords.length} total):\n`);

        let totalPercentageAll = 0;
        let totalPercentageFiltered = 0;
        let countAll = 0;
        let countFiltered = 0;

        indicatorRecords.forEach((record) => {
            const percentage = Number(record.percentage_achieved || 0);
            const cappedPercentage = Math.min(percentage, 100);

            // Check if this indicator should be excluded
            const indicatorCode = record.indicator.code;
            const isCT001 = indicatorCode === 'CT001' || indicatorCode === 'CT001_PHC';
            const isDC001 = indicatorCode === 'DC001' || indicatorCode === 'DC001_PHC';

            const shouldExclude = (isCT001 && !ct001Answer) || (isDC001 && !dc001Answer);

            const status = shouldExclude ? '❌ EXCLUDED' : '✅ INCLUDED';

            console.log(`   ${indicatorCode}: ${cappedPercentage.toFixed(1)}% ${status}`);

            totalPercentageAll += cappedPercentage;
            countAll++;

            if (!shouldExclude) {
                totalPercentageFiltered += cappedPercentage;
                countFiltered++;
            }
        });

        const performanceAll = countAll > 0 ? totalPercentageAll / countAll : 0;
        const performanceFiltered = countFiltered > 0 ? totalPercentageFiltered / countFiltered : 0;

        console.log('\n📊 Performance Calculation:');
        console.log(`   All Indicators: ${performanceAll.toFixed(2)}% (${countAll} indicators)`);
        console.log(`   Filtered (Correct): ${performanceFiltered.toFixed(2)}% (${countFiltered} indicators)\n`);

        // Get the stored performance percentage
        const remunerationCalc = await prisma.remuneration_calculations.findFirst({
            where: {
                facility_id: facilityId,
                report_month: reportMonth,
            },
        });

        if (remunerationCalc) {
            const storedPerformance = Number(remunerationCalc.performance_percentage || 0);
            console.log(`💾 Stored Performance Percentage: ${storedPerformance.toFixed(2)}%`);

            const isCorrect = Math.abs(storedPerformance - performanceFiltered) < 0.01;

            if (isCorrect) {
                console.log('✅ PASS: Stored performance matches filtered calculation');
            } else {
                console.log('❌ FAIL: Stored performance does not match filtered calculation');
                console.log(`   Expected: ${performanceFiltered.toFixed(2)}%`);
                console.log(`   Got: ${storedPerformance.toFixed(2)}%`);
                console.log(`   Difference: ${Math.abs(storedPerformance - performanceFiltered).toFixed(2)}%`);
            }
        } else {
            console.log('⚠️  No remuneration calculation record found');
        }

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the test
testSpecificFacility()
    .then(() => {
        console.log('\n✅ Test completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    });
