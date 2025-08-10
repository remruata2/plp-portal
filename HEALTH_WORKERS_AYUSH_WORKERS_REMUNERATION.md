# Health Workers & AYUSH Workers Remuneration System

## 🎯 **Overview**

The PLP Portal now includes comprehensive remuneration calculation for **Health Workers** and **AYUSH Workers** based on facility performance. The system calculates worker incentives based on the overall facility performance percentage.

## 👥 **Worker Types**

### **🏥 Health Workers**

- **Type**: `health_worker`
- **Roles**: Doctors, Nurses, Medical Staff
- **Allocation**: Based on facility requirements
- **Remuneration**: Performance-based calculation

### **🧘 AYUSH Workers**

- **Type**: `ayush_worker`
- **Roles**: Ayurveda, Yoga, Unani, Siddha, Homeopathy practitioners
- **Allocation**: Based on facility requirements
- **Remuneration**: Performance-based calculation

## 💰 **Remuneration Calculation Logic**

### **Performance-Based Calculation**

```typescript
// Calculate performance percentage based on indicator achievements
const performancePercentage = (achievedIndicators / totalIndicators) * 100;

// Calculate worker remuneration
const calculatedAmount = (allocatedAmount * performancePercentage) / 100;
```

### **Example Calculation**

- **Total Indicators**: 20
- **Achieved Indicators**: 17
- **Performance Percentage**: (17/20) \* 100 = 85%
- **Worker Allocated Amount**: ₹15,000
- **Calculated Amount**: ₹15,000 \* 85% = ₹12,750

## 📊 **API Response Structure**

The facility reports API now returns comprehensive worker remuneration data:

```typescript
{
  reportMonth: "2025-08",
  totalIncentive: 15000,           // Facility indicator incentives
  totalWorkerRemuneration: 68000,  // Total worker remuneration
  totalRemuneration: 83000,        // Total facility + worker remuneration
  performancePercentage: 85.0,     // Overall performance percentage
  indicators: [...],               // Indicator performance data
  healthWorkers: [                 // Health Workers remuneration
    {
      id: 1,
      name: "Dr. John Smith",
      worker_type: "health_worker",
      allocated_amount: 15000,
      performance_percentage: 85.0,
      calculated_amount: 12750.00
    },
    // ... more health workers
  ],
  ayushWorkers: [                  // AYUSH Workers remuneration
    {
      id: 4,
      name: "Dr. Rajesh Kumar",
      worker_type: "ayush_worker",
      allocated_amount: 13000,
      performance_percentage: 85.0,
      calculated_amount: 11050.00
    },
    // ... more AYUSH workers
  ],
  summary: {
    totalIndicators: 20,
    achievedIndicators: 17,
    partialIndicators: 2,
    notAchievedIndicators: 1,
    healthWorkersCount: 3,
    ayushWorkersCount: 3
  }
}
```

## 🧪 **Test Results**

### **Sample Facility Performance**

- **Facility**: ITI UPHC
- **Performance**: 85% (17/20 indicators achieved)
- **Total Workers**: 6 (3 Health + 3 AYUSH)

### **Health Workers Remuneration**

| Name              | Allocated Amount | Performance | Calculated Amount |
| ----------------- | ---------------- | ----------- | ----------------- |
| Dr. John Smith    | ₹15,000          | 85%         | ₹12,750           |
| Dr. Sarah Johnson | ₹14,000          | 85%         | ₹11,900           |
| Nurse Mary Wilson | ₹12,000          | 85%         | ₹10,200           |
| **Total**         | **₹41,000**      | **85%**     | **₹34,850**       |

### **AYUSH Workers Remuneration**

| Name             | Allocated Amount | Performance | Calculated Amount |
| ---------------- | ---------------- | ----------- | ----------------- |
| Dr. Rajesh Kumar | ₹13,000          | 85%         | ₹11,050           |
| Dr. Priya Sharma | ₹12,500          | 85%         | ₹10,625           |
| Dr. Amit Patel   | ₹13,500          | 85%         | ₹11,475           |
| **Total**        | **₹39,000**      | **85%**     | **₹33,150**       |

### **Performance Scenarios**

