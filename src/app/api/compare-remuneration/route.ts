import { NextRequest, NextResponse } from "next/server";
import { HealthDataRemunerationService } from "@/lib/services/health-data-remuneration.service";

export async function POST(request: NextRequest) {
  try {
    const { facilityId, reportMonth, fieldValues } = await request.json();

    if (!facilityId || !reportMonth || !fieldValues) {
      return NextResponse.json(
        { error: "Missing required fields: facilityId, reportMonth, fieldValues" },
        { status: 400 }
      );
    }

    console.log(`🔄 COMPARISON: Starting comparison test for facility ${facilityId}, month ${reportMonth}`);
    console.log(`🔄 COMPARISON: Field values count: ${fieldValues.length}`);

    // Test 1: Call the new service
    console.log(`\n🧪 COMPARISON: Testing NEW SERVICE...`);
    const serviceStartTime = Date.now();
    const serviceResult = await HealthDataRemunerationService.processHealthDataRemuneration(
      facilityId,
      reportMonth + "-service", // Use different month suffix to avoid conflicts
      fieldValues
    );
    const serviceEndTime = Date.now();

    // Test 2: Call the original health-data route logic (simulate the POST request)
    console.log(`\n🏠 COMPARISON: Testing ORIGINAL ROUTE...`);
    const routeStartTime = Date.now();
    
    // Make a request to the original health-data endpoint
    const routeResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3007'}/api/health-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        facilityId,
        reportMonth: reportMonth + "-route", // Use different month suffix to avoid conflicts
        fieldValues
      })
    });
    
    const routeResult = await routeResponse.json();
    const routeEndTime = Date.now();

    // Compare results
    console.log(`\n📊 COMPARISON RESULTS:`);
    console.log(`⏱️  Service Time: ${serviceEndTime - serviceStartTime}ms`);
    console.log(`⏱️  Route Time: ${routeEndTime - routeStartTime}ms`);

    if (serviceResult.success && routeResult.success) {
      const routeRemuneration = routeResult.data?.remuneration;
      
      console.log(`\n💰 FACILITY REMUNERATION:`);
      console.log(`   Service: ₹${serviceResult.facilityRemuneration.toFixed(2)}`);
      console.log(`   Route:   ₹${routeRemuneration?.facilityRemuneration?.toFixed(2) || 'N/A'}`);
      console.log(`   Match:   ${Math.abs(serviceResult.facilityRemuneration - (routeRemuneration?.facilityRemuneration || 0)) < 0.01 ? '✅' : '❌'}`);

      console.log(`\n👥 WORKER REMUNERATION:`);
      console.log(`   Service: ₹${serviceResult.totalWorkerRemuneration.toFixed(2)}`);
      console.log(`   Route:   ₹${routeRemuneration?.totalWorkerRemuneration?.toFixed(2) || 'N/A'}`);
      console.log(`   Match:   ${Math.abs(serviceResult.totalWorkerRemuneration - (routeRemuneration?.totalWorkerRemuneration || 0)) < 0.01 ? '✅' : '❌'}`);

      console.log(`\n🎯 TOTAL REMUNERATION:`);
      console.log(`   Service: ₹${serviceResult.totalRemuneration.toFixed(2)}`);
      console.log(`   Route:   ₹${routeRemuneration?.totalRemuneration?.toFixed(2) || 'N/A'}`);
      console.log(`   Match:   ${Math.abs(serviceResult.totalRemuneration - (routeRemuneration?.totalRemuneration || 0)) < 0.01 ? '✅' : '❌'}`);

      console.log(`\n📈 PERFORMANCE PERCENTAGE:`);
      console.log(`   Service: ${serviceResult.performancePercentage.toFixed(2)}%`);
      console.log(`   Route:   ${routeRemuneration?.performancePercentage?.toFixed(2) || 'N/A'}%`);
      console.log(`   Match:   ${Math.abs(serviceResult.performancePercentage - (routeRemuneration?.performancePercentage || 0)) < 0.01 ? '✅' : '❌'}`);

      console.log(`\n📋 RECORD COUNTS:`);
      console.log(`   Service Indicators: ${serviceResult.indicatorRecords.length}`);
      console.log(`   Service Workers:    ${serviceResult.workerRecords.length}`);
      console.log(`   Route Workers:      ${routeRemuneration?.healthWorkersCount + routeRemuneration?.ashaWorkersCount || 'N/A'}`);
    }

    // Determine if results match
    const routeRemuneration = routeResult.data?.remuneration;
    const resultsMatch = serviceResult.success && routeResult.success && routeRemuneration &&
      Math.abs(serviceResult.facilityRemuneration - (routeRemuneration.facilityRemuneration || 0)) < 0.01 &&
      Math.abs(serviceResult.totalWorkerRemuneration - (routeRemuneration.totalWorkerRemuneration || 0)) < 0.01 &&
      Math.abs(serviceResult.totalRemuneration - (routeRemuneration.totalRemuneration || 0)) < 0.01 &&
      Math.abs(serviceResult.performancePercentage - (routeRemuneration.performancePercentage || 0)) < 0.01;

    console.log(`\n🎯 OVERALL COMPARISON: ${resultsMatch ? '✅ RESULTS MATCH!' : '❌ RESULTS DIFFER!'}`);

    return NextResponse.json({
      success: true,
      message: "Comparison completed",
      resultsMatch,
      comparison: {
        service: {
          success: serviceResult.success,
          facilityRemuneration: serviceResult.facilityRemuneration,
          totalWorkerRemuneration: serviceResult.totalWorkerRemuneration,
          totalRemuneration: serviceResult.totalRemuneration,
          performancePercentage: serviceResult.performancePercentage,
          indicatorRecordsCount: serviceResult.indicatorRecords.length,
          workerRecordsCount: serviceResult.workerRecords.length,
          executionTime: serviceEndTime - serviceStartTime,
          error: serviceResult.error
        },
        route: {
          success: routeResult.success,
          facilityRemuneration: routeRemuneration?.facilityRemuneration,
          totalWorkerRemuneration: routeRemuneration?.totalWorkerRemuneration,
          totalRemuneration: routeRemuneration?.totalRemuneration,
          performancePercentage: routeRemuneration?.performancePercentage,
          healthWorkersCount: routeRemuneration?.healthWorkersCount,
          ashaWorkersCount: routeRemuneration?.ashaWorkersCount,
          executionTime: routeEndTime - routeStartTime,
          error: routeResult.error
        },
        differences: {
          facilityRemuneration: Math.abs(serviceResult.facilityRemuneration - (routeRemuneration?.facilityRemuneration || 0)),
          totalWorkerRemuneration: Math.abs(serviceResult.totalWorkerRemuneration - (routeRemuneration?.totalWorkerRemuneration || 0)),
          totalRemuneration: Math.abs(serviceResult.totalRemuneration - (routeRemuneration?.totalRemuneration || 0)),
          performancePercentage: Math.abs(serviceResult.performancePercentage - (routeRemuneration?.performancePercentage || 0))
        }
      }
    });

  } catch (error) {
    console.error("🔄 COMPARISON: Error:", error);
    return NextResponse.json(
      { 
        error: "Comparison failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
