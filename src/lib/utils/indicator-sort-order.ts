// Function to sort indicators by source file order across all facility types
export function sortIndicatorsBySourceOrder(indicators: any[]) {
  // Comprehensive mapping based on source files order
  // SC-HWC: 22 indicators, PHC: 21 indicators, UPHC: 9 indicators, U-HWC: 10 indicators, A-HWC: 23 indicators
  const SORT_ORDER_MAP = new Map([
    // 1. Total Footfall (M&F) - All facility types
    ['TF001_SC', 1],     // SC-HWC
    ['TF001_PHC', 1],    // PHC
    ['TF001_UPHC', 1],   // UPHC
    ['TF001_UHWC', 1],   // U-HWC
    ['TF001_AHWC', 1],   // A-HWC
    ['TF001', 1],        // Generic fallback
    
    // 2. Total Wellness sessions - All facility types
    ['WS001', 2],
    
    // 3. Teleconsultation - All facility types
    ['TC001', 3],
    ['TC001_SC', 3],    // SC-HWC specific Teleconsultation
    ['TC001_AHWC', 3],  // A-HWC specific Teleconsultation
    
    // 4. Total ANC footfall - SC-HWC, PHC, A-HWC
    ['AF001_SC', 4],     // SC-HWC
    ['AF001_PHC', 4],    // PHC
    ['AF001_AHWC', 4],   // A-HWC
    ['AF001', 4],        // Generic fallback
    
    // 5. Pregnant women tested for Hb - SC-HWC, PHC, A-HWC
    ['HT001', 5],
    
    // 6. Individuals screened for TB - All facility types
    ['TS001_SC', 6],     // SC-HWC
    ['TS001_PHC', 6],    // PHC
    ['TS001_UPHC', 6],   // UPHC
    ['TS001_UHWC', 6],   // U-HWC
    ['TS001_AHWC', 6],   // A-HWC
    ['TS001', 6],        // Generic fallback
    
    // 7. Household visited for TB contact tracing - All facility types
    ['CT001', 7],
    
    // 8. TB patients visited for Differentiated TB Care - All facility types
    ['DC001', 8],
    
    // 9. RI sessions held - SC-HWC, PHC, A-HWC
    ['RS001', 9],
    
    // 10. RI footfall - SC-HWC, PHC, A-HWC
    ['RF001', 10],
    
    // 11. CBAC filled for the month - SC-HWC, PHC, A-HWC
    ['CB001', 11],
    
    // 12. HTN screened for the month - SC-HWC, PHC, A-HWC
    ['HS001', 12],
    
    // 13. DM screened for the month - SC-HWC, PHC, A-HWC
    ['DS001', 13],
    
    // 14. Oral Ca. Screened for the month - SC-HWC, PHC, A-HWC
    ['OC001', 14],
    
    // 15. Breast & Cervical Ca. screened for the month - SC-HWC, PHC, A-HWC
    ['BC001', 15],
    
    // 16. NCD Diagnosed & Tx completed - PHC, UPHC, A-HWC
    ['ND001', 16],
    
    // 17. Patient satisfaction score - All facility types
    ['PS001', 17],
    
    // 18. Elderly & Palliative patients visited - All facility types
    ['EP001', 18],
    
    // 19. Elderly clinic conducted - All facility types
    ['EC001', 19],
    
    // 20. JAS meeting conducted - All facility types
    ['JM001', 20],
    
    // 21. Issues generated in DVDMS - All facility types
    ['DV001_SC', 21],    // SC-HWC
    ['DV001_PHC', 21],   // PHC
    ['DV001_UPHC', 21],  // UPHC
    ['DV001_UHWC', 21],  // U-HWC
    ['DV001_AHWC', 21],  // A-HWC
    ['DV001', 21],       // Generic fallback
    ['DI001', 21],       // Generic fallback (alternative code)
    
    // 22. Prakriti Parikshan conducted - A-HWC specific
    ['PP001', 22],
    
    // 23. Elderly Support Group formed - SC-HWC, A-HWC
    ['ES001', 23],
    
    // 24. Elderly Support Group activity - SC-HWC, A-HWC
    ['EA001', 24],
  ]);

  return indicators.sort((a, b) => {
    const orderA = SORT_ORDER_MAP.get(a.indicator_code || a.code) || 999
    const orderB = SORT_ORDER_MAP.get(b.indicator_code || b.code) || 999
    
    if (orderA !== orderB) {
      return orderA - orderB
    }
    
    // If same order or both unmapped, sort alphabetically by code
    return (a.indicator_code || a.code).localeCompare(b.indicator_code || b.code)
  })
}

