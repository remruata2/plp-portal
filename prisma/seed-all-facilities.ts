import seedAizawlEastFacilities from './seed-aizawl-east';
import seedAizawlWestFacilities from './seed-aizawl-west';
import seedChamphaiFacilities from './seed-champhai';
import seedHnahthialFacilities from './seed-hnahthial';
import seedKhawzawlFacilities from './seed-khawzawl';
import seedKolasibFacilities from './seed-kolasib';
import seedLawngtlaiFacilities from './seed-lawngtlai';
import seedLungleiFacilities from './seed-lunglei';
import seedMamitFacilities from './seed-mamit';
import seedSaitualFacilities from './seed-saitual';
import seedSerchhipFacilities from './seed-serchhip';
import seedSiahaFacilities from './seed-siaha';

async function seedAllFacilities() {
  console.log('🌱 Starting to seed all facilities for all districts...');

  try {
    await seedAizawlEastFacilities();
    await seedAizawlWestFacilities();
    await seedChamphaiFacilities();
    await seedHnahthialFacilities();
    await seedKhawzawlFacilities();
    await seedKolasibFacilities();
    await seedLawngtlaiFacilities();
    await seedLungleiFacilities();
    await seedMamitFacilities();
    await seedSaitualFacilities();
    await seedSerchhipFacilities();
    await seedSiahaFacilities();

    console.log('\n🎉 Successfully seeded all facilities for all districts!');
  } catch (error) {
    console.error('❌ An error occurred during the facility seeding process:', error);
    throw error;
  }
}

if (require.main === module) {
  seedAllFacilities().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedAllFacilities;
