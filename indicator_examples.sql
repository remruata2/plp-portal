-- Example SQL for populating the enhanced indicator schema
-- Based on the indicators from newindicators.md

-- 1. CONSTANT type indicators (e.g., "10 sessions/month")
INSERT INTO formula_component (name, description, component_type, value_type, constant_value) VALUES
('Wellness Sessions Target', '10 sessions per month', 'CONSTANT', 'number', 10.00),
('Teleconsultation Target SC', '25 calls per month for SC', 'CONSTANT', 'number', 25.00),
('Teleconsultation Target PHC', '50 calls per month for PHC', 'CONSTANT', 'number', 50.00);

-- 2. POPULATION_BASED type indicators
INSERT INTO formula_component (name, description, component_type, value_type, population_formula) VALUES
('Total Population', 'Total population of catchment area', 'POPULATION_BASED', 'number', 'total_population'),
('Population 30+ Monthly', 'Total 30+ population divided by 12', 'POPULATION_BASED', 'number', 'population_30_plus / 12'),
('Female Population 30+ Monthly', 'Total female 30+ population divided by 60', 'POPULATION_BASED', 'number', 'female_population_30_plus / 60');

-- 3. FACILITY_SPECIFIC type indicators
INSERT INTO formula_component (name, description, component_type, value_type, facility_specific_values) VALUES
('DVDMS Issues Target', 'Different targets per facility type', 'FACILITY_SPECIFIC', 'number', 
 '{"SC": 20, "PHC": 50, "UPHC": 100, "U_HWC": 50, "SC_HWC": 20, "A_HWC": 50}');

-- 4. INDICATOR_REFERENCE type indicators
INSERT INTO formula_component (name, description, component_type, value_type, referenced_indicator_id) VALUES
('Total Footfall Reference', 'References total footfall indicator', 'INDICATOR_REFERENCE', 'number', 1),
('ANC Footfall Reference', 'References ANC footfall indicator', 'INDICATOR_REFERENCE', 'number', 5);

-- 5. DYNAMIC_MONTHLY type indicators
INSERT INTO formula_component (name, description, component_type, value_type, data_source, aggregation_method) VALUES
('ANC Due List', 'Total ANC due list for the month', 'DYNAMIC_MONTHLY', 'number', 'ANC_DUE_LIST', 'count'),
('TB Patients', 'Total TB patients under treatment', 'DYNAMIC_MONTHLY', 'number', 'TB_PATIENTS', 'count'),
('Bed Ridden Patients', 'Total bed-ridden patients identified', 'DYNAMIC_MONTHLY', 'number', 'BED_RIDDEN_PATIENTS', 'count');

-- Now create the indicators with their numerator and denominator configurations
INSERT INTO indicator (code, name, description, source_of_verification, target_description, formula_type) VALUES
-- 1. Total Footfall (5% of Total Population)
('TF001', 'Total Footfall (M&F)', 'Total footfall for SC, PHC+colocated SC for PHC', 'AAM Portal', '5% of Total Population', 'PERCENTAGE_BASED'),

-- 2. Wellness Sessions (10 sessions/month)
('WS001', 'Total Wellness sessions', 'Total Wellness session conducted during the month', 'AAM Portal', '10 sessions/month', 'RANGE_BASED'),

-- 3. Prakriti Parikshan (80% of PP conducted/(total indiv 18ys above/12))
('PP001', 'No of Prakriti Parikshan conducted', 'No of Prakriti Parikshan conducted', 'State report', '80% of PP conducted/(total indiv 18ys above/12)', 'PERCENTAGE_BASED'),

-- 4. Teleconsultation (25 calls/month for SC, 50 for others)
('TC001', 'Teleconsultation', 'Total Teleconsultation conducted', 'e-Sanjeevani', '25 calls/month for SC, 50 for others', 'RANGE_BASED'),

-- 5. ANC Footfall (100% of ANC due list)
('AF001', 'Total ANC footfall', 'Total ANC beneficiary irrespective of gestation', 'HMIS', '100% of ANC due list', 'PERCENTAGE_BASED'),

-- 6. Hb Testing (100% of denominator)
('HT001', 'Pregnant women tested for Hb', 'Total ANC tested for Hb', 'HMIS', '100% of denominator', 'PERCENTAGE_BASED'),

