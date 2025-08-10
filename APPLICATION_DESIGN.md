# PLP Dashboard - Application Design

## **Overview**

The PLP Dashboard is a performance-based remuneration system for health facilities in Mizoram. It enables facilities to submit monthly performance data through dynamic forms and calculates remuneration based on achievement against targets.

## **Core Features**

### **1. Dynamic Form Generation**

- **Facility-Specific Forms**: Each facility type (PHC, CHC, SDH, etc.) gets a customized form
- **Indicator-Based Fields**: Forms include only relevant indicators for that facility type
- **Conditional Logic**: Different remuneration amounts based on conditions (e.g., TB patients present)
- **Data Validation**: Real-time validation against targets and formulas

### **2. Performance Tracking**

- **Monthly Data Submission**: Facilities submit data monthly
- **Achievement Calculation**: Automatic calculation of achievement percentages
- **Target Monitoring**: Track performance against predefined targets
- **Quality Control**: Data approval workflow with validation

### **3. Remuneration Calculation**

- **Performance-Based**: Remuneration linked to achievement
- **Conditional Logic**: Different amounts based on facility conditions
- **Transparent Calculation**: Clear breakdown of how amounts are calculated
- **Audit Trail**: Complete history of calculations and approvals

## **Database Schema Design**

### **Core Entities**

#### **1. Facility Management**

```sql
- Facility: Health facilities with type, district, codes
- FacilityType: Types (PHC, CHC, SDH, etc.)
- SubCentre: Sub-centres under facilities
- District: Geographic districts
```

#### **2. Performance Indicators**

```sql
- Indicator: Performance metrics with formulas and targets
- MonthlyHealthData: Monthly performance data
- PerformanceCalculation: Calculated achievements and remuneration
```

#### **3. Remuneration System**

```sql
- FacilityTypeRemuneration: Total amounts per facility type
- IndicatorRemuneration: Per-indicator amounts with conditions
```

#### **4. User Management**

```sql
- User: Staff with roles (admin, staff)
- DataUploadSession: Batch upload tracking
```

## **Application Architecture**

### **Frontend Structure**

```
src/
├── app/
│   ├── dashboard/           # Main dashboard
│   ├── facilities/          # Facility management
│   ├── forms/              # Dynamic form generation
│   ├── reports/            # Performance reports
│   ├── remuneration/       # Remuneration calculations
│   └── admin/              # Administrative functions
├── components/
│   ├── forms/              # Form components
│   ├── charts/             # Data visualization
│   ├── tables/             # Data tables
│   └── ui/                 # UI components
└── lib/
    ├── calculations/        # Remuneration calculation logic
    ├── validators/          # Data validation
    └── utils/               # Utility functions
```

### **Key Components**

#### **1. Dynamic Form Generator**

```typescript
interface FormConfig {
  facilityType: string;
  indicators: Indicator[];
  conditions: Condition[];
  validation: ValidationRule[];
}

class DynamicFormGenerator {
  generateForm(config: FormConfig): FormComponent;
  validateData(data: FormData): ValidationResult;
  calculateAchievement(data: FormData): AchievementResult;
}
```

#### **2. Remuneration Calculator**

```typescript
interface RemunerationConfig {
  facilityType: string;
  indicators: IndicatorRemuneration[];
  conditions: Condition[];
}

class RemunerationCalculator {
  calculateRemuneration(
    data: MonthlyData,
    config: RemunerationConfig
  ): RemunerationResult;

  applyConditions(baseAmount: number, conditions: Condition[]): number;
}
```

#### **3. Performance Tracker**

```typescript
class PerformanceTracker {
  calculateAchievement(
    numerator: number,
    denominator: number,
    target: number
  ): AchievementResult;

  validateTargets(data: MonthlyData): ValidationResult;
}
```

## **User Workflows**

### **1. Facility Staff Workflow**

1. **Login** → Access facility-specific dashboard
2. **View Monthly Form** → See indicators relevant to facility type
3. **Enter Data** → Input numerator/denominator values
4. **Submit** → Data goes for approval
5. **View Results** → See calculated achievement and remuneration

### **2. Admin Workflow**

