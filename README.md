# PLP Portal - Health and Family Welfare Portal

A comprehensive healthcare monitoring system with **field-based auto-calculation** for managing facility data, performance tracking, and incentive determination.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and Install Dependencies**

   ```bash
   git clone <repository-url>
   cd plp-portal
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database Setup**

   ```bash
   # Complete system setup (recommended)
   npm run setup:complete

   # Or step by step:
   npm run db:push          # Push schema changes
   npm run seed:complete    # Complete field-based seeding
   npm run setup:mappings   # Setup facility field mappings
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📊 Field-Based Auto-Calculation System

### 🎯 **New Architecture: Facilities Submit Fields → Indicators Auto-Calculate**

The system now uses a **field-based auto-calculation architecture** where:

1. **Facilities submit field values** (e.g., `total_footfall: 150`, `wellness_sessions_conducted: 8`)
2. **Indicators automatically calculate** using field-based formulas
3. **Incentives automatically determine** based on achievement percentages

### System Flow

```
Facility submits field values
         ↓
Field values stored in FieldValue table
         ↓
AutoIndicatorCalculator triggers
         ↓
Indicators calculated using formulas
         ↓
Results stored in MonthlyHealthData
         ↓
Incentives calculated based on achievement
```

### Field Categories

#### **Admin Fields** (Pre-filled by administrators)

- `total_population` - Total population of catchment area
- `population_18_plus` - Population aged 18+
- `population_30_plus` - Population aged 30+
- `population_30_plus_female` - Female population 30+
- `anc_due_list` - ANC due list
- `ri_sessions_planned` - RI sessions planned
- `ri_beneficiaries_due` - RI beneficiaries due
- `bedridden_patients` - Bed-ridden patients
- `pulmonary_tb_patients` - Pulmonary TB patients
- `total_tb_patients` - Total TB patients
- `ncd_referred_from_sc` - NCD referred from SC
- `patient_satisfaction_max` - Patient satisfaction max score

#### **Facility Fields** (Submitted by facilities)

- `total_footfall` - Total footfall
- `wellness_sessions_conducted` - Wellness sessions
- `prakriti_parikshan_conducted` - Prakriti Parikshan
- `teleconsultation_conducted` - Teleconsultation
- `anc_footfall` - ANC footfall
- `anc_tested_hb` - ANC tested for Hb
- `tb_screenings` - TB screenings
- `tb_contact_tracing_households` - TB contact tracing
- `tb_differentiated_care_visits` - TB differentiated care
- `ri_sessions_held` - RI sessions held
- `ri_footfall` - RI footfall
- `cbac_forms_filled` - CBAC forms filled
- `htn_screened` - HTN screened
- `dm_screened` - DM screened
- `oral_cancer_screened` - Oral cancer screened
- `breast_cervical_cancer_screened` - Breast & cervical cancer screened
- `ncd_diagnosed_tx_completed` - NCD diagnosed & treatment completed
- `patient_satisfaction_score` - Patient satisfaction score
- `elderly_palliative_visits` - Elderly & palliative visits
- `elderly_clinic_conducted` - Elderly clinic conducted
- `jas_meetings_conducted` - JAS meetings conducted
- `dvdms_issues_generated` - DVDMS issues generated
- `elderly_support_group_formed` - Elderly support group formed (binary)
- `elderly_support_group_activity` - Elderly support group activity (binary)

### Target Fields (Generic targets for facility-specific indicators)

- `target_wellness_sessions_generic` - Target wellness sessions (default: 10)
- `target_teleconsultation_generic` - Target teleconsultation (default: 50)
- `target_elderly_clinic_generic` - Target elderly clinic (default: 4)
- `target_jas_meetings_generic` - Target JAS meetings (default: 4)
- `target_dvdms_generic` - Target DVDMS issues (default: 50)

## 🔄 Auto-Calculation System

### API Endpoints

#### 1. Submit Field Values

```http
POST /api/facility/field-values
Content-Type: application/json

{
  "facility_id": "123",
  "report_month": "2024-01",
  "field_values": [
    {
      "field_code": "total_footfall",
      "value": 150,
      "remarks": "Monthly footfall count"
    },
    {
      "field_code": "wellness_sessions_conducted",
      "value": 8,
      "remarks": "Wellness sessions held"
    }
  ]
}
```

#### 2. Get Field Values

```http
GET /api/facility/field-values?facility_id=123&report_month=2024-01
```

#### 3. Get Calculated Indicators

```http
GET /api/facility/indicators?facility_id=123&report_month=2024-01
```

### Indicator Formulas

#### 1. Total Footfall (TF001)

