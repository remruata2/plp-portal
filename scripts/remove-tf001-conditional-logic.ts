import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

/**
 * Remove old TB conditional logic from TF001 indicators
 * 
 * This script removes the conditional_amount and condition_type from TF001 indicators
 * so they always use base_amount instead of the old WITH_TB_PATIENT logic.
 * 
 * The new conditional logic (condition_1_amount through condition_4_amount) should only
 * apply to TS001, CT001, and DC001 indicators.
 */
async function removeConditionalLogic() {
    console.log('🔧 Removing old TB conditional logic from TF001 indicators...\n');

    try {
        // Get all TF001 indicators
        const tf001Indicators = await prisma.indicator.findMany({
            where: {
                code: {
                    startsWith: 'TF001',
                },
            },
            select: {
                id: true,
                code: true,
                name: true,
            },
        });

        console.log(`Found ${tf001Indicators.length} TF001 indicators:\n`);
        tf001Indicators.forEach((ind) => {
            console.log(`  - ${ind.code}: ${ind.name}`);
        });
        console.log('');

        // Get current remuneration configs for TF001 indicators
        const currentConfigs = await prisma.indicator_remuneration.findMany({
            where: {
                indicator_id: {
                    in: tf001Indicators.map((ind) => ind.id),
                },
            },
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

        console.log('📊 Current configurations:\n');
        currentConfigs.forEach((config) => {
            console.log(`${config.indicator.code} (${config.facility_type_remuneration.facility_type.name}):`);
            console.log(`  Base Amount: ₹${config.base_amount}`);
            console.log(`  Conditional Amount: ${config.conditional_amount ? `₹${config.conditional_amount}` : 'NULL'}`);
            console.log(`  Condition Type: ${config.condition_type || 'NULL'}`);
            console.log('');
        });

        // Update all TF001 indicator remunerations to remove conditional logic
        const updateResult = await prisma.indicator_remuneration.updateMany({
            where: {
                indicator_id: {
                    in: tf001Indicators.map((ind) => ind.id),
                },
            },
            data: {
                conditional_amount: null,
                condition_type: null,
            },
        });

        console.log(`✅ Updated ${updateResult.count} indicator remuneration records\n`);

        // Verify the changes
        const updatedConfigs = await prisma.indicator_remuneration.findMany({
            where: {
                indicator_id: {
                    in: tf001Indicators.map((ind) => ind.id),
                },
            },
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

        console.log('📊 Updated configurations:\n');
        updatedConfigs.forEach((config) => {
            console.log(`${config.indicator.code} (${config.facility_type_remuneration.facility_type.name}):`);
            console.log(`  Base Amount: ₹${config.base_amount}`);
            console.log(`  Conditional Amount: ${config.conditional_amount ? `₹${config.conditional_amount}` : 'NULL'}`);
            console.log(`  Condition Type: ${config.condition_type || 'NULL'}`);
            console.log('');
        });

        console.log('✅ Successfully removed old TB conditional logic from TF001 indicators');
        console.log('');
        console.log('📝 Summary:');
        console.log('  - All TF001 indicators will now use base_amount only');
        console.log('  - No more variation based on TB patient presence');
        console.log('  - New conditional logic (condition_1_amount to condition_4_amount) remains for TS001, CT001, DC001');

    } catch (error) {
        console.error('❌ Error removing conditional logic:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
removeConditionalLogic()
    .then(() => {
        console.log('\n✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
