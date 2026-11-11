import type { Gender, PatientStatus } from "./types";

export const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "General Practice",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
] as const;

export const GENDERS: { value: Gender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
];

export const STATUSES: { value: PatientStatus; label: string }[] = [
  { value: "active", label: "Under treatment" },
  { value: "critical", label: "Critical" },
  { value: "recovered", label: "Recovered" },
];

export const STATUS_LABEL: Record<PatientStatus, string> = Object.fromEntries(
  STATUSES.map((s) => [s.value, s.label]),
) as Record<PatientStatus, string>;

export const PAGE_SIZES = [10, 20, 50];

export const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
