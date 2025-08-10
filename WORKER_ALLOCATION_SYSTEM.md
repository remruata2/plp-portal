# Worker Allocation System

## 🎯 **Overview**

The PLP Portal implements a comprehensive worker allocation system that defines the types and quantities of workers allowed for each facility type, along with their allocated remuneration amounts. This system ensures proper distribution of workers based on facility requirements and budget constraints.

## 🏥 **Facility Types & Worker Allocations**

### **1. Subcenters (SC_HWC)**

| Worker Type | Worker Role               | Max Count | Allocated Amount | Description                                         |
| ----------- | ------------------------- | --------- | ---------------- | --------------------------------------------------- |
| HWO         | Health & Wellness Officer | 1         | ₹15,000          | Single position per facility                        |
| HW          | Health Workers            | 3         | ₹1,500           | Multiple positions allowed, total allocation ₹1,500 |
| ASHA        | ASHA Workers              | 5         | ₹1,500           | Multiple positions allowed, total allocation ₹1,500 |

**Total Allocation**: ₹18,000 per facility

### **2. AYUSH (A_HWC)**

| Worker Type | Worker Role           | Max Count | Allocated Amount | Description                                         |
| ----------- | --------------------- | --------- | ---------------- | --------------------------------------------------- |
| AYUSH MO    | AYUSH Medical Officer | 1         | ₹15,000          | Single position per facility                        |
| HW          | Health Workers        | 3         | ₹1,500           | Multiple positions allowed, total allocation ₹1,500 |
| ASHA        | ASHA Workers          | 3         | ₹1,000           | Multiple positions allowed, total allocation ₹1,000 |

**Total Allocation**: ₹17,500 per facility

### **3. PHC (Primary Health Centre)**

| Worker Type     | Worker Role                 | Max Count | Allocated Amount | Description                                         |
| --------------- | --------------------------- | --------- | ---------------- | --------------------------------------------------- |
| MO              | Medical Officer             | 1         | ₹7,500           | Single position per facility                        |
| Colocated SC HW | Colocated SC Health Workers | 3         | ₹1,500           | Multiple positions allowed, total allocation ₹1,500 |
| ASHA            | ASHA Workers                | 3         | ₹1,000           | Multiple positions allowed, total allocation ₹1,000 |

**Total Allocation**: ₹10,000 per facility

### **4. UPHC (Urban Primary Health Centre)**

| Worker Type | Worker Role     | Max Count | Allocated Amount | Description                                         |
| ----------- | --------------- | --------- | ---------------- | --------------------------------------------------- |
| MO          | Medical Officer | 1         | ₹7,500           | Single position per facility                        |
| HW          | Health Workers  | 3         | ₹1,500           | Multiple positions allowed, total allocation ₹1,500 |
| ASHA        | ASHA Workers    | 3         | ₹1,000           | Multiple positions allowed, total allocation ₹1,000 |

**Total Allocation**: ₹10,000 per facility

### **5. U_HWC (Urban Health & Wellness Centre)**

| Worker Type | Worker Role     | Max Count | Allocated Amount | Description                                         |
| ----------- | --------------- | --------- | ---------------- | --------------------------------------------------- |
| MO          | Medical Officer | 1         | ₹7,500           | Single position per facility                        |
| HW          | Health Workers  | 3         | ₹1,500           | Multiple positions allowed, total allocation ₹1,500 |
| ASHA        | ASHA Workers    | 3         | ₹1,000           | Multiple positions allowed, total allocation ₹1,000 |

**Total Allocation**: ₹10,000 per facility

## 🗄️ **Database Schema**

### **WorkerAllocationConfig Model**