- **Formula**: `(total_footfall / total_population) * 100`
- **Target**: 5%
- **Range**: 3-5%

#### 2. Wellness Sessions (WS001)

- **Formula**: `(wellness_sessions_conducted / target_wellness_sessions_generic) * 100`
- **Target**: 100%
- **Range**: 5-10 sessions

#### 3. Teleconsultation (TC001)

- **Formula**: `(teleconsultation_conducted / target_teleconsultation_generic) * 100`
- **Target**: 100%
- **Range**: 25-50

#### 4. ANC Footfall (AF001)

- **Formula**: `(anc_footfall / anc_due_list) * 100`
- **Target**: 100%
- **Cap**: 50%
- **Condition**: NA if ANC due is 0

#### 5. TB Screenings (TS001)

- **Formula**: `(tb_screenings / total_footfall) * 100`
- **Target**: 100%
- **Cap**: 50%

### Facility Type Field Mappings

#### PHC

- All facility fields except `prakriti_parikshan_conducted`
- Includes NCD diagnosis and treatment

#### UPHC

- Limited set: footfall, wellness, teleconsultation, TB screening, NCD, patient satisfaction, elderly clinic, JAS, DVDMS

#### SC_HWC

- All facility fields except `prakriti_parikshan_conducted` and NCD fields
- Includes elderly support group fields

#### U_HWC

- Limited set: footfall, wellness, teleconsultation, TB-related fields, elderly fields, JAS, DVDMS

#### A_HWC

- All facility fields including `prakriti_parikshan_conducted`
- Complete set of fields

## 🗄️ Database Management

### Schema Management

The project uses Prisma ORM for database management. The schema is defined in `prisma/schema.prisma`.

### Complete System Setup

For a fresh database setup with auto-calculation:

```bash
# Complete system setup
npx tsx scripts/setup-complete-system.ts
```

This script:

1. **Clears existing data**
2. **Seeds fields** (41 fields across all categories)
3. **Seeds indicators** (24 indicators with field mappings)
4. **Sets up facility field mappings**
5. **Enables auto-calculation system**

### Seeding Process

#### 1. Field Seeding (`prisma/seed-fields-complete.ts`)

Creates all foundational fields that indicators will reference:

```bash
npx tsx prisma/seed-fields-complete.ts
```

**Creates:**

- 41 fields across all categories
- Admin-managed data fields
- Facility-submitted data fields
- Target fields for dynamic calculations

#### 2. Indicator Seeding (`prisma/seed-indicators-from-fields.ts`)

Creates indicators that reference the seeded fields:

```bash
npx tsx prisma/seed-indicators-from-fields.ts
```

**Creates:**

- **24 field-based indicators** with simplified target system
- **3 Target Types Only**: PERCENTAGE_RANGE, RANGE, BINARY
- Proper numerator/denominator field mappings
- Worker allocation configurations per facility type
- Conditional logic for TB-related indicators

#### 3. Facility Field Mappings (`scripts/setup-facility-field-mappings.ts`)

Maps fields to facility types:

```bash
npx tsx scripts/setup-facility-field-mappings.ts
```

**Creates:**

- Facility-specific field assignments
- Display order configuration
- Required field settings

### Verification

#### Verify Indicator Mappings

```bash
npx tsx scripts/verify-indicator-mappings.ts
```

This script checks that all indicators have proper field mappings and shows:

- Numerator field assignments
- Denominator field assignments
- Target field assignments
- Formula configurations

## 🏥 Enhanced Indicators System

### Field-Based Indicator Structure

Each indicator references specific fields with **simplified target system**:

```typescript
{
  code: "TF001_PHC",
  name: "Total Footfall (M&F) - PHC",
  numerator_field_id: 22,        // total_footfall_phc_colocated_sc
  denominator_field_id: 1,       // total_population
  target_type: "PERCENTAGE_RANGE", // Only 3 types: PERCENTAGE_RANGE, RANGE, BINARY
  target_value: '{"min":3,"max":5}',
  target_formula: "3%-5%",
  applicable_facility_types: ["PHC"],
  worker_allocation: {
    mo: 500  // Medical Officer allocation
  }
}
```

### Key Indicators with Field References

| Code  | Name                     | Numerator Field                 | Denominator Field                | Target Field                     |
| ----- | ------------------------ | ------------------------------- | -------------------------------- | -------------------------------- |
| TF001 | Total Footfall           | total_footfall                  | total_population                 | total_population                 |
| WS001 | Wellness Sessions        | wellness_sessions_conducted     | target_wellness_sessions_generic | target_wellness_sessions_generic |
| BC001 | Breast & Cervical Cancer | breast_cervical_cancer_screened | population_30_plus_female        | population_30_plus_female        |
| TC001 | Teleconsultation         | teleconsultation_conducted      | target_teleconsultation_generic  | target_teleconsultation_generic  |

