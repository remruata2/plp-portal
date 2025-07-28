import { Prisma } from "../src/generated/prisma";

export const hmisIndicators: Omit<Prisma.IndicatorCreateInput, 'id'>[] = [
  {
    code: "1.1",
    name: "Total number of NEW Pregnant Women registered for ANC",
    type: 'simple'
  },
  {
    code: "1.1.a",
    name: "Out of total number of NEW Pregnant Women registered with age <15 years",
    type: 'simple'
  },
  {
    code: "1.1.b",
    name: "Out of total number of NEW Pregnant Women registered with age 15-19 years",
    type: 'simple'
  },
  {
    code: "1.1.c",
    name: "Out of total number of NEW Pregnant Women registered with age >19 to 49 years",
    type: 'simple'
  },
  {
    code: "1.1.d",
    name: "Out of total number of NEW Pregnant Women registered with age >49 years",
    type: 'simple'
  },
  {
    code: "1.1.1",
    name: "Out of the total NEW ANC registered, number registered within 1st trimester (within 12 weeks)",
    type: 'simple'
  },
  {
    code: "1.1.2",
    name: "Total ANC footfall/cases (Old cases + New Registration) attended",
    type: 'simple'
  },
  {
    code: "1.2.1",
    name: "Number of PW given Td1 (Tetanus Diptheria dose 1)",
    type: 'simple'
  },
  {
    code: "1.2.2",
    name: "Number of PW given Td2 (Tetanus Diptheria dose 2)",
    type: 'simple'
  },
  {
    code: "1.2.3",
    name: "Number of PW given Td Booster (Tetanus Diptheria dose booster)",
    type: 'simple'
  },
  {
    code: "1.2.4",
    name: "Number of PW provided full course 180 Iron Folic Acid (IFA) tablets",
    type: 'simple'
  },
  {
    code: "1.2.5",
    name: "Number of PW provided full course 360 Calcium tablets",
    type: 'simple'
  },
  {
    code: "1.2.6",
    name: "Number of PW given one Albendazole tablet after 1st trimester",
    type: 'simple'
  },
  {
    code: "1.2.7",
    name: "Number of PW received 4 or more ANC check ups",
    type: 'simple'
  },
  {
    code: "1.2.8",
    name: "Number of PW given ANC Corticosteroids in Pre-Term Labour",
    type: 'simple'
  },
  {
    code: "1.3.1",
    name: "New cases of PW with hypertension detected",
    type: 'simple'
  },
  {
    code: "1.3.1.a",
    name: "Number of PW with hypertension managed at institution",
    type: 'simple'
  },
  {
    code: "1.3.2",
    name: "Number of Eclampsia cases managed during delivery",
    type: 'simple'
  },
  {
    code: "1.4.1",
    name: "Number of PW tested for Haemoglobin (Hb ) 4 or more than 4 times for respective ANCs",
    type: 'simple'
  },
  {
    code: "1.4.2",
    name: "Number of PW having Hb level<11(7.1 to",
    type: 'simple'
  },
  {
    code: "1.4.3",
    name: "Number of PW having Hb level<=7 g/dl (Out of total tested cases)",
    type: 'simple'
  },
  {
    code: "1.4.4",
    name: "Number of PW treated for severe anaemia (Hb<=7g/dl) (Out of total tested cases)",
    type: 'simple'
  },
  {
    code: "1.5.1",
    name: "Number of PW tested for Blood Sugar using OGTT(Oral Glucose Tolerance Test)",
    type: 'simple'
  },
  {
    code: "1.5.2",
    name: "Number of PW tested positive for GDM out of total OGTT(Oral Glucose Tolerance Test) conducted",
    type: 'simple'
  },
  {
    code: "1.5.3",
    name: "Number of PW given Insulin out of total tested positive for GDM",
    type: 'simple'
  },
  {
    code: "1.5.4",
    name: "Number of PW given Metformin out of total tested positive for GDM",
    type: 'simple'
  },
  {
    code: "1.6.1.a",
    name: "Number of pregnant/Direct-In-Labor (DIL) women screened/tested (with VDRL/RPR/TPHA/RDT/PoC) for Syphilis",
    type: 'simple'
  },
  {
    code: "1.6.1.b",
    name: "Number of pregnant/DIL women found Seropositive for Syphilis by VDRL/RPR/TPHA/RDT/PoC test",
    type: 'simple'
  },
  {
    code: "1.6.1.c",
    name: "Number of pregnant/DIL women found Syphilis-Seropositive and given treatment with injection Benzathine Penicillin (IM)",
    type: 'simple'
  },
  {
    code: "1.6.1.d",
    name: "Number of live births among Syphilis Seropositive Pregnant Women",
    type: 'simple'
  },
  {
    code: "1.6.1.e",
    name: "Number of babies born to Syphilis-Seropositive Pregnant Women tested positive/ clinically diagnosed for congenital Syphilis",
    type: 'simple'
  },
  {
    code: "1.6.1.f",
    name: "Out of above, babies with congenital Syphilis received curative treatment",
    type: 'simple'
  },
  {
    code: "1.7.1",
    name: "Number of Pregnant Women tested positive for Thyroid disorder",
    type: 'simple'
  },
  {
    code: "1.7.2",
    name: "Number of Pregnant Women treated for thyroid disorder",
    type: 'simple'
  },
  {
    code: "1.8.1",
    name: "Number of Pregnant Women screened for TB",
    type: 'simple'
  },
  {
    code: "1.8.2",
    name: "Number of Pregnant Women identified  with Presumptive TB symptoms",
    type: 'simple'
  },
  {
    code: "1.8.3",
    name: "Number of Pregnant Women referred out of those identified with Presumptive TB symptoms",
    type: 'simple'
  },
  {
    code: "1.9.1",
    name: "Total High Risk Pregnancy (HRP) Intrapartum including following:",
    type: 'simple'
  },
  {
    code: "1.9.1.a",
    name: "Number of Pregnant Women with Post-Partum Haemorrhage(Immediately after delivery) in the facility.",
    type: 'simple'
  },
  {
    code: "1.9.1.b",
    name: "Number of Pregnant Women with Sepsis in the facility.",
    type: 'simple'
  },
  {
    code: "1.9.1.c",
    name: "Number of Pregnant Women identified with Eclampsia in the facility",
    type: 'simple'
  },
  {
    code: "1.9.1.d",
    name: "Number of Pregnant Women identified with obstructed labour in the facility.",
    type: 'simple'
  },
  {
    code: "1.9.2",
    name: "Total High Risk Pregnancy (HRP) Antepartum (Only New Cases are to be reported)",
    type: 'simple'
  },
  {
    code: "1.9.3",
    name: "Total no. of ANC or PNC cases referred to Higher/ any other  facility",
    type: 'simple'
  },
  {
    code: "1.9.4",
    name: "Total no. of ANC or PNC cases referred in to the facility",
    type: 'simple'
  },
  {
    code: "1.9.5",
    name: "Number of Complicated pregnancies treated with Blood Transfusion",
    type: 'simple'
  },
  {
    code: "2.1.1.a",
    name: "Number of Home Deliveries attended by Skill Birth Attendant(SBA) (Doctor/Nurse/ANM)",
    type: 'simple'
  },
  {
    code: "2.1.1.b",
    name: "Number of Home Deliveries attended by Non SBA (Trained Birth Attendant(TBA) /Relatives/etc.)",
    type: 'simple'
  },
  {
    code: "2.1.2",
    name: "Number of PW given Tablet Misoprostol during home delivery",
    type: 'simple'
  },
  {
    code: "2.1.3",
    name: "Number of newborns received 7 Home Based Newborn Care (HBNC) visits in case of Home delivery",
    type: 'simple'
  },
  {
    code: "2.2",
    name: "Number of Institutional Deliveries conducted (Including C-Sections)",
    type: 'simple'
  },
  {
    code: "2.2.1",
    name: "Out of total institutional  deliveries(excluding C-section), number of women stayed for  48 hours or more after delivery",
    type: 'simple'
  },
  {
    code: "2.2.2",
    name: "Out of total Institutional deliveries, number of Institutional Deliveries (Excluding C-Sections)  conducted at night (8 PM- 8 AM)",
    type: 'simple'
  },
  {
    code: "2.3",
    name: "Age wise total number of delivery (Home +Institutional) reported (2.3.1+2.3.2+2.3.3+2.3.4)",
    type: 'simple'
  },
  {
    code: "2.3.1",
    name: "Out of total number of delivery, PW with age <15 years",
    type: 'simple'
  },
  {
    code: "2.3.2",
    name: "Out of total number of delivery, PW with age 15-19 years",
    type: 'simple'
  },
  {
    code: "2.3.3",
    name: "Out of total number of delivery, PW with age >19-49 years",
    type: 'simple'
  },
  {
    code: "2.3.4",
    name: "Out of total number of delivery, PW with age > 49 years",
    type: 'simple'
  },
  {
    code: "2.4",
    name: "Number of newborns received 6 HBNC visits after Institutional Delivery",
    type: 'simple'
  },
  {
    code: "2.5",
    name: "No. of identified Sick new-borns referred by ASHA to facility under HBNC Programme",
    type: 'simple'
  },
  {
    code: "2.6",
    name: "Total number of Children  received all scheduled 5 Home visits under HBYC",
    type: 'simple'
  },
  {
    code: "3.1",
    name: "Total number of C -Section deliveries performed",
    type: 'simple'
  },
  {
    code: "3.1.1",
    name: "Out of total C-sections, number performed at night (8 PM- 8 AM)",
    type: 'simple'
  },
  {
    code: "3.1.2",
    name: "Out of total C-section, number of women stayed for 72 hours or more after delivery",
    type: 'simple'
  },
  {
    code: "4.1.1.a",
    name: "Live Birth - Male",
    type: 'simple'
  },
  {
    code: "4.1.1.b",
    name: "Live Birth - Female",
    type: 'simple'
  },
  {
    code: "4.1.2",
    name: "Number of Pre-term newborns ( < 37 weeks of pregnancy)",
    type: 'simple'
  },
  {
    code: "4.1.3.a",
    name: "Intrapartum (Fresh) Still Birth",
    type: 'simple'
  },
  {
    code: "4.1.3.b",
    name: "Antepartum (Macerated) Still Birth",
    type: 'simple'
  },
  {
    code: "4.2",
    name: "Abortion (spontaneous)",
    type: 'simple'
  },
  {
    code: "4.3.1.a",
    name: "Surgical MTPs upto 12 weeks of pregnancy",
    type: 'simple'
  },
  {
    code: "4.3.1.b",
    name: "MTP more than 12 weeks of pregnancy",
    type: 'simple'
  },
  {
    code: "4.3.1.c",
    name: "MTPs completed through Medical methods of abortion (MMA)",
    type: 'simple'
  },
  {
    code: "4.3.2.a",
    name: "Total Post-abortion/MTP Complications Identified",
    type: 'simple'
  },
  {
    code: "4.3.2.b",
    name: "Post-abortion/MTP complications identified (where abortions were carried out in facilities other than public and accredited private health facilities)",
    type: 'simple'
  },
  {
    code: "4.3.2.c",
    name: "Post-abortion/MTP Complications treated",
    type: 'simple'
  },
  {
    code: "4.3.3",
    name: "Number of women provided with Post-abortion/ MTP contraception",
    type: 'simple'
  },
  {
    code: "4.4.1",
    name: "Number of Newborns weighed at birth",
    type: 'simple'
  },
  {
    code: "4.4.2",
    name: "Number of Newborns having weight less than 2500 gms",
    type: 'simple'
  },
  {
    code: "4.4.2.a",
    name: "Out of the above, number of Newborns having weight less than 1800 gms",
    type: 'simple'
  },
  {
    code: "4.4.3",
    name: "Number of Newborns breast fed within 1 hour of birth",
    type: 'simple'
  },
  {
    code: "4.4.4",
    name: "No. of Newborns discharged from the facility were exclusively breastfed till discharge",
    type: 'simple'
  },
  {
    code: "4.4.5",
    name: "Number of Newborns received Donor Human Milk (DHM) in the facility",
    type: 'simple'
  },
  {
    code: "4.5.1",
    name: "Number of Newborns screened for defects at birth (as per Comprehensive Newborn Screening, RBSK)",
    type: 'simple'
  },
  {
    code: "4.5.1.a",
    name: "Number of Newborns identified with visible birth defects (including Neural tube defect, Down's Syndrome, Cleft Lip & Palate, Club foot and Developmental dysplasia of the hip)",
    type: 'simple'
  },
  {
    code: "4.5.3",
    name: "Number of SNCU discharged babies screened in DEIC",
    type: 'simple'
  },
  {
    code: "4.5.5",
    name: "Number of children till age 18 years (affected with selected health conditions) managed for 4 Ds (Disease, Deficiency, Developmental Delay & Defect)",
    type: 'simple'
  },
  {
    code: "4.5.6",
    name: "Number of children till age 18 years (affected with selected health conditions) managed by  Intervention - Surgical",
    type: 'simple'
  },
  {
    code: "4.5.7",
    name: "Number of children till age 18 years managed at DEIC (District Early Intervention Centre)",
    type: 'simple'
  },
  {
    code: "5.1.1",
    name: "Number of women of reproductive age (WRA) 20-49 years (non-pregnant, non-lactating), provided 4 Red Iron and folic acid (IFA) tablets in a month",
    type: 'simple'
  },
  {
    code: "5.1.2",
    name: "Number of children (6-59 months old) provided 8-10 doses (1ml) of IFA syrup (Bi weekly)",
    type: 'simple'
  },
  {
    code: "5.1.3.a",
    name: "Number of out of school children (5 -9 years) given 4-5 IFA Pink tablets at Anganwadi Centres",
    type: 'simple'
  },
  {
    code: "5.2.1.c",
    name: "Number of out of school adolescent girls (10-19 years) having anaemia  (Hb",
    type: 'simple'
  },
  {
    code: "5.2.1.e",
    name: "Number of lactating mothers (of 0-6 months old child) having anaemia (Hb",
    type: 'simple'
  },
  {
    code: "5.2.1.f",
    name: "Number of women of reproductive age (non-pregnant, non-lactating) (20-49 years) having anaemia (Hb",
    type: 'simple'
  },
  {
    code: "5.2.2.c",
    name: "Number of out of school adolescent girls (10-19 years) having severe anaemia  (Hb <8 g/dl)",
    type: 'simple'
  },
  {
    code: "5.2.2.e",
    name: "Number of lactating mothers (of 0-6 months old child) having severe anaemia ((Hb <8 g/dl)",
    type: 'simple'
  },
  {
    code: "5.2.2.f",
    name: "Number of women of reproductive age (non-pregnant, non-lactating) (20-49 years) having severe anaemia (Hb <8 g/dl)",
    type: 'simple'
  },
  {
    code: "5.2.3.a",
    name: "Number of anaemic in-school Children (5-9 years) put on treatment",
    type: 'simple'
  },
  {
    code: "5.2.3.b",
    name: "Number of anaemic in-school adolescent girls (10-19 years) put on treatment",
    type: 'simple'
  },
  {
    code: "5.2.3.c",
    name: "Number of anaemic out of school adolescent girls (10-19 years) put on treatment",
    type: 'simple'
  },
  {
    code: "5.2.3.d",
    name: "Number of anaemic in-school adolescent boys (10-19 years) put on treatment",
    type: 'simple'
  },
  {
    code: "5.2.3.e",
    name: "Number of anaemic lactating mothers (of 0-6 months old child) put on treatment",
    type: 'simple'
  },
  {
    code: "5.2.3.f",
    name: "Number of anaemic women of reproductive age (non-pregnant, non-lactating) (20-49 years) put on treatment",
    type: 'simple'
  },
  {
    code: "5.2.4.a",
    name: "Number of lactating mothers (of 0-6 months old child) diagnosed with severe anaemia and put on treatment",
    type: 'simple'
  },
  {
    code: "6.1",
    name: "In case of home delivery, number of women receiving 1st Postpartum checkups within 48 hours",
    type: 'simple'
  },
  {
    code: "6.2",
    name: "Number of women receiving Postpartum checkup between 48 hours and 14 days after Institutional delivery",
    type: 'simple'
  },
  {
    code: "6.3",
    name: "Number of mothers provided full course of 180 IFA tablets after delivery",
    type: 'simple'
  },
  {
    code: "6.4",
    name: "Number of mothers provided full course 360 Calcium tablets after delivery",
    type: 'simple'
  },
  {
    code: "7.1.1",
    name: "Number of males assessed for STI/RTI",
    type: 'simple'
  },
  {
    code: "7.1.1.a",
    name: "Out of the above, number of males diagnosed with STI/RTI",
    type: 'simple'
  },
  {
    code: "7.1.1.b",
    name: "Out of the above, number of males treated for STI/RTI",
    type: 'simple'
  },
  {
    code: "7.1.2",
    name: "Number of females (all females) assessed for STI/RTI",
    type: 'simple'
  },
  {
    code: "7.1.2.a",
    name: "Out of the above, number of females (all females) diagnosed with STI/RTI",
    type: 'simple'
  },
  {
    code: "7.1.2.b",
    name: "Out of the above, number of females (all females) treated for STI/RTI",
    type: 'simple'
  },
  {
    code: "7.1.3",
    name: "Number of H/TG assessed for STI/RTI",
    type: 'simple'
  },
  {
    code: "7.1.3.a",
    name: "Out of the above, number of H/TG people diagnosed with STI/RTI",
    type: 'simple'
  },
  {
    code: "7.1.3.b",
    name: "Out of the above, number of H/TG people treated for STI/RTI",
    type: 'simple'
  },
  {
    code: "8.1.1",
    name: "Number of Non Scalpel Vasectomy (NSV) / Conventional Vasectomy conducted",
    type: 'simple'
  },
  {
    code: "8.2.1",
    name: "Number of Laparoscopic sterilizations (excluding post-abortion) conducted",
    type: 'simple'
  },
  {
    code: "8.2.2",
    name: "Number of Interval sterilizations (Mini-lap/Conventional) (other than post-partum and post abortion) conducted",
    type: 'simple'
  },
  {
    code: "8.2.3",
    name: "Number of Postpartum sterilizations (within 7 days of delivery by minilap or concurrent with caesarean section) conducted",
    type: 'simple'
  },
  {
    code: "8.2.4",
    name: "Number of Post-abortion sterilizations (within 7 days of spontaneous or surgical abortion) conducted",
    type: 'simple'
  },
  {
    code: "8.3",
    name: "Number of Interval IUCD Insertions (excluding PPIUCD and PAIUCD)",
    type: 'simple'
  },
  {
    code: "8.4",
    name: "Number of Postpartum (within 48 hours of delivery) IUCD insertions",
    type: 'simple'
  },
  {
    code: "8.5",
    name: "Number of Post-abortion (within 12 days of spontaneous or surgical abortion) IUCD insertions",
    type: 'simple'
  },
  {
    code: "8.6",
    name: "Number of IUCD Removals",
    type: 'simple'
  },
  {
    code: "8.7",
    name: "Number of complications following IUCD Insertion",
    type: 'simple'
  },
  {
    code: "8.8",
    name: "Injectable Contraceptive MPA- First Dose",
    type: 'simple'
  },
  {
    code: "8.9",
    name: "Injectable Contraceptive MPA- Second Dose",
    type: 'simple'
  },
  {
    code: "8.10",
    name: "Injectable Contraceptive MPA- Third Dose",
    type: 'simple'
  },
  {
    code: "8.11",
    name: "Injectable Contraceptive MPA- Fourth and above Dose",
    type: 'simple'
  },
  {
    code: "8.12",
    name: "Number of  Combined Oral Pill cycles distributed to the beneficiary",
    type: 'simple'
  },
  {
    code: "8.13",
    name: "Number of Condom pieces distributed to the beneficiary",
    type: 'simple'
  },
  {
    code: "8.14",
    name: "Number of  Centchroman (weekly) pill strips distributed to the beneficiary",
    type: 'simple'
  },
  {
    code: "8.15",
    name: "Number of   Emergency Contraceptive Pills (ECP) given  to the beneficiary",
    type: 'simple'
  },
  {
    code: "8.16",
    name: "Number of Pregnancy Test Kits (PTK) utilized",
    type: 'simple'
  },
  {
    code: "8.17.1",
    name: "Complications following male sterilization",
    type: 'simple'
  },
  {
    code: "8.17.2",
    name: "Complications following female sterilization",
    type: 'simple'
  },
  {
    code: "8.17.3",
    name: "Failures following male sterilization",
    type: 'simple'
  },
  {
    code: "8.17.4",
    name: "Failures following female sterilization",
    type: 'simple'
  },
  {
    code: "8.17.5",
    name: "Deaths following male sterilization",
    type: 'simple'
  },
  {
    code: "8.17.6",
    name: "Deaths following female sterilization",
    type: 'simple'
  },
  {
    code: "8.18.1",
    name: "Number of cases of Female Sterilization followed up (after 1 month or on the resumption of her menstrual cycle whichever is earlier)",
    type: 'simple'
  },
  {
    code: "8.18.2",
    name: "Number of cases of Male Sterilization followed up (after 3 months)",
    type: 'simple'
  },
  {
    code: "9.1.1",
    name: "Child immunisation - Vitamin K (Birth Dose)",
    type: 'simple'
  },
  {
    code: "9.1.2",
    name: "Child immunisation - BCG",
    type: 'simple'
  },
  {
    code: "9.1.3",
    name: "Child immunisation - Pentavalent 1",
    type: 'simple'
  },
  {
    code: "9.1.4",
    name: "Child immunisation - Pentavalent 2",
    type: 'simple'
  },
  {
    code: "9.1.5",
    name: "Child immunisation - Pentavalent 3",
    type: 'simple'
  },
  {
    code: "9.1.6",
    name: "Child immunisation - OPV 0 (Birth Dose)",
    type: 'simple'
  },
  {
    code: "9.1.7",
    name: "Child immunisation - OPV1",
    type: 'simple'
  },
  {
    code: "9.1.8",
    name: "Child immunisation - OPV2",
    type: 'simple'
  },
  {
    code: "9.1.9",
    name: "Child immunisation - OPV3",
    type: 'simple'
  },
  {
    code: "9.1.10",
    name: "Child immunisation - Hepatitis-B0 (Birth Dose)",
    type: 'simple'
  },
  {
    code: "9.1.11",
    name: "Child immunisation - Inactivated Injectable Polio Vaccine 1 (IPV 1)",
    type: 'simple'
  },
  {
    code: "9.1.12",
    name: "Child immunisation - Inactivated Injectable Polio Vaccine 2 (IPV 2)",
    type: 'simple'
  },
  {
    code: "9.1.13",
    name: "Child immunisation - Rotavirus 1",
    type: 'simple'
  },
  {
    code: "9.1.14",
    name: "Child immunisation - Rotavirus 2",
    type: 'simple'
  },
  {
    code: "9.1.15",
    name: "Child immunisation - Rotavirus 3",
    type: 'simple'
  },
  {
    code: "9.1.16",
    name: "Child immunisation - PCV1",
    type: 'simple'
  },
  {
    code: "9.1.17",
    name: "Child immunisation - PCV2",
    type: 'simple'
  },
  {
    code: "9.2.1",
    name: "Child immunisation(9 - 11 months) - Inactivated Injectable Polio Vaccine 3 (IPV 3)",
    type: 'simple'
  },
  {
    code: "9.2.2",
    name: "Child immunisation (9-11months) - Measles & Rubella (MR)/Measles containing vaccine(MCV) - 1st Dose",
    type: 'simple'
  },
  {
    code: "9.2.3",
    name: "Child immunisation (9-11months) - JE 1st dose",
    type: 'simple'
  },
  {
    code: "9.2.4",
    name: "Child immunisation - PCV Booster",
    type: 'simple'
  },
  {
    code: "9.2.5.a",
    name: "FULLY IMMUNIZED children aged between 9 and <12 months- Male",
    type: 'simple'
  },
  {
    code: "9.2.5.b",
    name: "FULLY IMMUNIZED children aged between 9 and <12 months- Female",
    type: 'simple'
  },
  {
    code: "9.3.1",
    name: "Child immunisation(after 12 months-delayed vaccination) - Measles & Rubella (MR)/Measles containing vaccine(MCV)- 1st Dose",
    type: 'simple'
  },
  {
    code: "9.3.2",
    name: "Child immunisation (after 12 months-delayed vaccination) - JE 1st dose",
    type: 'simple'
  },
  {
    code: "9.3.3",
    name: "Child immunisation - DPT 1 after 12 months of age (delayed vaccination)",
    type: 'simple'
  },
  {
    code: "9.3.4",
    name: "Child immunisation - DPT 2 after 12 months of age (delayed vaccination)",
    type: 'simple'
  },
  {
    code: "9.3.5",
    name: "Child immunisation - DPT 3 after 12 months of age (delayed vaccination)",
    type: 'simple'
  },
  {
    code: "9.3.6",
    name: "Child immunisation - DPT Booster after 24 months of age (delayed vaccination)",
    type: 'simple'
  },
  {
    code: "9.3.7",
    name: "Child immunisation - OPV Booster after 24 months of age (delayed vaccination)",
    type: 'simple'
  },
  {
    code: "9.3.8",
    name: "Child immunisation - JE Booster after 24 months of age (delayed vaccination)",
    type: 'simple'
  },
  {
    code: "9.4.1",
    name: "Child immunisation - Measles & Rubella (MR)/ Measles containing vaccine(MCV)- 2nd Dose (16-24 months)",
    type: 'simple'
  },
  {
    code: "9.4.2",
    name: "Child immunisation - DPT 1st Booster",
    type: 'simple'
  },
  {
    code: "9.4.3",
    name: "Child immunisation - OPV Booster",
    type: 'simple'
  },
  {
    code: "9.4.4",
    name: "Number of children more than 16 months of age who received Japanese Encephalitis (JE) vaccine- 2nd dose (16-24 months)",
    type: 'simple'
  },
  {
    code: "9.5.1",
    name: "Child Immunization- Typhoid",
    type: 'simple'
  },
  {
    code: "9.5.2",
    name: "Children more than 5 years received DPT5 (2nd Booster)",
    type: 'simple'
  },
  {
    code: "9.5.3",
    name: "Children more than 10 years received Td10 (Tetanus Diptheria10)",
    type: 'simple'
  },
  {
    code: "9.5.4",
    name: "Children more than 16 years received Td16 (Tetanus Diptheria16)",
    type: 'simple'
  },
  {
    code: "9.6.1",
    name: "Number of cases of AEFI -Minor (eg.- fever, rash, pain etc)",
    type: 'simple'
  },
  {
    code: "9.6.2",
    name: "Number of cases of AEFI - Severe (eg.- anaphylaxis, fever>102 degrees, not requiring hospitalization etc.)",
    type: 'simple'
  },
  {
    code: "9.6.3",
    name: "Number of cases of AEFI - Serious (eg.- hospitalization, death, disability , cluster etc.)",
    type: 'simple'
  },
  {
    code: "9.6.3.a",
    name: "Out of Number of cases of AEFI - Serious , total number of AEFI deaths",
    type: 'simple'
  },
  {
    code: "9.7.1",
    name: "Immunisation sessions planned",
    type: 'simple'
  },
  {
    code: "9.7.2",
    name: "Immunisation sessions held",
    type: 'simple'
  },
  {
    code: "9.8.1",
    name: "Child immunisation - Vitamin A Dose - 1",
    type: 'simple'
  },
  {
    code: "9.8.2",
    name: "Child immunisation - Vitamin A Dose - 5",
    type: 'simple'
  },
  {
    code: "9.8.3",
    name: "Child immunisation - Vitamin A Dose - 9",
    type: 'simple'
  },
  {
    code: "10.1.1",
    name: "Childhood Diseases - Pneumonia",
    type: 'simple'
  },
  {
    code: "10.1.2",
    name: "Childhood Diseases - Asthma",
    type: 'simple'
  },
  {
    code: "10.1.3",
    name: "Childhood Diseases - Sepsis",
    type: 'simple'
  },
  {
    code: "10.1.4",
    name: "Childhood Diseases - Diphtheria",
    type: 'simple'
  },
  {
    code: "10.1.5",
    name: "Childhood Diseases - Pertussis",
    type: 'simple'
  },
  {
    code: "10.1.6",
    name: "Childhood Diseases - Tetanus Neonatorum",
    type: 'simple'
  },
  {
    code: "10.1.7",
    name: "Childhood Diseases - Tuberculosis (TB)",
    type: 'simple'
  },
  {
    code: "10.1.8",
    name: "Childhood Diseases - Acute Flaccid Paralysis(AFP)",
    type: 'simple'
  },
  {
    code: "10.1.9",
    name: "Childhood Diseases - Measles",
    type: 'simple'
  },
  {
    code: "10.1.10",
    name: "Childhood Diseases - Malaria",
    type: 'simple'
  },
  {
    code: "10.1.11",
    name: "Childhood Diseases - Diarrhoea",
    type: 'simple'
  },
  {
    code: "10.1.12",
    name: "Childhood Diseases - Diarrhoea treated with ORS",
    type: 'simple'
  },
  {
    code: "10.1.13",
    name: "Childhood Diseases - Diarrhoea treated with Zinc for 14 days",
    type: 'simple'
  },
  {
    code: "10.1.14",
    name: "Childhood Diseases -Leprosy Cases",
    type: 'simple'
  },
  {
    code: "10.1.15",
    name: "Childhood Diseases- Leprosy with Grade II disability",
    type: 'simple'
  },
  {
    code: "10.2.1",
    name: "Children admitted with Respiratory Infections",
    type: 'simple'
  },
  {
    code: "10.2.2",
    name: "Children admitted with Pneumonia",
    type: 'simple'
  },
  {
    code: "10.2.3",
    name: "Children admitted with Diarrhoea",
    type: 'simple'
  },
  {
    code: "11.1.1.a",
    name: "Total Blood Smears Examined for Malaria",
    type: 'simple'
  },
  {
    code: "11.1.1.b",
    name: "Malaria (Microscopy Tests ) - Plasmodium Vivax test positive",
    type: 'simple'
  },
  {
    code: "11.1.1.c",
    name: "Malaria (Microscopy Tests ) - Plasmodium Falciparum test positive",
    type: 'simple'
  },
  {
    code: "11.1.1.d",
    name: "Malaria (Microscopy Tests ) - Mixed test positive",
    type: 'simple'
  },
  {
    code: "11.1.2.a",
    name: "RDT conducted for Malaria",
    type: 'simple'
  },
  {
    code: "11.1.2.b",
    name: "Malaria (RDT) - Plasmodium Vivax test positive",
    type: 'simple'
  },
  {
    code: "11.1.2.c",
    name: "Malaria (RDT) - Plasmodium Falciparum test positive",
    type: 'simple'
  },
  {
    code: "11.1.2.d",
    name: "Malaria (RDT) - Mixed test positive",
    type: 'simple'
  },
  {
    code: "11.2.1",
    name: "Kala Azar (RDT) - Tests Conducted",
    type: 'simple'
  },
  {
    code: "11.2.2",
    name: "Kala Azar Positive Cases",
    type: 'simple'
  },
  {
    code: "11.3.1",
    name: "Dengue - Enzyme- Linked Immuno Sorbent Assay (ELISA) test conducted",
    type: 'simple'
  },
  {
    code: "11.3.2",
    name: "Dengue - Enzyme- Linked Immuno Sorbent Assay (ELISA) test found positive",
    type: 'simple'
  },
  {
    code: "11.3.3",
    name: "Chikungunya  Enzyme- Linked Immuno Sorbent Assay (ELISA) test conducted",
    type: 'simple'
  },
  {
    code: "11.3.4",
    name: "Chikungunya  Enzyme- Linked Immuno Sorbent Assay (ELISA) test found positive",
    type: 'simple'
  },
  {
    code: "11.4.1",
    name: "No. of AES cases tested for JE(IgM ELISA)",
    type: 'simple'
  },
  {
    code: "11.4.2",
    name: "No. of JE positive cases",
    type: 'simple'
  },
  {
    code: "11.5.1",
    name: "Number of persons that consumed MDA(Mass Drug Administration) drugs during the MDA round",
    type: 'simple'
  },
  {
    code: "11.5.2",
    name: "Number  of Lymphatic Filarisis lymphoedema patients received  MMDP(Morbidity Management And Disability Prevention) kits",
    type: 'simple'
  },
  {
    code: "11.5.3",
    name: "Number of Hydrocele surgeries conducted in Lymphatic Filariasis (MMDP)",
    type: 'simple'
  },
  {
    code: "12.1.1.a",
    name: "Girls registered in AFHC",
    type: 'simple'
  },
  {
    code: "12.1.1.b",
    name: "Boys registered in AFHC",
    type: 'simple'
  },
  {
    code: "12.1.2.a",
    name: "Out of Girls registered, Girls received clinical services",
    type: 'simple'
  },
  {
    code: "12.1.2.b",
    name: "Out of Boys registered, Boys received clinical services",
    type: 'simple'
  },
  {
    code: "12.1.3.a",
    name: "Out of Girls registered, Girls received counselling",
    type: 'simple'
  },
  {
    code: "12.1.3.b",
    name: "Out of Boys registered, Boys received counselling",
    type: 'simple'
  },
  {
    code: "12.3.1",
    name: "Number of adolescent girls provided sanitary napkin packs by ASHA",
    type: 'simple'
  },
  {
    code: "12.3.2",
    name: "Number of sanitary napkin packs distributed free to ASHA (for her personal use)",
    type: 'simple'
  },
  {
    code: "12.3.3",
    name: "Number of adolescent girls attended monthly meeting",
    type: 'simple'
  },
  {
    code: "12.3.4",
    name: "Number of adolescent girls provided sanitary napkin packs by State/UT supported Menstrual Hygiene Scheme (MHS)",
    type: 'simple'
  },
  {
    code: "12.4.1",
    name: "Number of Peer Educators selected",
    type: 'simple'
  },
  {
    code: "12.4.2",
    name: "Out of the selected Peer Educators, numbers trained",
    type: 'simple'
  },
  {
    code: "12.4.3",
    name: "Number of Adolescent Health & Wellness Days organized",
    type: 'simple'
  },
  {
    code: "12.4.4",
    name: "Number of Adolescent Friendly Club Meetings organized",
    type: 'simple'
  },
  {
    code: "13.1",
    name: "Number of notified TB patients who are on Anti Tuberculosis Therapy",
    type: 'simple'
  },
  {
    code: "13.2",
    name: "Number of Presumptive TB (ie with 4 Symptom complex of TB) identified",
    type: 'simple'
  },
  {
    code: "13.3",
    name: "Number of Presumptive TB (ie with 4 Symptom complex of TB) identified and sent for any TB testing",
    type: 'simple'
  },
  {
    code: "13.3.a",
    name: "Number of Presumptive TB (ie with 4 Symptom complex of TB) identified and sent for any TB testing within the facility",
    type: 'simple'
  },
  {
    code: "13.3.b",
    name: "Number of Presumptive TB (ie with 4 Symptom complex of TB) identified and sent for any TB testing outside the facility",
    type: 'simple'
  },
  {
    code: "13.4",
    name: "Of the number sent for testing, number who were tested (by any test) for TB within the facility",
    type: 'simple'
  },
  {
    code: "13.5",
    name: "Of the number sent for testing, number who were tested (by any test) for TB outside the facility",
    type: 'simple'
  },
  {
    code: "13.6",
    name: "Of the number tested, number of persons diagnosed as TB patients.",
    type: 'simple'
  },
  {
    code: "13.7",
    name: "Number of TB patients availing treatment through a Treatment supporter for the reporting month",
    type: 'simple'
  },
  {
    code: "13.8",
    name: "Number of beneficiarys who are registered at the ICTC centre.",
    type: 'simple'
  },
  {
    code: "13.9",
    name: "Of the number registered at the ICTC centre, the number of presumptive TB cases identified and referred for TB testing and diagnosis.",
    type: 'simple'
  },
  {
    code: "13.10",
    name: "Number of Directly Observed Treatment, Short-course (DOTS) cases completed successfully",
    type: 'simple'
  },
  {
    code: "14.1.1",
    name: "Outpatient - Diabetes",
    type: 'simple'
  },
  {
    code: "14.1.2",
    name: "Outpatient - Hypertension",
    type: 'simple'
  },
  {
    code: "14.1.3",
    name: "Outpatient - Stroke (Paralysis)",
    type: 'simple'
  },
  {
    code: "14.1.4",
    name: "Outpatient - Cardiovascular Disease",
    type: 'simple'
  },
  {
    code: "14.1.5",
    name: "Outpatient - Mental illness",
    type: 'simple'
  },
  {
    code: "14.1.6",
    name: "Outpatient - Epilepsy",
    type: 'simple'
  },
  {
    code: "14.1.7",
    name: "Outpatient - Ophthalmic Related",
    type: 'simple'
  },
  {
    code: "14.1.8",
    name: "Outpatient - Dental",
    type: 'simple'
  },
  {
    code: "14.1.9",
    name: "Outpatient - ENT",
    type: 'simple'
  },
  {
    code: "14.1.10",
    name: "Outpatients- Asthma",
    type: 'simple'
  },
  {
    code: "14.1.11",
    name: "Outpatient - Oral Cancer",
    type: 'simple'
  },
  {
    code: "14.1.12",
    name: "Outpatient - Breast Cancer",
    type: 'simple'
  },
  {
    code: "14.1.13",
    name: "Outpatient - Cervical Cancer",
    type: 'simple'
  },
  {
    code: "14.1.14",
    name: "Outpatient - Other Cancer",
    type: 'simple'
  },
  {
    code: "14.1.15",
    name: "Outpatient - COPD",
    type: 'simple'
  },
  {
    code: "14.1.16",
    name: "Outpatient - CKD (Chronic Kidney Disease)",
    type: 'simple'
  },
  {
    code: "14.1.17",
    name: "Outpatient- Patients undergoing refraction",
    type: 'simple'
  },
  {
    code: "14.1.18",
    name: "Outpatient - Tuberculosis",
    type: 'simple'
  },
  {
    code: "14.1.19",
    name: "Outpatient - Leprosy Cases",
    type: 'simple'
  },
  {
    code: "14.1.20",
    name: "Outpatient - Leprosy with Grade II disability",
    type: 'simple'
  },
  {
    code: "14.1.21",
    name: "Outpatient - Geriatric (age>=60 yrs)",
    type: 'simple'
  },
  {
    code: "14.1.22",
    name: "Outpatient - Chronic Liver Disease",
    type: 'simple'
  },
  {
    code: "14.1.23",
    name: "Outpatient - Palliative Care",
    type: 'simple'
  },
  {
    code: "14.1.24.a",
    name: "Number of patients provided physiotherapy services",
    type: 'simple'
  },
  {
    code: "14.1.24.b",
    name: "Number of Palliative Patients visited at home",
    type: 'simple'
  },
  {
    code: "14.2.1",
    name: "Allopathic- Outpatient attendance",
    type: 'simple'
  },
  {
    code: "14.2.2",
    name: "Ayush - Outpatient attendance",
    type: 'simple'
  },
  {
    code: "14.3.1.a",
    name: "IPD Admission Male- Children<18yrs",
    type: 'simple'
  },
  {
    code: "14.3.1.b",
    name: "IPD Admission Male- Adults <60yrs",
    type: 'simple'
  },
  {
    code: "14.3.1.c",
    name: "IPD Admission Female- Children<18yrs",
    type: 'simple'
  },
  {
    code: "14.3.1.d",
    name: "IPD Admission Female- Adults<60yrs",
    type: 'simple'
  },
  {
    code: "14.3.1.e",
    name: "IPD Admission Geriatric->=60yrs",
    type: 'simple'
  },
  {
    code: "14.3.2.a",
    name: "IPD Discharge Male- Children<18yrs",
    type: 'simple'
  },
  {
    code: "14.3.2.b",
    name: "IPD Discharge Male- Adults<60yrs",
    type: 'simple'
  },
  {
    code: "14.3.2.c",
    name: "IPD Discharge Female- Children<18yrs",
    type: 'simple'
  },
  {
    code: "14.3.2.d",
    name: "IPD Discharge Female- Adults<60yrs",
    type: 'simple'
  },
  {
    code: "14.3.2.e",
    name: "IPD Discharge Geriatric->=60yrs",
    type: 'simple'
  },
  {
    code: "14.3.3.a",
    name: "IPD Referred Male- Children<18yrs",
    type: 'simple'
  },
  {
    code: "14.3.3.b",
    name: "IPD Referred Male- Adults<60yrs",
    type: 'simple'
  },
  {
    code: "14.3.3.c",
    name: "IPD Referred Female- Children<18yrs",
    type: 'simple'
  },
  {
    code: "14.3.3.d",
    name: "IPD Referred Female- Adults<60yrs",
    type: 'simple'
  },
  {
    code: "14.3.3.e",
    name: "IPD Referred Geriatric->=60yrs",
    type: 'simple'
  },
  {
    code: "14.3.4.a",
    name: "IPD Deaths Male- Children<18yrs",
    type: 'simple'
  },
  {
    code: "14.3.4.b",
    name: "IPD Deaths Male- Adults<60yrs",
    type: 'simple'
  },
  {
    code: "14.3.4.c",
    name: "IPD Deaths Female- Children<18yrs",
    type: 'simple'
  },
  {
    code: "14.3.4.d",
    name: "IPD Deaths Female- Adults<60yrs",
    type: 'simple'
  },
  {
    code: "14.3.4.e",
    name: "IPD Deaths Geriatric->=60yrs",
    type: 'simple'
  },
  {
    code: "14.3.5.a",
    name: "Total cases Referred out  (OPD+IPD+Emergency)-During Day",
    type: 'simple'
  },
  {
    code: "14.3.5.b",
    name: "Total cases Referred out  (OPD+IPD+Emergency)-At Night (8 PM- 8 AM)",
    type: 'simple'
  },
  {
    code: "14.3.6",
    name: "Day Care Admissions",
    type: 'simple'
  },
  {
    code: "14.3.7.a",
    name: "Number of Total Left Against Medical Advice (LAMA) cases reported at the facility",
    type: 'simple'
  },
  {
    code: "14.3.7.b",
    name: "Number of delivery LAMA cases reported at the facility",
    type: 'simple'
  },
  {
    code: "14.3.8",
    name: "Total number of Medico Legal Cases reported at the facility",
    type: 'simple'
  },
  {
    code: "14.3.9",
    name: "Total number of postmortem conducted at the facility",
    type: 'simple'
  },
  {
    code: "14.3.10",
    name: "Total number of telemedicine consultation provided",
    type: 'simple'
  },
  {
    code: "14.4.1",
    name: "Inpatient - Malaria",
    type: 'simple'
  },
  {
    code: "14.4.2",
    name: "Inpatient - Dengue",
    type: 'simple'
  },
  {
    code: "14.4.3",
    name: "Inpatient - Typhoid",
    type: 'simple'
  },
  {
    code: "14.4.4",
    name: "Inpatient - Asthma, Chronic Obstructive Pulmonary Disease (COPD), Respiratory infections",
    type: 'simple'
  },
  {
    code: "14.4.5",
    name: "Inpatient - Tuberculosis",
    type: 'simple'
  },
  {
    code: "14.4.6",
    name: "Inpatient - Pyrexia of unknown origin (PUO)",
    type: 'simple'
  },
  {
    code: "14.4.7",
    name: "Inpatient - Diarrhoea with dehydration",
    type: 'simple'
  },
  {
    code: "14.4.8",
    name: "Inpatient - Leprosy (Reconstructive Surgery)",
    type: 'simple'
  },
  {
    code: "14.4.9",
    name: "Inpatient - Operated for Cataract",
    type: 'simple'
  },
  {
    code: "14.4.10",
    name: "Inpatient - Pallative Care",
    type: 'simple'
  },
  {
    code: "14.5.1",
    name: "Patients registered at Emergency Department",
    type: 'simple'
  },
  {
    code: "14.5.2",
    name: "No. of Emergencies managed at night (8 PM- 8 AM)",
    type: 'simple'
  },
  {
    code: "14.6.1.a",
    name: "Emergency - Trauma ( accident, injury, poisoning etc) -Admission",
    type: 'simple'
  },
  {
    code: "14.6.1.b",
    name: "Emergency - Trauma ( accident, injury, poisoning etc) -Deaths",
    type: 'simple'
  },
  {
    code: "14.6.2.a",
    name: "Emergency - Burn -Admission",
    type: 'simple'
  },
  {
    code: "14.6.2.b",
    name: "Emergency - Burn -Deaths",
    type: 'simple'
  },
  {
    code: "14.6.3.a",
    name: "Emergency - Obstetrics complications -Admission",
    type: 'simple'
  },
  {
    code: "14.6.3.b",
    name: "Emergency - Obstetrics complications -Deaths",
    type: 'simple'
  },
  {
    code: "14.6.4.a",
    name: "Emergency - Snake Bite -Admission",
    type: 'simple'
  },
  {
    code: "14.6.4.b",
    name: "Emergency - Snake Bite -Deaths",
    type: 'simple'
  },
  {
    code: "14.6.5.a",
    name: "Emergency - Acute Cardiac Emergencies - Admission",
    type: 'simple'
  },
  {
    code: "14.6.5.b",
    name: "Emergency - Acute Cardiac Emergencies - Deaths",
    type: 'simple'
  },
  {
    code: "14.6.6.a",
    name: "Emergency - CVA (Cerebrovascular Disease)/Stroke -Admission",
    type: 'simple'
  },
  {
    code: "14.6.6.b",
    name: "Emergency - CVA (Cerebrovascular Disease)/Stroke -Deaths",
    type: 'simple'
  },
  {
    code: "14.6.7.a",
    name: "Emergency - Dog Bite - Admission",
    type: 'simple'
  },
  {
    code: "14.6.7.b",
    name: "Emergency - Dog Bite - Deaths",
    type: 'simple'
  },
  {
    code: "14.7",
    name: "Total number of deaths occurring at Emergency Department",
    type: 'simple'
  },
  {
    code: "14.8.1.a",
    name: "Total number of Major Operations conducted excluding C-Section (General and spinal anaesthesia)",
    type: 'simple'
  },
  {
    code: "14.8.1.b",
    name: "Out of Major Operation, Gynecology- Hysterectomy surgeries",
    type: 'simple'
  },
  {
    code: "14.8.1.c",
    name: "Major Surgeries excluding Obstetrics, Gynaecology and Opthalmology.",
    type: 'simple'
  },
  {
    code: "14.8.1.d",
    name: "No. of Major Surgeries done at night (8PM to 8 AM) (Excluding C section)",
    type: 'simple'
  },
  {
    code: "14.8.2",
    name: "Minor Operations (No or local anaesthesia)",
    type: 'simple'
  },
  {
    code: "14.8.3",
    name: "Number of post operative Surgical Site infection",
    type: 'simple'
  },
  {
    code: "14.9.1",
    name: "Number of blood units issued for Operations (excluding C-section)",
    type: 'simple'
  },
  {
    code: "14.9.2",
    name: "Number of blood transfusions done during Operations (excluding C-section)",
    type: 'simple'
  },
  {
    code: "14.10.",
    name: "In-Patient Head Count at midnight",
    type: 'simple'
  },
  {
    code: "14.11.1",
    name: "Number of Admission in NBSU ( New Born Stabilisation Unit)",
    type: 'simple'
  },
  {
    code: "14.11.2",
    name: "Special Newborn Care Unit (SNCU Admissions) - Inborn Male",
    type: 'simple'
  },
  {
    code: "14.11.3",
    name: "Special Newborn Care Unit (SNCU Admissions) - Inborn Female",
    type: 'simple'
  },
  {
    code: "14.11.4",
    name: "Special Newborn Care Unit (SNCU Admissions) - Outborn Male",
    type: 'simple'
  },
  {
    code: "14.11.5",
    name: "Special Newborn Care Unit (SNCU Admissions) - Outborn Female",
    type: 'simple'
  },
  {
    code: "14.11.6",
    name: "Special Newborn Care Unit (SNCU Admissions) - referred by ASHA",
    type: 'simple'
  },
  {
    code: "14.12.1",
    name: "Number of deaths occurred at SNCU",
    type: 'simple'
  },
  {
    code: "14.12.2",
    name: "Number of Newborns successfully discharged from SNCU",
    type: 'simple'
  },
  {
    code: "14.13.1.a",
    name: "Total number of  PW and PNC  - JSSK Beneficiaries",
    type: 'simple'
  },
  {
    code: "14.13.1.b",
    name: "Number of PW and PNC benificiaries provided - Free Medicines under JSSK",
    type: 'simple'
  },
  {
    code: "14.13.1.c",
    name: "Number of PW and PNC benificiaries  provided - Free Diet under JSSK",
    type: 'simple'
  },
  {
    code: "14.13.1.d",
    name: "Number of PW and PNC benificiaries provided - Free Diagnostics under JSSK",
    type: 'simple'
  },
  {
    code: "14.13.1.e",
    name: "Number of PW and PNC benificiaries provided - Free Home to facility transport under JSSK",
    type: 'simple'
  },
  {
    code: "14.13.1.f",
    name: "Number of PW and PNC benificiaries provided - Interfacility transfers when needed under JSSK",
    type: 'simple'
  },
  {
    code: "14.13.1.g",
    name: "Number of PW and PNC benificiaries provided - Free Drop Back home under JSSK",
    type: 'simple'
  },
  {
    code: "14.13.1.h",
    name: "Number of PW and PNC benificiaries provided - Free Blood transfusion under JSSK",
    type: 'simple'
  },
  {
    code: "14.13.2.a",
    name: "Number of infants admitted at facility due to any sickness- JSSK Beneficiaries",
    type: 'simple'
  },
  {
    code: "14.13.2.b",
    name: "Number of sick infants provided - Free Medicines under JSSK",
    type: 'simple'
  },
  {
    code: "14.13.2.c",
    name: "Number of sick infants provided - Free Diagnostics under JSSK",
    type: 'simple'
  },
  {
    code: "14.13.2.d",
    name: "Number of sick infants provided - Free Home to facility transport under JSSK",
    type: 'simple'
  },
  {
    code: "14.13.2.e",
    name: "Number of sick infants provided - Interfacility transfers when needed under JSSK",
    type: 'simple'
  },
  {
    code: "14.13.2.f",
    name: "Number of sick infants provided - Free Drop Back home under JSSK",
    type: 'simple'
  },
  {
    code: "14.13.2.g",
    name: "Number of sick infants provided - Free Blood transfusion under JSSK",
    type: 'simple'
  },
  {
    code: "14.14.1",
    name: "Number of sick SAM children admitted in standalone/ integrated NRC",
    type: 'simple'
  },
  {
    code: "14.14.2",
    name: "Number of sick SAM children referred to standalone/ integrated NRC by Frontline Workers (AWW/ ASHA/ ANM)",
    type: 'simple'
  },
  {
    code: "14.14.3",
    name: "Number of sick SAM children referred to standalone/ integrated NRC from IPD/OPD of other Health Facility (PHC/CHC/SDH/DH/other NRC)",
    type: 'simple'
  },
  {
    code: "14.14.4",
    name: "Number of children Referred to standalone/ integrated NRC by RBSK Team",
    type: 'simple'
  },
  {
    code: "14.14.5",
    name: "Number of SAM children discharged from standalone/ integrated NRC who met the discharge criteria",
    type: 'simple'
  },
  {
    code: "14.14.6",
    name: "Number of admitted children left against medical advice (LAMA) / defaulter",
    type: 'simple'
  },
  {
    code: "14.14.7",
    name: "Number of children died while admitted in standalone/ intergrated NRC",
    type: 'simple'
  },
  {
    code: "14.14.8",
    name: "Number of children who completed all four post discharge follow-ups",
    type: 'simple'
  },
  {
    code: "14.14.9",
    name: "Number of sick SAM children treated and admitted in the pediatric facility (other than standalone/ integrated NRC)",
    type: 'simple'
  },
  {
    code: "14.14.10",
    name: "In-Patient Head Count at midnight for standalone/ integrated NRC",
    type: 'simple'
  },
  {
    code: "14.15.1",
    name: "Number of Rogi Kalyan Samiti (RKS) meetings held",
    type: 'simple'
  },
  {
    code: "14.15.2",
    name: "Number of Jan Arogya Samiti (JAS) meetings held",
    type: 'simple'
  },
  {
    code: "14.16",
    name: "Number of Anganwadi centres reported to have conducted atleast one Village Health & Nutrition Day (VHNDs)/UHND/ Outreach / Special Outreach sessions",
    type: 'simple'
  },
  {
    code: "14.17",
    name: "Total number of UHND/VHND sessions conducted in the reporting month",
    type: 'simple'
  },
  {
    code: "14.18",
    name: "Total number of Outreach/Special Outreach camps conducted in the reporting month",
    type: 'simple'
  },
  {
    code: "14.19.a",
    name: "Stock out rate of essential Drugs",
    type: 'simple'
  },
  {
    code: "14.19.b",
    name: "Total no. of essential drugs for which stock-outs reported",
    type: 'simple'
  },
  {
    code: "14.20",
    name: "Blood Units Issued on replacement -{Any donor (apart from voluntary blood donor) to be considered as replacement donations}",
    type: 'simple'
  },
  {
    code: "14.21",
    name: "Total number of blood units issued in month",
    type: 'simple'
  },
  {
    code: "14.22",
    name: "Patient Satisfaction Score of the facility in percentage (from Mera Aspatal)",
    type: 'simple'
  },
  {
    code: "14.23.1.a",
    name: "Number of patients registered for hemodialysis services in the centre during the reporting month",
    type: 'simple'
  },
  {
    code: "14.23.1.b",
    name: "Number of patients on waiting list for hemodialysis services at the end of reporting month",
    type: 'simple'
  },
  {
    code: "14.23.1.c",
    name: "Number of hemodialysis sessions held during the reporting month",
    type: 'simple'
  },
  {
    code: "14.23.2.a",
    name: "Number of patients started Peritoneal dialysis under PMNDP during the reporting month",
    type: 'simple'
  },
  {
    code: "14.24.1.a",
    name: "Total number of blood samples screened by ELISA/Rapid tests for viral hepatitis A (IgM Anti- HAV)",
    type: 'simple'
  },
  {
    code: "14.24.1.b",
    name: "Total number of blood samples screened by ELISA/Rapid tests for viral hepatitis B i.e. HBsAg (excluding pregnant women)",
    type: 'simple'
  },
  {
    code: "14.24.1.c",
    name: "Total number of blood samples screened by ELISA/Rapid tests for viral hepatitis C(Anti- HCV)",
    type: 'simple'
  },
  {
    code: "14.24.1.d",
    name: "Total number of blood samples screened by ELISA/Rapid tests for viral hepatitis E(i.e. IgM Anti-HEV)",
    type: 'simple'
  },
  {
    code: "14.24.2.a",
    name: "Total number of blood samples tested positive by ELISA/ Rapid tests for Hepatitis A (out of those tested for IgM Anti- HAV)",
    type: 'simple'
  },
  {
    code: "14.24.2.b",
    name: "Total number of blood samples tested positive by ELISA/ Rapid tests for Hepatitis B (out of those tested for HBsAg excluding pregnant women)",
    type: 'simple'
  },
  {
    code: "14.24.2.b.i",
    name: "Total number of positive blood samples for hepatitis B by ELISA/ Rapid tests tested for HBV DNA(out of those tested positive for HBsAg excluding pregnant women)",
    type: 'simple'
  },
  {
    code: "14.24.2.b.ii",
    name: "Total number of patients found positive for HBsAg eligible for treatment for hepatitis B (excluding pregnant women)",
    type: 'simple'
  },
  {
    code: "14.24.2.b.iii",
    name: "Total number of patients eligible for treatment for Hepatitis B put on treatment(out of those eligible for treatment excluding pregnant women)",
    type: 'simple'
  },
  {
    code: "14.24.2.c",
    name: "Total number of blood samples tested positive by ELISA/ Rapid tests for Hepatitis C (out of those tested for Anti-HCV)",
    type: 'simple'
  },
  {
    code: "14.24.2.c.i",
    name: "Total number of positive blood samples for Hepatitis C screened by test (ELISA/ Rapid tests) confirmed by HCV RNA testing (out of those positive for anti-HCV)",
    type: 'simple'
  },
  {
    code: "14.24.2.c.ii",
    name: "Total number of patients put on treatment for Hepatitis C (out of those confirmed by HCV RNA i.e. HCV RNA detected)",
    type: 'simple'
  },
  {
    code: "14.24.2.c.iii",
    name: "Total number of positive Hepatitis C patients who have completed treatment",
    type: 'simple'
  },
  {
    code: "14.24.2.c.iv",
    name: "Total number of patients cleared for HCV RNA on sustained virological response at 12 weeks (SVR12)",
    type: 'simple'
  },
  {
    code: "14.24.2.d",
    name: "Total number of blood samples tested positive by ELISA/ Rapid tests for Hepatitis E(out of those tested for IgM Anti-HEV)",
    type: 'simple'
  },
  {
    code: "14.24.3.a",
    name: "Number of Pregnant Women tested for HBsAg",
    type: 'simple'
  },
  {
    code: "14.24.3.b",
    name: "Number of Pregnant Women who are HBsAg positive(out of those tested for Hepatitis B i.e. HBsAg)",
    type: 'simple'
  },
  {
    code: "14.24.3.c",
    name: "Number of Pregnant Women found positive for HBsAg referred out to higher centre for institutional delivery",
    type: 'simple'
  },
  {
    code: "14.24.3.d",
    name: "Number of Pregnant Women found positive for HBsAg delivered in an institution",
    type: 'simple'
  },
  {
    code: "14.24.3.e",
    name: "Number of newborn who received birth dose of Hepatitis B vaccine born to HBsAg positive pregnant women",
    type: 'simple'
  },
  {
    code: "14.24.3.f",
    name: "Number of New Borns to Pregnant Women (found positive for HBsAg) received Hepatitis B Immunoglobulin (HBIG) (within 24 hours of birth)",
    type: 'simple'
  },
  {
    code: "15.1.1",
    name: "Total Number of Lab Tests done- Inhouse",
    type: 'simple'
  },
  {
    code: "15.1.2",
    name: "Total Number of Lab Tests done- Outsourced",
    type: 'simple'
  },
  {
    code: "15.2.1",
    name: "Number of Hb tests conducted including kit tests",
    type: 'simple'
  },
  {
    code: "15.2.2",
    name: "Out of the total number of Hb tests done, Number having Hb < 7 mg",
    type: 'simple'
  },
  {
    code: "15.3.1.a",
    name: "Number of males screened for HIV by Whole Blood Finger Prick/RDT test/POC test",
    type: 'simple'
  },
  {
    code: "15.3.1.b",
    name: "Out of the above, No. of males found reactive for HIV",
    type: 'simple'
  },
  {
    code: "15.3.1.c",
    name: "Number of HIV reactive males subjected to HIV test at Confirmatory Centre (Stand Alone-ICTC)",
    type: 'simple'
  },
  {
    code: "15.3.1.d",
    name: "Out of the above, No. of males confirmed as HIV Positive",
    type: 'simple'
  },
  {
    code: "15.3.2.a",
    name: "Number of females (non-ANC) screened for HIV by Whole Blood Finger Prick/RDT test/POC test",
    type: 'simple'
  },
  {
    code: "15.3.2.b",
    name: "Out of the above, No. of females (non-ANC) found reactive for HIV",
    type: 'simple'
  },
  {
    code: "15.3.2.c",
    name: "Number of HIV reactive females (non-ANC) subjected to HIV test at Confirmatory Centre (Stand Alone-ICTC)",
    type: 'simple'
  },
  {
    code: "15.3.2.d",
    name: "Out of the above, No. of females (non-ANC) confirmed as HIV Positive",
    type: 'simple'
  },
  {
    code: "15.3.3.a",
    name: "Number of Pregnant Women (PW-ANC) screened for HIV by Whole Blood Finger Prick/RDT test/POC test",
    type: 'simple'
  },
  {
    code: "15.3.3.b",
    name: "Out of the above, No. of PW(ANC) found reactive for HIV",
    type: 'simple'
  },
  {
    code: "15.3.3.c",
    name: "Number of HIV reactive PW(ANC) subjected to HIV test at Confirmatory Centre (Stand Alone-ICTC)",
    type: 'simple'
  },
  {
    code: "15.3.3.d",
    name: "Out of the above, No. of PW(ANC) confirmed as HIV Positive",
    type: 'simple'
  },
  {
    code: "15.3.3.e",
    name: "Number of DIL women screened for HIV by Whole Blood Finger Prick/RDT test/POC test",
    type: 'simple'
  },
  {
    code: "15.3.3.f",
    name: "Out of the above, No. of DIL women found reactive for HIV",
    type: 'simple'
  },
  {
    code: "15.3.3.g",
    name: "Number of HIV reactive DIL women subjected to HIV test at Confirmatory Centre (Stand Alone-ICTC)",
    type: 'simple'
  },
  {
    code: "15.3.3.h",
    name: "Out of the above, No. of DIL women confirmed as HIV Positive",
    type: 'simple'
  },
  {
    code: "15.3.3.i",
    name: "Number of Pregnant Women (ANC&DIL) screened for HIV  more than once(Repeated testing)",
    type: 'simple'
  },
  {
    code: "15.3.4.a",
    name: "Number of H/TG people screened for HIV by Whole Blood Finger Prick/RDT test/POC test",
    type: 'simple'
  },
  {
    code: "15.3.4.b",
    name: "Out of the above, No. of H/TG people found reactive for HIV",
    type: 'simple'
  },
  {
    code: "15.3.4.c",
    name: "Number of HIV reactive H/TG people subjected to HIV test at Confirmatory Centre (Stand Alone-ICTC)",
    type: 'simple'
  },
  {
    code: "15.3.4.d",
    name: "Out of the above, No. of H/TG people confirmed as HIV Positive",
    type: 'simple'
  },
  {
    code: "15.4.1.a",
    name: "Total number of males tested for Syphilis (RPR/VDRL/PoC/ RDT/TPHA)",
    type: 'simple'
  },
  {
    code: "15.4.1.b",
    name: "Out of the above, number of males tested reactive for Syphilis (RPR/VDRL/PoC/ RDT/TPHA)",
    type: 'simple'
  },
  {
    code: "15.4.1.c",
    name: "Out of the above, number of males treated for Syphilis",
    type: 'simple'
  },
  {
    code: "15.4.2.a",
    name: "Total number of female (non-ANC) tested for Syphilis (RPR/VDRL/PoC/ RDT/TPHA)",
    type: 'simple'
  },
  {
    code: "15.4.2.b",
    name: "Out of the above, number of females (non-ANC) tested reactive for Syphilis (RPR/VDRL/PoC/ RDT/TPHA)",
    type: 'simple'
  },
  {
    code: "15.4.2.c",
    name: "Out of the above, number of females (non-ANC) treated  for Syphilis",
    type: 'simple'
  },
  {
    code: "15.4.3.a",
    name: "Total number of H/TG people tested for Syphilis (RPR/VDRL/PoC/ RDT/TPHA)",
    type: 'simple'
  },
  {
    code: "15.4.3.b",
    name: "Out of the above, number of H/TG people tested reactive for Syphilis (RPR/VDRL/PoC/ RDT/TPHA)",
    type: 'simple'
  },
  {
    code: "15.4.3.c",
    name: "Out of the above, number of H/TG people treated for Syphilis",
    type: 'simple'
  },
  {
    code: "15.5.1",
    name: "Widal tests- Number Tested",
    type: 'simple'
  },
  {
    code: "15.5.2",
    name: "Widal tests- Number Positive",
    type: 'simple'
  },
  {
    code: "15.6.1.a.i",
    name: "X-ray(Inhouse)",
    type: 'simple'
  },
  {
    code: "15.6.1.a.ii",
    name: "X-ray(Outsource)",
    type: 'simple'
  },
  {
    code: "15.6.1.b.i",
    name: "Ultrasonography (USG) (Inhouse)",
    type: 'simple'
  },
  {
    code: "15.6.1.b.ii",
    name: "Ultrasonography (USG)(Outsource)",
    type: 'simple'
  },
  {
    code: "15.6.1.c.i",
    name: "CT scan (Inhouse)",
    type: 'simple'
  },
  {
    code: "15.6.1.c.ii",
    name: "CT scan (Outsource)",
    type: 'simple'
  },
  {
    code: "15.6.1.d.i",
    name: "MRI (Inhouse)",
    type: 'simple'
  },
  {
    code: "15.6.1.d.ii",
    name: "MRI (Outsource)",
    type: 'simple'
  },
  {
    code: "15.6.1.e.i",
    name: "ECG (Inhouse)",
    type: 'simple'
  },
  {
    code: "15.6.1.e.ii",
    name: "ECG (Outsource)",
    type: 'simple'
  },
  {
    code: "16.1.1a",
    name: "New born deaths within 24 hrs(1 to 23 Hrs 59 minutes) of birth at Facility/Facility to facility in transit",
    type: 'simple'
  },
  {
    code: "16.1.1.b",
    name: "New born deaths within 24 hrs(1 to 23 Hrs 59 minutes) of birth in Community (at home or home to facility transit)",
    type: 'simple'
  },
  {
    code: "16.1.2.a",
    name: "New born deaths within 1 week (1 to 7 days) at Facility/Facility to facility in transit",
    type: 'simple'
  },
  {
    code: "16.1.2.b",
    name: "New born deaths within 1 week (1 to 7 days)  At Community (at home or home to facility transit)",
    type: 'simple'
  },
  {
    code: "16.1.3.a",
    name: "New born deaths within  8 to 28 days at Facility/Facility to facility in transit",
    type: 'simple'
  },
  {
    code: "16.1.3.b",
    name: "New born deaths within  8 to 28 days  At Community (at home or home to facility transit)",
    type: 'simple'
  },
  {
    code: "16.1.4.a",
    name: "Infant Deaths (>28 days to 12 months) at Facility/Facility to facility in transit",
    type: 'simple'
  },
  {
    code: "16.1.4.b",
    name: "Infant Deaths (>28 days to 12 months) At Community (at home or home to facility transit)",
    type: 'simple'
  },
  {
    code: "16.2.1",
    name: "Neonatal Deaths up to 4 weeks (0 to 28 days) due to Sepsis",
    type: 'simple'
  },
  {
    code: "16.2.2",
    name: "Neonatal Deaths up to 4 weeks (0 to 28 days) due to Asphyxia",
    type: 'simple'
  },
  {
    code: "16.2.3",
    name: "Neonatal Deaths up to 4 weeks (0 to 28 days) due to complications of Prematurity",
    type: 'simple'
  },
  {
    code: "16.2.4",
    name: "Neonatal Deaths up to 4 weeks (0 to 28 days) due to Other causes",
    type: 'simple'
  },
  {
    code: "16.3.1",
    name: "Number of Infant Deaths (>28 days - 12 months) due to Pneumonia",
    type: 'simple'
  },
  {
    code: "16.3.2",
    name: "Number of Infant Deaths (>28 days - 12 months) due to Diarrhoea",
    type: 'simple'
  },
  {
    code: "16.3.3",
    name: "Number of Infant Deaths (>28 days - 12 months) due to Fever related",
    type: 'simple'
  },
  {
    code: "16.3.4",
    name: "Number of Infant Deaths (>28 days - 12 months) due to Measles",
    type: 'simple'
  },
  {
    code: "16.3.5",
    name: "Number of Infant Deaths (>28 days - 12 months) due to Others",
    type: 'simple'
  },
  {
    code: "16.4.1",
    name: "Number of Child Deaths (1 -5 years) due to Pneumonia",
    type: 'simple'
  },
  {
    code: "16.4.2",
    name: "Number of Child Deaths (1 -5 years) due to Diarrhoea",
    type: 'simple'
  },
  {
    code: "16.4.3",
    name: "Number of Child Deaths (1 -5 years) due to Fever related",
    type: 'simple'
  },
  {
    code: "16.4.4",
    name: "Number of Child Deaths (1 -5 years) due to Measles",
    type: 'simple'
  },
  {
    code: "16.4.5",
    name: "Number of Child Deaths (1 -5 years) due to Others",
    type: 'simple'
  },
  {
    code: "16.5.1",
    name: "Number of Maternal Deaths due to APH (Antepartum Haemmorhage)",
    type: 'simple'
  },
  {
    code: "16.5.2",
    name: "Number of Maternal Deaths due to PPH (Post-Partum Haemmorhage)",
    type: 'simple'
  },
  {
    code: "16.5.3",
    name: "Number of Maternal Deaths due to Pregnancy related infection and sepsis, Fever",
    type: 'simple'
  },
  {
    code: "16.5.4",
    name: "Number of Maternal Deaths due to Abortive complication",
    type: 'simple'
  },
  {
    code: "16.5.5",
    name: "Number of Maternal Deaths due to Obstructed/prolonged labour",
    type: 'simple'
  },
  {
    code: "16.5.6",
    name: "Number of Maternal Deaths due to Severe hypertension/fits & Hypertensive disorder in pregnancy, birth and puerperium",
    type: 'simple'
  },
  {
    code: "16.5.7",
    name: "Number of Maternal Deaths due to Other/Unknown Causes",
    type: 'simple'
  },
  {
    code: "16.5.8",
    name: "Age wise total Maternal Deaths, occurred at Facility",
    type: 'simple'
  },
  {
    code: "16.5.8.a",
    name: "Out of total number of maternal deaths, deaths with age<15 years",
    type: 'simple'
  },
  {
    code: "16.5.8.b",
    name: "Out of total number of maternal deaths, deaths with age 15-19 years",
    type: 'simple'
  },
  {
    code: "16.5.8.c",
    name: "Out of total number maternal deaths, deaths with age  more than >19-49 years",
    type: 'simple'
  },
  {
    code: "16.5.8.d",
    name: "Out of total number maternal deaths, deaths with age more than >49 years",
    type: 'simple'
  },
  {
    code: "16.6",
    name: "Total Facility Based Maternal Death Reviews (FBMDR) done",
    type: 'simple'
  },
  {
    code: "16.7.1",
    name: "Number of  deaths due to Diarrhoeal diseases",
    type: 'simple'
  },
  {
    code: "16.7.2",
    name: "Number of deaths due to Tuberculosis",
    type: 'simple'
  },
  {
    code: "16.7.3",
    name: "Number of  deaths due to Respiratory diseases including infections (other than TB)",
    type: 'simple'
  },
  {
    code: "16.7.4",
    name: "Number of  deaths due to Other Fever Related",
    type: 'simple'
  },
  {
    code: "16.7.5",
    name: "Number of  deaths due to Heart disease/Hypertension related",
    type: 'simple'
  },
  {
    code: "16.7.6",
    name: "Number of  deaths due to Cancer",
    type: 'simple'
  },
  {
    code: "16.7.7",
    name: "Number of  deaths due to Neurological disease including strokes",
    type: 'simple'
  },
  {
    code: "16.7.8",
    name: "Number of  deaths due to Accidents/Burn cases",
    type: 'simple'
  },
  {
    code: "16.7.9",
    name: "Number of  deaths due to Self Harm",
    type: 'simple'
  },
  {
    code: "16.7.10",
    name: "Number of  deaths due to Animal bites and stings",
    type: 'simple'
  },
  {
    code: "16.7.11",
    name: "Number of  deaths due to Known Acute Disease",
    type: 'simple'
  },
  {
    code: "16.7.12",
    name: "Number of  deaths due to Known Chronic Disease",
    type: 'simple'
  },
  {
    code: "16.7.13",
    name: "Number of  deaths due to Other Causes",
    type: 'simple'
  },
  {
    code: "16.8.1",
    name: "Number of Deaths due to Malaria- Plasmodium Vivax",
    type: 'simple'
  },
  {
    code: "16.8.2",
    name: "Number of Deaths due to Malaria- Plasmodium Falciparum",
    type: 'simple'
  },
  {
    code: "16.8.3",
    name: "Number of Deaths due to Kala Azar",
    type: 'simple'
  },
  {
    code: "16.8.4",
    name: "Number of Deaths due to Dengue",
    type: 'simple'
  },
  {
    code: "16.8.5",
    name: "Number of Deaths due to Acute Encephelitis Syndrome (AES)",
    type: 'simple'
  },
  {
    code: "16.8.6",
    name: "Number of Deaths due to Japanese Encephalitis (JE)",
    type: 'simple'
  },
  {
    code: "16.9",
    name: "Total Deaths (above 5 years of age)",
    type: 'simple'
  },
  {
    code: "16.9.1",
    name: "Above 5 years to below 10 years",
    type: 'simple'
  },
  {
    code: "16.9.2",
    name: "Above 10 years to below 19 years",
    type: 'simple'
  },
  {
    code: "16.9.3",
    name: "Adult above >19 years",
    type: 'simple'
  },
  {
    code: "17.1.1",
    name: "Total number of Haematology tests registered under External Quality Assurance Scheme (EQAS)",
    type: 'simple'
  },
  {
    code: "17.1.2",
    name: "No. of registered Haematology tests reported  EQAS Compliant",
    type: 'simple'
  },
  {
    code: "17.1.3",
    name: "Total number of Biochemistry tests registered under External Quality Assurance Scheme (EQAS)",
    type: 'simple'
  },
  {
    code: "17.1.4",
    name: "No. of registered Bio chemistry tests report EQAS Compliant",
    type: 'simple'
  },
  {
    code: "17.1.5",
    name: "Total Quantity of Bio medical waste generated in Kg for the month (All Yellow, Red, white & Blue)",
    type: 'simple'
  },
  {
    code: "17.1.6",
    name: "Total Quantity of General waste generated in Kg for the month",
    type: 'simple'
  },
  {
    code: "17.2.1",
    name: "Total number of breakdown calls reported for the month",
    type: 'simple'
  },
  {
    code: "17.2.2",
    name: "Total number of breakdown attended for the month",
    type: 'simple'
  },
  {
    code: "17.2.3",
    name: "Number of visit made by the service engineer/ BME for the month",
    type: 'simple'
  }
];