-- 7. TB Screening (100% of total footfall/month)
('TS001', 'Individuals screened for TB', 'Individuals screened for TB', 'TB Cough App', '100% of total footfall/month', 'PERCENTAGE_BASED'),

-- 8. TB Contact Tracing (100% of household with newly notified Pulm. TB)
('CT001', 'Household visited for TB contact tracing', 'Total Number of Household visited for Pulmonary TB contact tracing', 'Nikshay', '100% of household with newly notified Pulm. TB', 'PERCENTAGE_BASED'),

-- 9. Differentiated TB Care (100% of indiv. newly notified for TB)
('DC001', 'No. of TB patients visited for Differentiated TB Care', 'No. of TB patients visited for Differentiated TB Care', 'Nikshay', '100% of indiv. newly notified for TB', 'PERCENTAGE_BASED'),

-- 10. RI Sessions (100% of session planned/month)
('RS001', 'RI sessions held', 'RI sessions held', 'U-Win', '100% of session planned/month', 'PERCENTAGE_BASED'),

-- 11. RI Footfall (100% of due list)
('RF001', 'RI footfall', 'Total RI footfall (u-Win)', 'U-Win', '100% of due list', 'PERCENTAGE_BASED'),

-- 12. CBAC (100% of 30+ population/12/month)
('CB001', 'CBAC filled for the month', 'CBAC filled for the month (including rescreened)', 'NCD Portal', '100% of 30+ population/12/month', 'PERCENTAGE_BASED'),

-- 13. HTN Screening (100% of 30+ population/12/month)
('HS001', 'HTN screened for the month', 'HTN screened (including rescreened) for the month', 'NCD Portal', '100% of 30+ population/12/month', 'PERCENTAGE_BASED'),

-- 14. DM Screening (100% of 30+ population/12/month)
('DS001', 'DM screened for the month', 'DM screened (including rescreened) for the month', 'NCD Portal', '100% of 30+ population/12/month', 'PERCENTAGE_BASED'),

-- 15. Oral Cancer Screening (100% of 30+ population/60/month)
('OC001', 'Oral Ca. Screened for the month', 'Oral Ca. Screened for the month', 'NCD Portal', '100% of 30+ population/60/month', 'PERCENTAGE_BASED'),

-- 16. Breast & Cervical Cancer (100% of 30+ population(female) /60/month)
('BC001', 'Breast & Cervical Ca. screened for the month', 'Breast & Cervical Ca. screened for the month', 'NCD Portal', '100% of 30+ population(female) /60/month', 'PERCENTAGE_BASED'),

-- 17. NCD Diagnosed & Tx completed (100% of denominator)
('ND001', 'NCD Diagnosed & Tx completed', 'NCD Diagnosed & Tx completed', 'NCD Portal', '100% of denominator', 'PERCENTAGE_BASED'),

-- 18. Patient satisfaction score (3.5 out of 5)
('PS001', 'Patient satisfaction score for the month', 'Patient satisfaction score for the month', 'QA Mizoram KPI dashboard', '3.5 (70%) out of 5', 'THRESHOLD_BASED'),

-- 19. Elderly & Palliative patients (80% of targeted/month)
('EP001', 'No of Elderly & Palliative patients visited', 'No of Elderly & Palliative patients visited', 'HMIS', '80% of targeted/month', 'PERCENTAGE_BASED'),

-- 20. Elderly clinic (1/month for SHC, 4/month for PHC)
('EC001', 'No of Elderly clinic conducted', 'No of Elderly clinic conducted', 'HMIS', '1/month for SHC, 4/month for PHC', 'RANGE_BASED'),

-- 21. Elderly Support Group (Yes/No)
('ES001', 'Whether Elderly Support Group (Sanjivini) is formed', 'Whether Elderly Support Group (Sanjivini) is formed', '', 'Yes', 'THRESHOLD_BASED'),

-- 22. Elderly Support Group Activity (Yes/No)
('EA001', 'If Yes, any activity conducted during the month and recorded in register', 'If Yes, any activity conducted during the month and recorded in register', '', 'Yes', 'THRESHOLD_BASED'),

