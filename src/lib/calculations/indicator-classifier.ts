export enum DataSourceType {
  FACILITY_SUBMITTED = "FACILITY_SUBMITTED", // Data submitted by facilities
  ADMIN_PREFILLED = "ADMIN_PREFILLED", // Data pre-filled by admin
  CALCULATED = "CALCULATED", // Calculated from other data
  POPULATION_BASED = "POPULATION_BASED", // Based on population data
  INDICATOR_REFERENCE = "INDICATOR_REFERENCE", // References other indicators
}

export interface IndicatorClassification {
  id: number;
  name: string;
  numeratorSource: DataSourceType;
  denominatorSource: DataSourceType;
  requiresFacilityData: boolean;
  requiresAdminPrefill: boolean;
  calculationNotes: string;
  exampleValues: {
    numerator: string;
    denominator: string;
    expectedResult: string;
  };
}

// Comprehensive indicator classification
export const INDICATOR_CLASSIFICATIONS: IndicatorClassification[] = [
  {
    id: 1,
    name: "Wellness Sessions",
    numeratorSource: DataSourceType.FACILITY_SUBMITTED,
    denominatorSource: DataSourceType.ADMIN_PREFILLED,
    requiresFacilityData: true,
    requiresAdminPrefill: true,
    calculationNotes:
      "Facility submits actual sessions conducted, admin sets target",
    exampleValues: {
      numerator: "8 sessions (facility data)",
      denominator: "10 sessions (admin target)",
      expectedResult: "80%",
    },
  },
  {
    id: 2,
    name: "CBAC Screening",
    numeratorSource: DataSourceType.FACILITY_SUBMITTED,
    denominatorSource: DataSourceType.POPULATION_BASED,
    requiresFacilityData: true,
    requiresAdminPrefill: true,
    calculationNotes:
      "Facility submits forms filled, denominator calculated from population",
    exampleValues: {
      numerator: "45 forms (facility data)",
      denominator: "208 (2500/12 population-based)",
      expectedResult: "21.6%",
    },
  },
  {
    id: 3,
    name: "TB Screening",
    numeratorSource: DataSourceType.FACILITY_SUBMITTED,
    denominatorSource: DataSourceType.INDICATOR_REFERENCE,
    requiresFacilityData: true,
    requiresAdminPrefill: false,
    calculationNotes:
      "Facility submits screenings, denominator from Total Footfall indicator",
    exampleValues: {
      numerator: "150 screenings (facility data)",
      denominator: "250 (from Total Footfall indicator)",
      expectedResult: "60%",
    },
  },
  {
    id: 4,
    name: "ANC Footfall",
    numeratorSource: DataSourceType.FACILITY_SUBMITTED,
    denominatorSource: DataSourceType.ADMIN_PREFILLED,
    requiresFacilityData: true,
    requiresAdminPrefill: true,
    calculationNotes:
      "Facility submits ANC visits, admin sets target from due list",
    exampleValues: {
      numerator: "40 visits (facility data)",
      denominator: "45 (admin target from due list)",
      expectedResult: "88.9%",
    },
  },
  {
    id: 5,
    name: "Total Population",
    numeratorSource: DataSourceType.ADMIN_PREFILLED,
    denominatorSource: DataSourceType.ADMIN_PREFILLED,
    requiresFacilityData: false,
    requiresAdminPrefill: true,
    calculationNotes:
      "Admin sets population data, used as denominator for other calculations",
    exampleValues: {
      numerator: "2500 (admin set)",
      denominator: "2500 (admin set)",
      expectedResult: "100%",
    },
  },
  {
    id: 6,
    name: "Total Footfall",
    numeratorSource: DataSourceType.FACILITY_SUBMITTED,
    denominatorSource: DataSourceType.ADMIN_PREFILLED,
    requiresFacilityData: true,
    requiresAdminPrefill: true,
    calculationNotes: "Facility submits OPD visits, admin may set target",
    exampleValues: {
      numerator: "250 visits (facility data)",
      denominator: "300 (admin target)",
      expectedResult: "83.3%",
    },
  },
  {
    id: 7,
    name: "Population Coverage",
    numeratorSource: DataSourceType.CALCULATED,
    denominatorSource: DataSourceType.ADMIN_PREFILLED,
    requiresFacilityData: false,
    requiresAdminPrefill: true,
    calculationNotes:
      "Calculated from various service indicators against population",
    exampleValues: {
      numerator: "Calculated from services",
      denominator: "2500 (population)",
      expectedResult: "Varies",
    },
  },
];

export class IndicatorClassifier {
  static getClassification(
    indicatorId: number
  ): IndicatorClassification | null {
    return INDICATOR_CLASSIFICATIONS.find((c) => c.id === indicatorId) || null;
  }

  static getClassificationsByType(
    sourceType: DataSourceType
  ): IndicatorClassification[] {
    return INDICATOR_CLASSIFICATIONS.filter(
      (c) =>
        c.numeratorSource === sourceType || c.denominatorSource === sourceType
    );
  }

  static getFacilityDataIndicators(): IndicatorClassification[] {
    return INDICATOR_CLASSIFICATIONS.filter((c) => c.requiresFacilityData);
  }

  static getAdminPrefillIndicators(): IndicatorClassification[] {
    return INDICATOR_CLASSIFICATIONS.filter((c) => c.requiresAdminPrefill);
  }

  static getCalculationRequirements(indicatorId: number): {
    needsFacilityData: boolean;
    needsAdminPrefill: boolean;
    numeratorSource: DataSourceType;
    denominatorSource: DataSourceType;
  } {
    const classification = this.getClassification(indicatorId);
    if (!classification) {
      return {
        needsFacilityData: false,
        needsAdminPrefill: false,
        numeratorSource: DataSourceType.ADMIN_PREFILLED,
        denominatorSource: DataSourceType.ADMIN_PREFILLED,
      };
    }

    return {
      needsFacilityData: classification.requiresFacilityData,
      needsAdminPrefill: classification.requiresAdminPrefill,
      numeratorSource: classification.numeratorSource,
      denominatorSource: classification.denominatorSource,
    };
  }
}