### Auto-Calculation Engine

The system includes an automatic calculation engine:

#### AutoIndicatorCalculator

- **Triggers automatically** when field values are updated
- **Calculates all applicable indicators** for a facility/month
- **Updates MonthlyHealthData** with calculated results
- **Supports binary indicators** with special handling

#### FormulaCalculator

- **3 Simplified Target Types**:
  - `PERCENTAGE_RANGE`: "50-100%", "70-100%", "3%-5%" 
  - `RANGE`: "5-10 sessions", "25-50 calls", "10-20 issues"
  - `BINARY`: "100%", "1", "Yes"
- **Linear Incentive Distribution**: 50% performance = 50% incentives
- **Facility-specific worker allocations** (HWO, MO, Ayush MO, HW, ASHA)
- **Conditional calculations** for TB-related indicators

## 👥 User Management

### User Types

The system supports two user types:

- **Admin**: Full system access for administrators
- **Facility**: Limited access for healthcare facility staff

### Creating Users

#### 1. Automatic Facility User Creation

The system includes scripts to automatically create users for all facilities:

```bash
# Create users for all facilities
npx tsx scripts/create-facility-users.ts

# Check user roles and distribution
npx tsx scripts/check-user-roles.ts
```

#### 2. User Credentials

**Admin User:**

- Username: `admin`
- Password: `admin`
- Role: `admin`

**Facility Users:**

- Username: `facilityname` (lowercase, no spaces)
- Password: `facility123` (common for all facility users)
- Email: `facilityname@district.com`
- Role: `facility`

### Complete User List

See `FACILITY_USERS.md` for the complete list of all facility users with their credentials.

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:reset        # Reset and seed database
npm run db:push         # Push schema changes
npm run db:studio       # Open Prisma Studio

# Complete System Setup
npm run setup:complete  # Complete field-based system setup
npm run setup:mappings  # Setup facility field mappings
npm run verify:mappings # Verify indicator field mappings

# Seeding (Field-Based)
npm run seed:fields     # Seed fields only
npm run seed:indicators # Seed indicators from fields
npm run seed:complete   # Complete seeding
npm run seed:reset      # Reset + complete seeding

# User Management
npx tsx scripts/create-facility-users.ts  # Create facility users
npx tsx scripts/check-user-roles.ts       # Check user distribution

# Auto-Calculation System
npx tsx scripts/setup-complete-system.ts  # Complete system setup
npx tsx scripts/verify-indicator-mappings.ts # Verify field mappings

