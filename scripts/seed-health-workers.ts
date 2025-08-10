import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function seedHealthWorkers() {
  console.log("🌱 Seeding Health Workers and AYUSH Workers...\n");

  try {
    // Get a sample facility
    const facility = await prisma.facility.findFirst();

    if (!facility) {
      console.log("❌ No facility found for seeding workers");
      return;
    }

    console.log(`🏥 Seeding workers for facility: ${facility.name}`);

    // Sample health workers data
    const healthWorkersData = [
      {
        name: "Dr. John Smith",
        worker_type: "health_worker",
        allocated_amount: 15000,
        contact_number: "9876543210",
        email: "john.smith@facility.com",
      },
      {
        name: "Dr. Sarah Johnson",
        worker_type: "health_worker",
        allocated_amount: 14000,
        contact_number: "9876543211",
        email: "sarah.johnson@facility.com",
      },
      {
        name: "Nurse Mary Wilson",
        worker_type: "health_worker",
        allocated_amount: 12000,
        contact_number: "9876543212",
        email: "mary.wilson@facility.com",
      },
      {
        name: "Dr. Rajesh Kumar",
        worker_type: "ayush_worker",
        allocated_amount: 13000,
        contact_number: "9876543213",
        email: "rajesh.kumar@facility.com",
      },
      {
        name: "Dr. Priya Sharma",
        worker_type: "ayush_worker",
        allocated_amount: 12500,
        contact_number: "9876543214",
        email: "priya.sharma@facility.com",
      },
      {
        name: "Dr. Amit Patel",
        worker_type: "ayush_worker",
        allocated_amount: 13500,
        contact_number: "9876543215",
        email: "amit.patel@facility.com",
      },
    ];

    // Create health workers
    const createdWorkers = [];
    for (const workerData of healthWorkersData) {
      const worker = await prisma.healthWorker.create({
        data: {
          facility_id: facility.id,
          name: workerData.name,
          worker_type: workerData.worker_type,
          allocated_amount: workerData.allocated_amount,
          contact_number: workerData.contact_number,
          email: workerData.email,
          is_active: true,
        },
      });
      createdWorkers.push(worker);
      console.log(
        `✅ Created ${workerData.worker_type}: ${workerData.name} (₹${workerData.allocated_amount})`
      );
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total Workers Created: ${createdWorkers.length}`);
    console.log(
      `   Health Workers: ${
        createdWorkers.filter((w) => w.worker_type === "health_worker").length
      }`
    );
    console.log(
      `   AYUSH Workers: ${
        createdWorkers.filter((w) => w.worker_type === "ayush_worker").length
      }`
    );
    console.log(
      `   Total Allocated Amount: ₹${createdWorkers.reduce(
        (sum, w) => sum + Number(w.allocated_amount),
        0
      )}`
    );

    console.log("\n✅ Health workers seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding health workers:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedHealthWorkers();
