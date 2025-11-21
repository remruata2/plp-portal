
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying system_setting upsert fix...');

    try {
        const result = await prisma.system_setting.upsert({
            where: {
                key: "test_verification_key"
            },
            update: {
                value: "verified",
                updated_at: new Date()
            },
            create: {
                key: "test_verification_key",
                value: "verified",
                updated_at: new Date()
                // id should be auto-generated now
            }
        });

        console.log('Successfully upserted setting:', result);

        if (!result.id) {
            throw new Error('ID was not generated!');
        }

        // Cleanup
        await prisma.system_setting.delete({
            where: { key: "test_verification_key" }
        });
        console.log('Cleanup successful');

    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
