"use client";

import EntityCard from "@/components/EntityCard";
import EntityGrid from "@/components/EntityGrid";
import { Badge } from "@/components/ui";
import { doctors } from "@/lib/mock-data";
import type { Doctor, DoctorInput } from "@/lib/types";
import DoctorForm from "./DoctorForm";

export default function DoctorsList() {
  return (
    <EntityGrid<Doctor, DoctorInput>
      title="Doctors"
      noun="Doctor"
      initialItems={doctors}
      searchFields={(d) => [d.name, d.specialization]}
      toInput={({ name, specialization, email, phone, experience, photoUrl }) => ({
        name,
        specialization,
        email,
        phone,
        experience,
        photoUrl,
      })}
      renderForm={(props) => <DoctorForm {...props} />}
      renderCard={(d, actions) => (
        <EntityCard
          name={d.name}
          subtitle={<Badge tone="blue">{d.specialization}</Badge>}
          photoUrl={d.photoUrl}
          href={`/doctors/${d.id}`}
          {...actions}
        >
          <p>{d.experience} years experience</p>
          <p className="truncate">{d.email}</p>
        </EntityCard>
      )}
    />
  );
}
