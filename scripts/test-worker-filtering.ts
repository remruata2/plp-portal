import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function testWorkerFiltering() {
  try {
    console.log("🧪 Testing worker filtering logic...\n");
    
    // Get a facility (Zuangtui SC)
    const facility = await prisma.facility.findFirst({
      where: { name: "Zuangtui SC" },
      include: {
        facility_type: true,
      },
    });
    
    if (!facility) {
      console.log("❌ Facility not found");
      return;
    }
    
    console.log(`🏥 Facility: ${facility.name} (${facility.facility_type.name})`);
    
    // Get all workers for this facility
    const workers = await prisma.healthWorker.findMany({
      where: {
        facility_id: facility.id,
        is_active: true,
      },
    });
    
    console.log(`\n👥 All workers (${workers.length}):`);
    workers.forEach(worker => {
      console.log(`  - ${worker.name}: ${worker.worker_type} (₹${worker.allocated_amount})`);
    });
    
    // Get worker allocation config
    const workerConfigs = await prisma.workerAllocationConfig.findMany({
      where: {
        facility_type_id: facility.facility_type_id,
        is_active: true,
      },
    });
    
    console.log(`\n⚙️ Worker allocation config:`);
    workerConfigs.forEach(config => {
      console.log(`  - ${config.worker_type} -> ${config.worker_role} (₹${config.allocated_amount})`);
    });
    
    // Apply the new filtering logic
    const teamBasedWorkerTypes = ['hwo', 'mo', 'ayush_mo'];
    const performanceBasedWorkerTypes = ['hw', 'asha', 'colocated_sc_hw'];
    
    const performanceWorkers = workers.filter(worker => 
      performanceBasedWorkerTypes.includes(worker.worker_type.toLowerCase())
    );
    
    console.log(`\n✅ Performance-based workers (should be displayed):`);
    performanceWorkers.forEach(worker => {
      const config = workerConfigs.find(c => c.worker_type === worker.worker_type);
      const role = config?.worker_role || worker.worker_type.toUpperCase();
      console.log(`  - ${worker.name}: ${role} (₹${worker.allocated_amount})`);
    });
    
    const teamWorkers = workers.filter(worker => 
      teamBasedWorkerTypes.includes(worker.worker_type.toLowerCase())
    );
    
    console.log(`\n🚫 Team-based workers (should NOT be displayed):`);
    teamWorkers.forEach(worker => {
      const config = workerConfigs.find(c => c.worker_type === worker.worker_type);
      const role = config?.worker_role || worker.worker_type.toUpperCase();
      console.log(`  - ${worker.name}: ${role} (₹${worker.allocated_amount})`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testWorkerFiltering();
