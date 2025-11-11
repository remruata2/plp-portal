import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

// Helper to generate voter ID
function generateVoterID(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = letters[Math.floor(Math.random() * letters.length)] + 
                 letters[Math.floor(Math.random() * letters.length)] + 
                 letters[Math.floor(Math.random() * letters.length)];
  const numbers = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${numbers}`;
}

// Helper to generate phone number
function generatePhone(): string {
  return `${Math.floor(Math.random() * 9000000000) + 1000000000}`;
}

async function main() {
  console.log('🔧 Updating existing family members with required fields...');

  // Get all family members with NULL voter_id or phone
  const members = await prisma.familyMember.findMany({
    where: {
      OR: [
        { voter_id: null },
        { phone: null },
      ],
    },
  });

  console.log(`Found ${members.length} members to update`);

  let updated = 0;
  for (const member of members) {
    await prisma.familyMember.update({
      where: { id: member.id },
      data: {
        voter_id: member.voter_id || generateVoterID(),
        phone: member.phone || generatePhone(),
      },
    });
    updated++;
    if (updated % 50 === 0) {
      console.log(`  Updated ${updated}/${members.length} members...`);
    }
  }

  console.log(`✅ Updated ${updated} family members`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
