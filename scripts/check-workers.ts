import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function checkWorkers() {
  try {
    console.log("🔍 Checking workers in database...\n");
    
    // Get all workers
    const workers = await prisma.health_workers.findMany({
      include: {
        facility: {
          include: {
            facility_type: true,
          },
        },
      },
    });
    
    console.log(`📋 Found ${workers.length} total workers\n`);
    
    // Group by facility
    const workersByFacility = workers.reduce((acc, worker) => {
      const facilityName = worker.facility.name;
      if (!acc[facilityName]) {
        acc[facilityName] = {
          facilityType: worker.facility.facility_type.name,
          workers: [],
        };
      }
      acc[facilityName].workers.push({
        id: worker.id,
        name: worker.name,
        workerType: worker.worker_type,
        allocatedAmount: Number(worker.allocated_amount),
        isActive: worker.is_active,
      });
      return acc;
    }, {} as Record<string, any>);
    
    // Display workers by facility
    Object.entries(workersByFacility).forEach(([facilityName, data]) => {
      console.log(`🏥 ${facilityName} (${data.facilityType})`);
      data.workers.forEach((worker: any) => {
        console.log(`  👤 ${worker.name} - ${worker.workerType} - ₹${worker.allocatedAmount} - ${worker.isActive ? 'Active' : 'Inactive'}`);
      });
      console.log("");
    });
    
    // Check worker allocation config
    console.log("⚙️ Worker Allocation Configuration:");
    const configs = await prisma.worker_allocation_config.findMany({
      include: {
        facility_type: true,
      },
    });
    
    configs.forEach(config => {
      console.log(`  ${config.facility_type.name}: ${config.worker_type} -> ${config.worker_role} (₹${config.allocated_amount}, max: ${config.max_count})`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkWorkers();
