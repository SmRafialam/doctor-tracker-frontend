import type { Doctor, Patient } from "./types";

export const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "General Practice",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
];

export const doctors: Doctor[] = [
  { id: "1", name: "Dr. Sarah Ahmed", specialization: "Cardiology", email: "sarah.ahmed@example.com", phone: "+1 555 0101", experience: 12 },
  { id: "2", name: "Dr. James Carter", specialization: "Neurology", email: "james.carter@example.com", phone: "+1 555 0102", experience: 8 },
  { id: "3", name: "Dr. Priya Nair", specialization: "Pediatrics", email: "priya.nair@example.com", phone: "+1 555 0103", experience: 15 },
  { id: "4", name: "Dr. Omar Hassan", specialization: "Orthopedics", email: "omar.hassan@example.com", phone: "+1 555 0104", experience: 6 },
  { id: "5", name: "Dr. Emily Chen", specialization: "Dermatology", email: "emily.chen@example.com", phone: "+1 555 0105", experience: 10 },
  { id: "6", name: "Dr. Daniel Brooks", specialization: "General Practice", email: "daniel.brooks@example.com", phone: "+1 555 0106", experience: 20 },
];

export const patients: Patient[] = [
  { id: "1", name: "Ayesha Rahman", age: 54, condition: "Hypertension", doctorId: "1", phone: "+1 555 0201" },
  { id: "2", name: "Michael Lee", age: 37, condition: "Migraine", doctorId: "2", phone: "+1 555 0202" },
  { id: "3", name: "Sofia Garcia", age: 8, condition: "Asthma", doctorId: "3", phone: "+1 555 0203" },
  { id: "4", name: "Tom Wilson", age: 45, condition: "Knee injury", doctorId: "4", phone: "+1 555 0204" },
  { id: "5", name: "Nadia Karim", age: 29, condition: "Eczema", doctorId: "5", phone: "+1 555 0205" },
  { id: "6", name: "Robert King", age: 66, condition: "Arrhythmia", doctorId: "1", phone: "+1 555 0206" },
  { id: "7", name: "Lina Park", age: 12, condition: "Allergies", doctorId: "3", phone: "+1 555 0207" },
  { id: "8", name: "Hasan Ali", age: 41, condition: "Annual check-up", doctorId: "6", phone: "+1 555 0208" },
];

export const getDoctor = (id: string) => doctors.find((d) => d.id === id);