# Testing
npm run test            # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Linting
npm run lint            # ESLint
npm run typecheck       # TypeScript check
```

### API Endpoints

- **Field Values**: `/api/facility/field-values`
- **Calculated Indicators**: `/api/facility/indicators`
- **Fields**: `/api/fields`
- **Indicators**: `/api/indicators`
- **Facilities**: `/api/facilities`
- **Performance**: `/api/performance`
- **Dashboard**: `/dashboard`

### Frontend Components

- **IndicatorsPage**: Field-based indicator management
- **Dashboard**: Main dashboard with multiple tabs
- **FacilitySelector**: Filter by facility type
- **PerformanceMetrics**: Show achievement percentages
- **FieldValueForm**: Submit field values
- **IndicatorResults**: View calculated indicators

## 📁 Project Structure

```
plp-portal/
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── seed-fields-complete.ts    # Field seeding
│   ├── seed-indicators-from-fields.ts # Indicator seeding
│   └── migrations/                # Database migrations
├── src/
│   ├── app/                       # Next.js app router
│   │   ├── api/                   # API routes
│   │   │   ├── facility/          # Facility-specific APIs
│   │   │   │   ├── field-values/  # Field submission
│   │   │   │   └── indicators/    # Calculated indicators
│   │   │   └── admin/             # Admin APIs
│   │   ├── admin/                 # Admin pages
│   │   └── dashboard/             # Dashboard pages
│   ├── components/                # React components
│   │   ├── dashboard/             # Dashboard components
│   │   └── ui/                    # UI components
│   └── lib/                       # Utilities
│       ├── calculations/          # Calculation logic
│       │   ├── auto-indicator-calculator.ts # Auto-calculation engine
│       │   ├── field-based-updater.ts # Field value updates
│       │   └── formula-calculator.ts # Formula calculations
│       └── indicators-source/     # Indicator source data
├── scripts/                       # Scripts
│   ├── setup-complete-system.ts   # Complete system setup
│   ├── setup-facility-field-mappings.ts # Facility field mappings
│   ├── verify-indicator-mappings.ts # Verify field mappings
│   ├── create-facility-users.ts   # Create facility users
│   └── check-user-roles.ts        # Check user distribution
├── FIELD_BASED_SYSTEM_GUIDE.md    # Field-based system documentation
├── FACILITY_USERS.md              # Complete user credentials
└── package.json                   # Dependencies and scripts
```

## 🚨 Important Notes

### Migration Best Practices

1. **Always backup** before major schema changes
2. **Test migrations** in development first
3. **Use `db:push`** for development, `migrate deploy` for production
4. **Reset database** with `db:reset` for clean development

### Field-Based Auto-Calculation Guidelines

1. **Fields First**: Always seed fields before indicators
2. **Use `setup:complete`** for complete system setup
3. **Verify Mappings**: Run verification after setup
4. **Test Auto-Calculation**: Submit field values and check indicators
5. **Check field references** after seeding
6. **Verify target fields** are properly linked
7. **Test binary indicators** with special handling

### Development Workflow

1. **Schema Changes**: Edit `prisma/schema.prisma`
2. **Push Changes**: `npm run db:push`
3. **Update Field Seeds**: Modify `prisma/seed-fields-complete.ts`
4. **Update Indicator Seeds**: Modify `prisma/seed-indicators-from-fields.ts`
5. **Update Mappings**: Modify `scripts/setup-facility-field-mappings.ts`
6. **Test**: Run complete setup workflow
7. **Verify**: Check API endpoints and frontend
8. **Test Auto-Calculation**: Submit field values and verify indicators

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection**

   ```bash
   # Check .env configuration
   # Verify PostgreSQL is running
   npm run db:studio  # Test connection
   ```

2. **Schema Sync Issues**

   ```bash
   npm run db:reset   # Complete reset
   # Or
   npm run db:push    # Push changes
   ```

3. **Field Seeding Errors**

   ```bash
   # Check database connection
   # Verify schema is up to date
   npx tsx prisma/seed-fields-complete.ts
   ```

4. **Indicator Seeding Errors**

   ```bash
   # Ensure fields are seeded first
   npx tsx prisma/seed-fields-complete.ts
   npx tsx prisma/seed-indicators-from-fields.ts
   ```

5. **Auto-Calculation Issues**

   ```bash
   # Check field mappings
   npx tsx scripts/verify-indicator-mappings.ts

   # Test field submission
   curl -X POST http://localhost:3000/api/facility/field-values \
     -H "Content-Type: application/json" \
     -d '{"facility_id":"123","report_month":"2024-01","field_values":[{"field_code":"total_footfall","value":150}]}'
   ```

6. **API Issues**

   ```bash
   # Check server logs
   # Verify database state
   curl http://localhost:3000/api/facility/indicators?facility_id=123&report_month=2024-01
   ```

7. **Field Mapping Issues**

   ```bash
   # Verify facility field mappings
   npx tsx scripts/setup-facility-field-mappings.ts

   # Check field assignments
   npx tsx scripts/verify-indicator-mappings.ts
   ```

## 📈 Performance Monitoring

The system includes comprehensive performance tracking:

- **Field-based auto-calculations** for each indicator
- **Dynamic target values** based on facility types
- **Real-time performance metrics** with field references
- **Data quality tracking** and approval workflows
- **Automatic indicator recalculation** when field values change

## 🤝 Contributing

1. Follow the field-first seeding pattern
2. Update `seed-fields-complete.ts` for new fields
3. Update `seed-indicators-from-fields.ts` for new indicators
4. Update `setup-facility-field-mappings.ts` for new mappings
5. Test auto-calculation thoroughly
6. Update documentation for new features
7. Verify field submissions work correctly
8. Test indicator calculations with real data

## 🎯 Benefits of Field-Based Auto-Calculation

### 1. **Simplified Data Entry**

- Facilities only submit raw data (counts, activities)
- No need to understand complex formulas
- Reduced data entry errors

### 2. **Consistent Calculations**

- All indicators calculated using same logic
- No manual calculation errors
- Standardized formulas across facilities

### 3. **Real-time Updates**

- Indicators recalculate automatically
- Immediate feedback on achievement
- Live incentive calculations

### 4. **Flexible Formula System**

- Support for multiple formula types
- Facility-specific targets
- Conditional calculations (NA scenarios)

### 5. **Audit Trail**

- Field values stored separately
- Calculation history maintained
- Clear data lineage

---

**Last Updated**: August 2024  
**Version**: 3.0.0 (Field-Based Auto-Calculation System)  
**Database**: PostgreSQL with Prisma ORM
