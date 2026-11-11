import type { Metadata } from "next";
import PatientsList from "@/components/patients/PatientsList";

export const metadata: Metadata = { title: "Patients · Doctor Tracker" };

export default function PatientsPage() {
  return <PatientsList />;
}
