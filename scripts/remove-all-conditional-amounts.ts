import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

/**
 * Remove all conditional_amount and condition_type values from indicator_remuneration table
 * 
 * This script clears the old TB conditional logic (WITH_TB_PATIENT) from ALL indicators.
 * After running this script, all indicators will use base_amount only.
 * 
 * The new conditional logic (condition_1_amount through condition_4_amount) will remain
 * and only applies to TS001, CT001, and DC001 indicators.
 */
async function removeAllConditionalAmounts() {
    console.log('🔧 Removing all conditional_amount and condition_type values...\n');

    try {
        // Get all indicator remunerations with conditional amounts
        const allRemunerations = await prisma.indicator_remuneration.findMany({
            include: {
                indicator: {
                    select: {
                        code: true,
                        name: true,
                    },
                },
                facility_type_remuneration: {
                    include: {
                        facility_type: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        console.log(`📊 Total indicator remuneration records: ${allRemunerations.length}\n`);

        // Filter records that have conditional_amount or condition_type set
        const recordsWithConditional = allRemunerations.filter(
            (r) => r.conditional_amount !== null || r.condition_type !== null
        );

        console.log(`📋 Records with conditional_amount or condition_type: ${recordsWithConditional.length}\n`);

        if (recordsWithConditional.length > 0) {
            console.log('Current configurations:\n');
            recordsWithConditional.forEach((config) => {
                console.log(`${config.indicator.code} (${config.facility_type_remuneration.facility_type.name}):`);
                console.log(`  Base Amount: ₹${config.base_amount}`);
                console.log(`  Conditional Amount: ${config.conditional_amount ? `₹${config.conditional_amount}` : 'NULL'}`);
                console.log(`  Condition Type: ${config.condition_type || 'NULL'}`);
                console.log('');
            });

            // Update all records to remove conditional_amount and condition_type
            const updateResult = await prisma.indicator_remuneration.updateMany({
                data: {
                    conditional_amount: null,
                    condition_type: null,
                },
            });

            console.log(`✅ Updated ${updateResult.count} indicator remuneration records\n`);

            // Verify the changes
            const verifyRecords = await prisma.indicator_remuneration.findMany({
                where: {
                    OR: [
                        { conditional_amount: { not: null } },
                        { condition_type: { not: null } },
                    ],
                },
            });

            if (verifyRecords.length === 0) {
                console.log('✅ Verification passed: All conditional_amount and condition_type values removed\n');
            } else {
                console.log(`⚠️  Warning: ${verifyRecords.length} records still have conditional values\n`);
            }
        } else {
            console.log('✅ No records found with conditional_amount or condition_type\n');
        }

        console.log('📝 Summary:');
        console.log('  - All indicators will now use base_amount only');
        console.log('  - No more variation based on TB patient presence');
        console.log('  - New conditional logic (condition_1_amount to condition_4_amount) remains for TS001, CT001, DC001');
        console.log('  - Old WITH_TB_PATIENT system is completely disabled');

    } catch (error) {
        console.error('❌ Error removing conditional amounts:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
removeAllConditionalAmounts()
    .then(() => {
        console.log('\n✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
