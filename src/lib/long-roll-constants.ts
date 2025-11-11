import { Gender, HOFRelationship, DeletionReason, HabitationType } from "@/generated/prisma";

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export const HABITATION_TYPE_OPTIONS: { value: HabitationType; label: string }[] = [
  { value: "PERMANENT", label: "Permanent" },
  { value: "TEMPORARY", label: "Temporary" },
];

export const DELETION_REASON_OPTIONS: { value: DeletionReason; label: string }[] = [
  { value: "DEATH", label: "Death" },
  { value: "MIGRATION", label: "Migration to Other Place" },
  { value: "DUPLICATE", label: "Duplicate Entry" },
  { value: "OTHER", label: "Other" },
];

export const HOF_RELATIONSHIP_OPTIONS: { value: HOFRelationship; label: string }[] = [
  { value: "SELF", label: "Self (Head of Family)" },
  { value: "HUSBAND", label: "Husband" },
  { value: "WIFE", label: "Wife" },
  { value: "SON", label: "Son" },
  { value: "DAUGHTER", label: "Daughter" },
  { value: "FATHER", label: "Father" },
  { value: "MOTHER", label: "Mother" },
  { value: "BROTHER", label: "Brother" },
  { value: "SISTER", label: "Sister" },
  { value: "GRANDFATHER", label: "Grandfather" },
  { value: "GRANDMOTHER", label: "Grandmother" },
  { value: "GRANDSON", label: "Grandson" },
  { value: "GRANDDAUGHTER", label: "Granddaughter" },
  { value: "FATHER_IN_LAW", label: "Father-in-Law" },
  { value: "MOTHER_IN_LAW", label: "Mother-in-Law" },
  { value: "SON_IN_LAW", label: "Son-in-Law" },
  { value: "DAUGHTER_IN_LAW", label: "Daughter-in-Law" },
  { value: "BROTHER_IN_LAW", label: "Brother-in-Law" },
  { value: "SISTER_IN_LAW", label: "Sister-in-Law" },
  { value: "UNCLE", label: "Uncle" },
  { value: "AUNT", label: "Aunt" },
  { value: "NEPHEW", label: "Nephew" },
  { value: "NIECE", label: "Niece" },
  { value: "COUSIN", label: "Cousin" },
  { value: "OTHER", label: "Other" },
];

export const getGenderLabel = (gender: Gender): string => {
  return GENDER_OPTIONS.find((opt) => opt.value === gender)?.label || gender;
};

export const getHabitationTypeLabel = (type: HabitationType): string => {
  return HABITATION_TYPE_OPTIONS.find((opt) => opt.value === type)?.label || type;
};

export const getDeletionReasonLabel = (reason: DeletionReason): string => {
  return DELETION_REASON_OPTIONS.find((opt) => opt.value === reason)?.label || reason;
};

export const getHOFRelationshipLabel = (relationship: HOFRelationship): string => {
  return HOF_RELATIONSHIP_OPTIONS.find((opt) => opt.value === relationship)?.label || relationship;
};
