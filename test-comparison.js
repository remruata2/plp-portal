// Simple test script to compare route vs service
// Run this with: node test-comparison.js

const testData = {
  "facilityId": "cme7p4wr2006z1frfps7kpp00",
  "reportMonth": "2025-08-test", // Use different month to avoid conflicts
  "compare": true, // Enable comparison mode
  "fieldValues": [
    {
      "fieldId": "cme7p4ugk00051fjmv8ushcjh",
      "value": "17"
    },
    {
      "fieldId": "cme7p4ugk00061fjmv8ushcji",
      "value": "60"
    },
    {
      "fieldId": "cme7p4ugk00071fjmv8ushcjj",
      "value": "67"
    },
    {
      "fieldId": "cme7p4ugk00081fjmv8ushcjk",
      "value": "24"
    },
    {
      "fieldId": "cme7p4ugk00091fjmv8ushcjl",
      "value": "10"
    },
    {
      "fieldId": "cme7p4ugk000a1fjmv8ushcjm",
      "value": "57"
    },
    {
      "fieldId": "cme7p4ugk000b1fjmv8ushcjn",
      "value": "8"
    },
    {
      "fieldId": "cme7p4ugk000c1fjmv8ushcjo",
      "value": "7"
    },
    {
      "fieldId": "cme7p4ugk000d1fjmv8ushcjp",
      "value": "8"
    },
    {
      "fieldId": "cme7p4ugk000e1fjmv8ushcjq",
      "value": "14"
    },
    {
      "fieldId": "cme7p4ugk000f1fjmv8ushcjr",
      "value": "1"
    },
    {
      "fieldId": "cme7p4ugk000g1fjmv8ushcjs",
      "value": "124"
    },
    {
      "fieldId": "cme7p4ugk000h1fjmv8ushcjt",
      "value": "12"
    },
    {
      "fieldId": "cme7p4ugk000i1fjmv8ushcju",
      "value": "3"
    },
    {
      "fieldId": "cme7p4ugk000j1fjmv8ushcjv",
      "value": "27"
    },
    {
      "fieldId": "cme7p4ugk000k1fjmv8ushcjw",
      "value": "4"
    },
    {
      "fieldId": "cme7p4ugk000l1fjmv8ushcjx",
      "value": "24"
    },
    {
      "fieldId": "cme7p4ugk000m1fjmv8ushcjy",
      "value": "8"
    },
    {
      "fieldId": "cme7p4ugk000n1fjmv8ushcjz",
      "value": "37"
    },
    {
      "fieldId": "cme7p4ugk000o1fjmv8ushck0",
      "value": "235"
    },
    {
      "fieldId": "cme7p4ugk000p1fjmv8ushck1",
      "value": "50"
    },
    {
      "fieldId": "cme7p4ugk000q1fjmv8ushck2",
      "value": "6"
    }
  ]
};

async function testComparison() {
  try {
    console.log('🧪 Testing comparison mode...');
    
    const response = await fetch('http://localhost:3007/api/health-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You'll need to add your auth token here
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Test completed successfully!');
      console.log('📊 Comparison result:', result.data?.comparison?.match ? '✅ MATCH' : '❌ DIFFER');
      
      if (result.data?.comparison) {
        console.log('\n📈 Details:');
        console.log('Route Facility Remuneration:', result.data.remuneration?.facilityRemuneration);
        console.log('Service Facility Remuneration:', result.data.comparison.service?.facilityRemuneration);
        console.log('Route Total Remuneration:', result.data.remuneration?.totalRemuneration);
        console.log('Service Total Remuneration:', result.data.comparison.service?.totalRemuneration);
      }
    } else {
      console.error('❌ Test failed:', result);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testComparison();
