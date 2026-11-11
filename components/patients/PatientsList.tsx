"use client";

import EntityCard from "@/components/EntityCard";
import EntityGrid from "@/components/EntityGrid";
import { Badge } from "@/components/ui";
import { getDoctor, patients } from "@/lib/mock-data";
import type { Patient, PatientInput } from "@/lib/types";
import PatientForm from "./PatientForm";

export default function PatientsList() {
  return (
    <EntityGrid<Patient, PatientInput>
      title="Patients"
      noun="Patient"
      initialItems={patients}
      searchFields={(p) => [p.name, p.condition]}
      toInput={({ name, age, condition, doctorId, phone, photoUrl }) => ({
        name,
        age,
        condition,
        doctorId,
        phone,
        photoUrl,
      })}
      renderForm={(props) => <PatientForm {...props} />}
      renderCard={(p, actions) => (
        <EntityCard
          name={p.name}
          subtitle={<Badge tone="green">{p.condition}</Badge>}
          photoUrl={p.photoUrl}
          {...actions}
        >
          <p>Age {p.age}</p>
          <p>Doctor: {getDoctor(p.doctorId)?.name ?? "Unassigned"}</p>
        </EntityCard>
      )}
    />
  );
}