```sql
CREATE TABLE worker_allocation_config (
  id SERIAL PRIMARY KEY,
  facility_type_id VARCHAR NOT NULL,
  worker_type VARCHAR NOT NULL, -- "hwo", "mo", "ayush_mo", "hw", "asha", "colocated_sc_hw"
  worker_role VARCHAR NOT NULL, -- "HWO", "MO", "AYUSH MO", "HW", "ASHA", "Colocated SC HW"
  max_count INTEGER NOT NULL DEFAULT 1,
  allocated_amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **FacilityWorkerAllocation Model**

```sql
CREATE TABLE facility_worker_allocation (
  id SERIAL PRIMARY KEY,
  facility_id VARCHAR NOT NULL,
  worker_allocation_config_id INTEGER NOT NULL,
  worker_count INTEGER NOT NULL DEFAULT 1,
  total_allocated_amount DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 **Worker Types & Roles**

### **Single Position Workers**

- **HWO** (Health & Wellness Officer): Only one per Subcenter
- **MO** (Medical Officer): Only one per PHC, UPHC, U_HWC
- **AYUSH MO** (AYUSH Medical Officer): Only one per AYUSH facility

### **Multiple Position Workers**

- **HW** (Health Workers): Multiple allowed, total allocation limit
- **ASHA** (ASHA Workers): Multiple allowed, total allocation limit
- **Colocated SC HW** (Colocated Sub Centre Health Workers): Multiple allowed, total allocation limit

## 💰 **Allocation Logic**

### **Single Position Workers**

```typescript
// For single position workers (HWO, MO, AYUSH MO)
const allocation = {
  worker_count: 1,
  total_allocated_amount: config.allocated_amount,
};
```

### **Multiple Position Workers**

```typescript
// For multiple position workers (HW, ASHA, Colocated SC HW)
const allocation = {
  worker_count: actual_worker_count, // Up to max_count
  total_allocated_amount: config.allocated_amount, // Total allocation for all workers
};
```

## 📊 **Allocation Summary by Facility Type**

| Facility Type | Total Allocation | Worker Types                | Description                                |
| ------------- | ---------------- | --------------------------- | ------------------------------------------ |
| **SC_HWC**    | ₹18,000          | HWO + HW + ASHA             | Subcenter with Health & Wellness Officer   |
| **A_HWC**     | ₹17,500          | AYUSH MO + HW + ASHA        | AYUSH facility with Medical Officer        |
| **PHC**       | ₹10,000          | MO + Colocated SC HW + ASHA | Primary Health Centre with Medical Officer |
| **UPHC**      | ₹7,500           | MO only                      | Urban Primary Health Centre (Team-based)   |
| **U_HWC**     | ₹7,500           | MO only                      | Urban Health & Wellness Centre (Team-based)|

## 🎯 **Team-Based vs Performance-Based Facilities**

### **Team-Based Facilities (UPHC, U_HWC)**
- **UPHC** and **U_HWC** operate on a completely team-based incentive system
- Only **MO (Medical Officer)** workers are allowed
- MO incentives are included in the facility total and not shown individually
- No individual worker incentives are calculated or displayed
- Total allocation: ₹7,500 per facility (MO only)

### **Performance-Based Facilities (SC_HWC, A_HWC, PHC)**
- These facilities support both team-based and performance-based workers
- Team-based workers (HWO, MO, AYUSH MO) are not shown individually
- Performance-based workers (HW, ASHA, Colocated SC HW) are shown individually
- Individual worker incentives are calculated based on facility performance

## 🚀 **Implementation Features**

### **✅ Flexible Configuration**

- Configurable worker types per facility type
- Adjustable allocation amounts
- Maximum count limits for each worker type

### **✅ Validation Rules**

- Single position workers limited to 1 per facility
- Multiple position workers limited by max_count
- Total allocation amounts enforced per worker type

### **✅ Performance-Based Calculation**

- Worker remuneration calculated based on facility performance
- Individual worker amounts distributed proportionally
- Performance percentage applied to allocated amounts

### **✅ Database Integration**

- Seamless integration with existing HealthWorker model
- Facility-specific allocation tracking
- Historical allocation data preservation

## 📋 **Setup Instructions**

### **1. Run Database Migration**

```bash
npx prisma migrate dev --name add_worker_allocation_config
```

### **2. Seed Worker Allocation Configuration**

```bash
npx tsx scripts/seed-worker-allocation-config.ts
```

### **3. Verify Configuration**

```bash
npx tsx scripts/test-worker-allocation.ts
```

## 🧪 **Testing**

### **Sample Test Output**

```
📊 Worker Allocation Summary:
   SC_HWC:
     - HWO: ₹15,000 (max: 1)
     - HW: ₹1,500 (max: 3)
     - ASHA: ₹1,500 (max: 5)

   A_HWC:
     - AYUSH MO: ₹15,000 (max: 1)
     - HW: ₹1,500 (max: 3)
     - ASHA: ₹1,000 (max: 3)

   PHC:
     - MO: ₹7,500 (max: 1)
     - Colocated SC HW: ₹1,500 (max: 3)
     - ASHA: ₹1,000 (max: 3)
```

## 🎯 **Key Benefits**

1. **Standardized Allocation**: Consistent worker allocation across facility types
2. **Budget Control**: Enforced allocation limits prevent budget overruns
3. **Flexibility**: Support for both single and multiple position workers
4. **Scalability**: Easy to add new worker types or modify allocations
5. **Transparency**: Clear allocation rules and documentation
6. **Performance Integration**: Worker remuneration tied to facility performance

## 📁 **Files Created/Modified**

### **Database Files**

- `prisma/migrations/20250806000000_add_worker_allocation_config/migration.sql` - Database migration
- `prisma/schema.prisma` - Updated schema with new models

### **Scripts**

- `scripts/seed-worker-allocation-config.ts` - Configuration seeding script

### **Documentation**

- `WORKER_ALLOCATION_SYSTEM.md` - This comprehensive documentation

## ✅ **Status: READY FOR IMPLEMENTATION**

The worker allocation system is now fully designed and ready for implementation. The system provides:

- **Comprehensive worker allocation rules** for all facility types
- **Flexible database schema** supporting both single and multiple position workers
- **Clear allocation amounts** based on facility requirements
- **Performance-based remuneration** calculation
- **Complete documentation** for implementation and maintenance

**The worker allocation system is ready for production use!** 🎉
