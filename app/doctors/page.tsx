import type { Metadata } from "next";
import DoctorsList from "@/components/doctors/DoctorsList";

export const metadata: Metadata = { title: "Doctors · Doctor Tracker" };

export default function DoctorsPage() {
  return <DoctorsList />;
}