1. **Review Submissions** → Approve/reject monthly data
2. **Generate Reports** → District/state level performance reports
3. **Manage Remuneration** → Update amounts and conditions
4. **System Configuration** → Manage indicators and targets

### **3. District Coordinator Workflow**

1. **Monitor Performance** → Track facility achievements
2. **Approve Data** → Validate and approve submissions
3. **Generate Reports** → District-level performance analysis

## **Technical Implementation**

### **1. Dynamic Form Generation**

```typescript
// Form configuration based on facility type
const formConfig = {
  facilityType: "Primary Health Centre",
  indicators: [
    {
      code: "TOTAL_FOOTFALL",
      name: "Total Footfall (M&F)",
      type: "PERCENTAGE",
      target: "5% of Total Population",
      numerator: "Total Footfall (M&F) PHC + colocated SC",
      denominator: "Total catchment population for PHC",
    },
  ],
  remuneration: {
    baseAmount: 1000,
    conditionalAmount: 1000,
    conditionType: "WITH_TB_PATIENT",
  },
};
```

### **2. Achievement Calculation**

```typescript
const calculateAchievement = (
  numerator: number,
  denominator: number,
  target: number
) => {
  if (denominator === 0) return { achievement: 0, status: "NA" };

  const achievement = (numerator / denominator) * 100;
  const targetAchievement = Math.min(achievement, target);

  return {
    achievement: targetAchievement,
    status: achievement >= target ? "ACHIEVED" : "PARTIAL",
  };
};
```

### **3. Remuneration Calculation**

```typescript
const calculateRemuneration = (
  achievement: number,
  baseAmount: number,
  conditionalAmount: number,
  hasTbPatients: boolean
) => {
  const applicableAmount = hasTbPatients ? conditionalAmount : baseAmount;
  const remuneration = (achievement / 100) * applicableAmount;

  return {
    amount: remuneration,
    achievement: achievement,
    applicableAmount: applicableAmount,
  };
};
```

## **Data Flow**

### **1. Monthly Data Submission**

```
Facility Staff → Enter Data → Validation → Approval → Calculation → Remuneration
```

### **2. Performance Tracking**

```
Raw Data → Achievement Calculation → Target Comparison → Remuneration Calculation → Report Generation
```

### **3. Quality Control**

```
Data Entry → Validation → Approval → Final Calculation → Audit Trail
```

## **Key Features Implementation**

### **1. Conditional Logic**

- **TB Patient Detection**: Automatic detection based on TB screening data
- **Pregnant Women Tracking**: ANC data determines pregnancy-related conditions
- **Dynamic Amounts**: Remuneration varies based on conditions

### **2. Data Validation**

- **Formula Validation**: Ensure data follows calculation formulas
- **Range Validation**: Check values against acceptable ranges
- **Consistency Checks**: Cross-validate related indicators

### **3. Reporting System**

- **Performance Dashboards**: Real-time achievement tracking
- **Remuneration Reports**: Detailed breakdown of calculations
- **Comparative Analysis**: District and state-level comparisons

## **Security & Access Control**

### **1. Role-Based Access**

- **Admin**: Full system access
- **District Coordinator**: District-level management
- **Facility Staff**: Facility-specific data entry

### **2. Data Security**

- **Encrypted Storage**: Sensitive data encryption
- **Audit Logging**: Complete action tracking
- **Backup Systems**: Regular data backups

## **Deployment Strategy**

### **1. Development Phase**

1. **Core System**: Basic form generation and calculation
2. **Pilot Testing**: Test with select facilities
3. **Feedback Integration**: Incorporate user feedback
4. **Full Deployment**: Roll out to all facilities

### **2. Training & Support**

1. **User Training**: Comprehensive training for all user types
2. **Documentation**: Complete user and technical documentation
3. **Support System**: Help desk and troubleshooting guides

## **Success Metrics**

### **1. Performance Indicators**

- **Data Quality**: Percentage of valid submissions
- **Timeliness**: On-time submission rates
- **User Adoption**: Active user engagement

### **2. System Performance**

- **Response Time**: Form loading and calculation speed
- **Uptime**: System availability
- **Data Accuracy**: Calculation accuracy rates

This design provides a comprehensive framework for implementing the PLP Dashboard with dynamic forms, performance tracking, and remuneration calculation based on the sample data provided.
