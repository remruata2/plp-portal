import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function updateFacilitySpecificTargets() {
  try {
    console.log("🔧 Updating indicators with facility-specific targets...");

    // 1. Update TC001 (Teleconsultation)
    console.log("📝 Updating TC001 (Teleconsultation)...");
    await prisma.indicator.update({
      where: { code: "TC001" },
      data: {
        formula_config: {
          type: "PERCENTAGE_RANGE",
          range: {
            max: 50,
            min: 25,
          },
          targetValue: "25-50",
          targetFormula: "25 above, upto 50",
          calculationFormula: "(A/B)*100",
          facilitySpecificTargets: {
            SC_HWC: {
              range: {
                max: 25,
                min: 12,
              },
            },
            PHC: {
              range: {
                max: 50,
                min: 25,
              },
            },
            UPHC: {
              range: {
                max: 50,
                min: 25,
              },
            },
            U_HWC: {
              range: {
                max: 50,
                min: 25,
              },
            },
            A_HWC: {
              range: {
                max: 50,
                min: 25,
              },
            },
          },
        },
      },
    });

    // 2. Update EC001 (Elderly Clinic)
    console.log("📝 Updating EC001 (Elderly Clinic)...");
    await prisma.indicator.update({
      where: { code: "EC001" },
      data: {
        formula_config: {
          type: "PERCENTAGE_RANGE",
          range: {
            max: 100,
            min: 25,
          },
          targetValue: "25-100",
          targetFormula: "25% and above",
          calculationFormula: "(A/B)*100",
          facilitySpecificTargets: {
            SC_HWC: {
              range: {
                max: 100,
                min: 25,
              },
            },
            PHC: {
              range: {
                max: 100,
                min: 25,
              },
            },
            UPHC: {
              range: {
                max: 100,
                min: 25,
              },
            },
            U_HWC: {
              range: {
                max: 100,
                min: 25,
              },
            },
            A_HWC: {
              range: {
                max: 100,
                min: 25,
              },
            },
          },
        },
      },
    });

    // 3. Update DI001 (DVDMS Issues)
    console.log("📝 Updating DI001 (DVDMS Issues)...");
    await prisma.indicator.update({
      where: { code: "DI001" },
      data: {
        formula_config: {
          type: "PERCENTAGE_RANGE",
          range: {
            max: 100,
            min: 25,
          },
          targetValue: "25-100",
          targetFormula: "25% and above",
          calculationFormula: "(A/B)*100",
          facilitySpecificTargets: {
            SC_HWC: {
              range: {
                max: 100,
                min: 25,
              },
            },
            PHC: {
              range: {
                max: 100,
                min: 25,
              },
            },
            UPHC: {
              range: {
                max: 100,
                min: 25,
              },
            },
            U_HWC: {
              range: {
                max: 100,
                min: 25,
              },
            },
            A_HWC: {
              range: {
                max: 100,
                min: 25,
              },
            },
          },
        },
      },
    });

    console.log(
      "✅ All indicators updated with facility-specific targets successfully!"
    );
    console.log("\n📊 Updated Indicators:");
    console.log(
      "- TC001: Uses facility-specific targets (12-25 for SC, 25-50 for others)"
    );
    console.log("- EC001: Uses percentage range (25-100%) for all facilities");
    console.log("- DI001: Uses percentage range (25-100%) for all facilities");
  } catch (error) {
    console.error("❌ Error updating indicators:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateFacilitySpecificTargets()
  .then(() => {
    console.log("✅ Facility-specific targets update completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Facility-specific targets update failed:", error);
    process.exit(1);
  });