| Scenario         | Performance | Sample Worker (₹15,000) |
| ---------------- | ----------- | ----------------------- |
| Excellent (100%) | 100%        | ₹15,000                 |
| Good (85%)       | 85%         | ₹12,750                 |
| Average (60%)    | 60%         | ₹9,000                  |
| Poor (30%)       | 30%         | ₹4,500                  |

## 🔧 **Implementation Details**

### **1. Database Schema**

```sql
-- Health Workers table
CREATE TABLE health_workers (
  id SERIAL PRIMARY KEY,
  facility_id VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  worker_type VARCHAR NOT NULL, -- 'health_worker' or 'ayush_worker'
  allocated_amount DECIMAL(10,2) NOT NULL,
  contact_number VARCHAR,
  email VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **2. API Logic**

```typescript
// Get health workers for the facility
const healthWorkers = await prisma.healthWorker.findMany({
  where: {
    facility_id: facilityId,
    is_active: true,
  },
});

// Calculate performance percentage
const performancePercentage = (achievedCount / indicators.length) * 100;

// Calculate worker remuneration
const healthWorkersRemuneration = healthWorkers
  .filter((worker) => worker.worker_type === "health_worker")
  .map((worker) => ({
    id: worker.id,
    name: worker.name,
    worker_type: "health_worker",
    allocated_amount: Number(worker.allocated_amount),
    performance_percentage: performancePercentage,
    calculated_amount:
      (Number(worker.allocated_amount) * performancePercentage) / 100,
  }));

const ayushWorkersRemuneration = healthWorkers
  .filter((worker) => worker.worker_type === "ayush_worker")
  .map((worker) => ({
    id: worker.id,
    name: worker.name,
    worker_type: "ayush_worker",
    allocated_amount: Number(worker.allocated_amount),
    performance_percentage: performancePercentage,
    calculated_amount:
      (Number(worker.allocated_amount) * performancePercentage) / 100,
  }));
```

## 📋 **Setup Instructions**

### **1. Seed Sample Workers**

```bash
npx tsx scripts/seed-health-workers.ts
```

### **2. Test Worker Remuneration**

```bash
npx tsx scripts/test-worker-remuneration.ts
```

### **3. View in Facility Reports**

- Navigate to `/facility/reports`
- View worker remuneration in the API response
- Check `healthWorkers` and `ayushWorkers` arrays

## 🎯 **Key Features**

### **✅ Performance-Based Calculation**

- Worker remuneration tied to facility performance
- Fair distribution based on achievement percentage
- Transparent calculation logic

### **✅ Multiple Worker Types**

- Support for Health Workers and AYUSH Workers
- Different allocation amounts per worker
- Individual performance tracking

### **✅ Comprehensive Reporting**

- Detailed worker remuneration breakdown
- Performance percentage calculation
- Total remuneration summary

### **✅ Flexible Allocation**

- Configurable allocated amounts per worker
- Support for different worker types
- Active/inactive worker management

## 🚀 **Benefits**

1. **Fair Remuneration**: Workers receive remuneration based on facility performance
2. **Transparency**: Clear calculation logic and performance metrics
3. **Comprehensive Coverage**: Support for both Health and AYUSH workers
4. **Performance Incentive**: Encourages better facility performance
5. **Detailed Reporting**: Complete breakdown of worker remuneration

## 📊 **Usage Examples**

### **API Response Example**

```json
{
  "reportMonth": "2025-08",
  "totalIncentive": 15000,
  "totalWorkerRemuneration": 68000,
  "totalRemuneration": 83000,
  "performancePercentage": 85.0,
  "healthWorkers": [
    {
      "id": 1,
      "name": "Dr. John Smith",
      "worker_type": "health_worker",
      "allocated_amount": 15000,
      "performance_percentage": 85.0,
      "calculated_amount": 12750.0
    }
  ],
  "ayushWorkers": [
    {
      "id": 4,
      "name": "Dr. Rajesh Kumar",
      "worker_type": "ayush_worker",
      "allocated_amount": 13000,
      "performance_percentage": 85.0,
      "calculated_amount": 11050.0
    }
  ]
}
```

**The Health Workers and AYUSH Workers remuneration system is now fully integrated with the facility reports!** 🎉