-- 23. JAS meeting (>= 1)
('JM001', 'No of JAS meeting conducted', 'No of JAS meeting conducted', 'AAM portal', '>= 1', 'RANGE_BASED'),

-- 24. DVDMS issues (Different targets per facility)
('DI001', 'No. of issues generated in DVDMS', 'No. of issues generated in DVDMS', 'DVDMS portal', '20 issues/month for SC, 50 issues/month for PHC, 100 issues/month for UPHC', 'RANGE_BASED');

-- Now link indicators to their formula components
-- Example for Wellness Sessions (numerator = actual sessions, denominator = constant 10)
UPDATE indicator SET 
  numerator_config_id = (SELECT id FROM formula_component WHERE name = 'Wellness Sessions Target'),
  denominator_config_id = (SELECT id FROM formula_component WHERE name = 'Wellness Sessions Target')
WHERE code = 'WS001';

-- Example for ANC Footfall (numerator = actual ANC, denominator = ANC due list)
UPDATE indicator SET 
  numerator_config_id = (SELECT id FROM formula_component WHERE name = 'ANC Due List'),
  denominator_config_id = (SELECT id FROM formula_component WHERE name = 'ANC Due List')
WHERE code = 'AF001';

-- Example for TB Screening (numerator = screened, denominator = total footfall)
UPDATE indicator SET 
  numerator_config_id = (SELECT id FROM formula_component WHERE name = 'Total Footfall Reference'),
  denominator_config_id = (SELECT id FROM formula_component WHERE name = 'Total Footfall Reference')
WHERE code = 'TS001';

-- Example for DVDMS issues (facility-specific targets)
UPDATE indicator SET 
  numerator_config_id = (SELECT id FROM formula_component WHERE name = 'DVDMS Issues Target'),
  denominator_config_id = (SELECT id FROM formula_component WHERE name = 'DVDMS Issues Target')
WHERE code = 'DI001';

-- Create facility targets for different facility types
INSERT INTO facility_target (facility_id, indicator_id, facility_type, report_month, target_value, target_percentage, min_achievement, max_achievement, na_condition) VALUES
-- Example: Wellness sessions target for PHC
(1, 2, 'PHC', '2024-01', 10.00, NULL, 5.00, 10.00, NULL),

-- Example: ANC footfall target for SC
(2, 5, 'SC_HWC', '2024-01', NULL, 100.00, 50.00, 100.00, 'If ANC due is 0 then NA'),

-- Example: TB screening target for UPHC
(3, 7, 'UPHC', '2024-01', NULL, 100.00, 50.00, 100.00, NULL);

-- Insert population data for calculations
INSERT INTO population_data (facility_id, district_id, report_month, total_population, population_18_plus, population_30_plus, female_population_30_plus, anc_due_list, tb_patients, bed_ridden_patients) VALUES
(1, 1, '2024-01', 5000, 3500, 2500, 1200, 45, 12, 8),
(2, 1, '2024-01', 3000, 2100, 1500, 750, 28, 8, 5),
(3, 1, '2024-01', 8000, 5600, 4000, 2000, 75, 20, 15);

-- Insert monthly health data
INSERT INTO monthly_health_data (facility_id, district_id, indicator_id, report_month, numerator_value, denominator_value, calculated_value, target_value, achievement_percentage, uploaded_by) VALUES
-- Wellness sessions example
(1, 1, 2, '2024-01', 8.00, 10.00, 80.00, 10.00, 80.00, 1),

-- ANC footfall example
(2, 1, 5, '2024-01', 40.00, 45.00, 88.89, 100.00, 88.89, 1),

-- TB screening example
(3, 1, 7, '2024-01', 150.00, 200.00, 75.00, 100.00, 75.00, 1);

-- Calculate performance and remuneration
INSERT INTO performance_calculation (facility_id, indicator_id, report_month, numerator, denominator, achievement, target_value, remuneration_amount, calculation_formula) VALUES
(1, 2, '2024-01', 8.00, 10.00, 80.00, 10.00, 800.00, 'achievement * base_amount'),
(2, 5, '2024-01', 40.00, 45.00, 88.89, 100.00, 889.00, 'achievement * base_amount'),
(3, 7, '2024-01', 150.00, 200.00, 75.00, 100.00, 750.00, 'achievement * base_amount'); 