// Function to get indicator number based on source file order
export function getIndicatorNumber(indicator: any): number {
  const SORT_ORDER_MAP = new Map([
    // 1. Total Footfall (M&F) - All facility types
    ['TF001_SC', 1],     // SC-HWC
    ['TF001_PHC', 1],    // PHC
    ['TF001_UPHC', 1],   // UPHC
    ['TF001_UHWC', 1],   // U-HWC
    ['TF001_AHWC', 1],   // A-HWC
    ['TF001', 1],        // Generic fallback
    
    // 2. Total Wellness sessions - All facility types
    ['WS001', 2],
    
    // 3. Teleconsultation - All facility types
    ['TC001', 3],
    ['TC001_SC', 3],    // SC-HWC specific Teleconsultation
    ['TC001_AHWC', 3],  // A-HWC specific Teleconsultation
    
    // 4. Total ANC footfall - SC-HWC, PHC, A-HWC
    ['AF001_SC', 4],     // SC-HWC
    ['AF001_PHC', 4],    // PHC
    ['AF001_AHWC', 4],   // A-HWC
    ['AF001', 4],        // Generic fallback
    
    // 5. Pregnant women tested for Hb - SC-HWC, PHC, A-HWC
    ['HT001', 5],
    
    // 6. Individuals screened for TB - All facility types
    ['TS001_SC', 6],     // SC-HWC
    ['TS001_PHC', 6],    // PHC
    ['TS001_UPHC', 6],   // UPHC
    ['TS001_UHWC', 6],   // U-HWC
    ['TS001_AHWC', 6],   // A-HWC
    ['TS001', 6],        // Generic fallback
    
    // 7. Household visited for TB contact tracing - All facility types
    ['CT001', 7],
    
    // 8. TB patients visited for Differentiated TB Care - All facility types
    ['DC001', 8],
    
    // 9. RI sessions held - SC-HWC, PHC, A-HWC
    ['RS001', 9],
    
    // 10. RI footfall - SC-HWC, PHC, A-HWC
    ['RF001', 10],
    
    // 11. CBAC filled for the month - SC-HWC, PHC, A-HWC
    ['CB001', 11],
    
    // 12. HTN screened for the month - SC-HWC, PHC, A-HWC
    ['HS001', 12],
    
    // 13. DM screened for the month - SC-HWC, PHC, A-HWC
    ['DS001', 13],
    
    // 14. Oral Ca. Screened for the month - SC-HWC, PHC, A-HWC
    ['OC001', 14],
    
    // 15. Breast & Cervical Ca. screened for the month - SC-HWC, PHC, A-HWC
    ['BC001', 15],
    
    // 16. NCD Diagnosed & Tx completed - PHC, UPHC, A-HWC
    ['ND001', 16],
    
    // 17. Patient satisfaction score - All facility types
    ['PS001', 17],
    
    // 18. Elderly & Palliative patients visited - All facility types
    ['EP001', 18],
    
    // 19. Elderly clinic conducted - All facility types
    ['EC001', 19],
    
    // 20. JAS meeting conducted - All facility types
    ['JM001', 20],
    
    // 21. Issues generated in DVDMS - All facility types
    ['DV001_SC', 21],    // SC-HWC
    ['DV001_PHC', 21],   // PHC
    ['DV001_UPHC', 21],  // UPHC
    ['DV001_UHWC', 21],  // U-HWC
    ['DV001_AHWC', 21],  // A-HWC
    ['DV001', 21],       // Generic fallback
    ['DI001', 21],       // Generic fallback (alternative code)
    
    // 22. Prakriti Parikshan conducted - A-HWC specific
    ['PP001', 22],
    
    // 23. Elderly Support Group formed - SC-HWC, A-HWC
    ['ES001', 23],
    
    // 24. Elderly Support Group activity - SC-HWC, A-HWC
    ['EA001', 24],
  ]);

  return SORT_ORDER_MAP.get(indicator.indicator_code || indicator.code) || 999;
}
