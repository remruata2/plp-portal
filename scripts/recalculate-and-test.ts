import { PrismaClient } from '../src/generated/prisma';
import { HealthDataRemunerationService } from '../src/lib/services/health-data-remuneration.service';

const prisma = new PrismaClient();

/**
 * Recalculate and test performance percentage for a specific facility
 */
async function recalculateAndTest() {
    const facilityId = 'cme99emde004rjncdrbil23gt';
    const reportMonth = '2025-10';

    console.log('🔄 Recalculating remuneration for facility...\n');
    console.log(`   Facility ID: ${facilityId}`);
    console.log(`   Report Month: ${reportMonth}\n`);

    try {
        // Recalculate using the updated service
        await HealthDataRemunerationService.processHealthDataRemuneration(
            facilityId,
            reportMonth,
            [],
            prisma
        );

        console.log('✅ Recalculation complete\n');

        // Now fetch and verify the stored performance percentage
        const remunerationCalc = await prisma.remuneration_calculations.findFirst({
            where: {
                facility_id: facilityId,
                report_month: reportMonth,
            },
        });

        if (remunerationCalc) {
            const storedPerformance = Number(remunerationCalc.performance_percentage || 0);
            console.log(`💾 Stored Performance Percentage: ${storedPerformance.toFixed(2)}%`);
            console.log(`   Expected: ~94.86% (with CT001 and DC001 excluded)`);
            console.log(`   Previous: 86.61% (with CT001 and DC001 included)\n`);

            if (Math.abs(storedPerformance - 94.86) < 1) {
                console.log('✅ SUCCESS: Performance percentage is now correct!');
            } else if (Math.abs(storedPerformance - 86.61) < 1) {
                console.log('❌ FAIL: Performance percentage still using old logic');
            } else {
                console.log(`⚠️  UNEXPECTED: Performance percentage is ${storedPerformance.toFixed(2)}%`);
            }
        } else {
            console.log('❌ No remuneration calculation record found');
        }

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the test
recalculateAndTest()
    .then(() => {
        console.log('\n✅ Test completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    });
