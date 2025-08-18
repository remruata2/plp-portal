export interface FieldMapping {
  formFieldName: string;
  databaseFieldId: number;
  fieldType: string;
  description: string;
}

export interface IndicatorGroup {
  indicatorCode: string;
  indicatorName: string;
  fields: FieldMapping[];
  conditions?: string;
  source_of_verification?: string;
  target_formula?: string;
  target_value?: string;
}

/**
 * Groups fields by indicators using the same logic as the DynamicHealthDataForm
 * This ensures consistent organization and sorting across the application
 */
export function groupFieldsByIndicators(mappings: FieldMapping[]): IndicatorGroup[] {
  // Define indicator mapping based on field codes - updated to match source files exactly
  const indicatorMapping: Record<string, { code: string; name: string }> = {
    // Population data (foundational demographic information)
    'total_population': { code: 'POP001', name: 'Population Data' },
    'population_30_plus': { code: 'POP001', name: 'Population Data' },
    'population_30_plus_female': { code: 'POP001', name: 'Population Data' },
    'population_18_plus': { code: 'POP001', name: 'Population Data' },
    
    // ANC indicators - facility-specific mappings
    'anc_due_list': { code: 'AF001_PHC', name: 'Total ANC footfall - PHC' }, // Will be mapped based on facility type
    'anc_footfall': { code: 'AF001_PHC', name: 'Total ANC footfall - PHC' }, // Will be mapped based on facility type
    'anc_footfall_phc': { code: 'AF001_PHC', name: 'Total ANC footfall - PHC' },
    'anc_footfall_sc': { code: 'AF001_SC', name: 'Total ANC footfall - SC-HWC' },
    'anc_footfall_ahwc': { code: 'AF001_AHWC', name: 'Total ANC footfall - A-HWC' },
    'anc_tested_hb': { code: 'HT001', name: 'Pregnant women tested for Hb' },
    
    // RI indicators
    'ri_sessions_planned': { code: 'RS001', name: 'RI sessions held' },
    'ri_sessions_held': { code: 'RS001', name: 'RI sessions held' },
    'ri_beneficiaries_due': { code: 'RF001', name: 'RI footfall' },
    'ri_footfall': { code: 'RF001', name: 'RI footfall' },
    
    // TB indicators - facility-specific mappings
    'pulmonary_tb_patients': { code: 'CT001', name: 'Household visited for TB contact tracing' },
    'total_tb_patients': { code: 'DC001', name: 'No. of TB patients visited for Differentiated TB Care' },
    'tb_screenings': { code: 'TS001_PHC', name: 'Individuals screened for TB - PHC' }, // Will be mapped based on facility type
    'tb_screenings_phc': { code: 'TS001_PHC', name: 'Individuals screened for TB - PHC' },
    'tb_screenings_sc': { code: 'TS001_SC', name: 'Individuals screened for TB - SC-HWC' },
    'tb_screenings_uhwc': { code: 'TS001_UHWC', name: 'Individuals screened for TB - U-HWC' },
    'tb_screenings_ahwc': { code: 'TS001_AHWC', name: 'Individuals screened for TB - A-HWC' },
    'tb_screenings_uphc': { code: 'TS001_UPHC', name: 'Individuals screened for TB - UPHC' },
    'tb_contact_tracing_households': { code: 'CT001', name: 'Household visited for TB contact tracing' },
    'tb_differentiated_care_visits': { code: 'DC001', name: 'No. of TB patients visited for Differentiated TB Care' },
    
    // NCD indicators
    'cbac_forms_filled': { code: 'CB001', name: 'CBAC filled for the month (including rescreened)' },
    'htn_screened': { code: 'HS001', name: 'HTN screened (including rescreened) for the month' },
    'dm_screened': { code: 'DS001', name: 'DM screened (including rescreened) for the month' },
    'oral_cancer_screened': { code: 'OC001', name: 'Oral Ca. Screened for the month' },
    'breast_cervical_cancer_screened': { code: 'BC001', name: 'Breast & Cervical Ca. screened for the month' },
    'ncd_diagnosed_tx_completed': { code: 'ND001', name: 'NCD Diagnosed & Tx completed' },
    'ncd_referred_from_sc': { code: 'ND001', name: 'NCD Diagnosed & Tx completed' },
    
    // Service indicators
    'total_footfall': { code: 'TF001_PHC', name: 'Total Footfall (M&F) - PHC' }, // Will be mapped based on facility type
    'total_footfall_phc_colocated_sc': { code: 'TF001_PHC', name: 'Total Footfall (M&F) - PHC' },
    'total_footfall_sc_clinic': { code: 'TF001_SC', name: 'Total Footfall (M&F) - SC-HWC' },
    'total_footfall_uhwc': { code: 'TF001_UHWC', name: 'Total Footfall (M&F) - U-HWC' },
    'total_footfall_ahwc': { code: 'TF001_AHWC', name: 'Total Footfall (M&F) - A-HWC' },
    'total_footfall_uphc': { code: 'TF001_UPHC', name: 'Total Footfall (M&F) - UPHC' },
    'wellness_sessions_conducted': { code: 'WS001', name: 'Total Wellness sessions' },
    'teleconsultation_conducted': { code: 'TC001', name: 'Teleconsultation' },
    'prakriti_parikshan_conducted': { code: 'PP001', name: 'Prakriti Parikshan conducted' },
    'patient_satisfaction_score': { code: 'PS001', name: 'Patient satisfaction score for the month' },
    
    // Elderly care indicators
    'bedridden_patients': { code: 'EP001', name: 'No of Elderly & Palliative patients visited' },
    'elderly_palliative_visits': { code: 'EP001', name: 'No of Elderly & Palliative patients visited' },
    'elderly_clinic_conducted': { code: 'EC001', name: 'No of Elderly clinic conducted' },
    'elderly_support_group_formed': { code: 'ES001', name: 'Whether Elderly Support Group (Sanjivini) is formed' },
    'elderly_support_group_activity': { code: 'EA001', name: 'If Yes, any activity conducted during the month' },
    
    // Administrative indicators
    'jas_meetings_conducted': { code: 'JM001', name: 'No of JAS meeting conducted' },
    'dvdms_issues_generated': { code: 'DV001_PHC', name: 'No. of issues generated in DVDMS - PHC' }, // Will be mapped based on facility type
    'dvdms_issues_generated_phc': { code: 'DV001_PHC', name: 'No. of issues generated in DVDMS - PHC' },
    'dvdms_issues_generated_sc': { code: 'DV001_SC', name: 'No. of issues generated in DVDMS - SC-HWC' },
    'dvdms_issues_generated_uhwc': { code: 'DV001_UHWC', name: 'No. of issues generated in DVDMS - U-HWC' },
    'dvdms_issues_generated_ahwc': { code: 'DV001_AHWC', name: 'No. of issues generated in DVDMS - A-HWC' },
  };

  // Group fields by indicator
  const groups: Record<string, IndicatorGroup> = {};
  
  mappings.forEach((mapping) => {
    const indicator = indicatorMapping[mapping.formFieldName] || {
      code: 'OTHER',
      name: 'Other Fields'
    };
    
    if (!groups[indicator.code]) {
      groups[indicator.code] = {
        indicatorCode: indicator.code,
        indicatorName: indicator.name,
        fields: []
      };
    }
    
    groups[indicator.code].fields.push(mapping);
  });
  
  // Convert to array and sort by proper indicator order (as per source files)
  const indicatorOrder = [
    'POP001', // Population Data (foundational)
    // Total Footfall - facility-specific
    'TF001_PHC',  // 1. Total Footfall (M&F) - PHC
    'TF001_SC',  // 1. Total Footfall (M&F) - SC-HWC
    'TF001_UHWC',  // 1. Total Footfall (M&F) - U-HWC
    'TF001_AHWC',  // 1. Total Footfall (M&F) - A-HWC
    'TF001_UPHC',  // 1. Total Footfall (M&F) - UPHC
    'WS001',  // 2. Total Wellness sessions
    'TC001',  // 3. Teleconsultation
    'TC001_SC',  // 3a. Teleconsultation - SC-HWC
    'TC001_AHWC',  // 3b. Teleconsultation - A-HWC
    // ANC Footfall - facility-specific
    'AF001_PHC',  // 4. Total ANC footfall - PHC
    'AF001_SC',  // 4. Total ANC footfall - SC-HWC
    'AF001_AHWC',  // 4. Total ANC footfall - A-HWC
    'HT001',  // 5. Pregnant women tested for Hb
    // TB Screenings - facility-specific
    'TS001_PHC',  // 6. Individuals screened for TB - PHC
    'TS001_SC',  // 6. Individuals screened for TB - SC-HWC
    'TS001_UHWC',  // 6. Individuals screened for TB - U-HWC
    'TS001_AHWC',  // 6. Individuals screened for TB - A-HWC
    'TS001_UPHC',  // 6. Individuals screened for TB - UPHC
    'CT001',  // 7. Household visited for TB contact tracing
    'DC001',  // 8. TB patients visited for Differentiated TB Care
    'RS001',  // 9. RI sessions held
    'RF001',  // 10. RI footfall
    'CB001',  // 11. CBAC filled for the month
    'HS001',  // 12. HTN screened for the month
    'DS001',  // 13. DM screened for the month
    'OC001',  // 14. Oral Ca. Screened for the month
    'BC001',  // 15. Breast & Cervical Ca. Screened for the month
    'ND001',  // 16. NCD Diagnosed & Tx completed
    'PS001',  // 17. Patient satisfaction score
    'EP001',  // 18. Elderly & Palliative patients visited
    'EC001',  // 19. Elderly clinic conducted
    'JM001',  // 20. JAS meeting conducted
    // DVDMS Issues - facility-specific
    'DV001_PHC',  // 21. Issues generated in DVDMS - PHC
    'DV001_SC',  // 21. Issues generated in DVDMS - SC-HWC
    'DV001_UHWC',  // 21. Issues generated in DVDMS - U-HWC
    'DV001_AHWC',  // 21. Issues generated in DVDMS - A-HWC
    // AYUSH-specific indicators
    'PP001',  // 22. Prakriti Parikshan conducted
    'ES001',  // 23. Elderly Support Group formed
    'EA001',  // 24. Elderly Support Group activity
    'OTHER'   // Other fields (at the end)
  ];
  
  return Object.values(groups).sort((a, b) => {
    const indexA = indicatorOrder.indexOf(a.indicatorCode);
    const indexB = indicatorOrder.indexOf(b.indicatorCode);
    
    // If both indicators are in the order list, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // If only one is in the order list, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    // If neither is in the order list, sort alphabetically
    return a.indicatorCode.localeCompare(b.indicatorCode);
  });
}
