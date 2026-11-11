"use client";

import { toast } from "sonner";
import { Button, Modal } from "@/components/ui";
import { useSavePatient } from "@/hooks/queries";
import { getErrorMessage } from "@/lib/api";
import type { Patient, PatientInput } from "@/lib/types";
import PatientForm from "./PatientForm";

const FORM_ID = "patient-form";

type Props = {
  open: boolean;
  /** null = create */
  patient: Patient | null;
  /** Create the patient under this doctor (doctor detail page). */
  fixedDoctorId?: string;
  onClose: () => void;
};

export default function PatientFormModal({ open, patient, fixedDoctorId, onClose }: Props) {
  const save = useSavePatient();

  async function handleSubmit(input: PatientInput) {
    try {
      await save.mutateAsync({ id: patient?.id, input });
      toast.success(patient ? "Patient updated" : "Patient added");
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={patient ? "Edit patient" : "Add patient"}
      actions={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={save.isPending}>
            {save.isPending ? "Saving…" : patient ? "Save changes" : "Add patient"}
          </Button>
        </>
      }
    >
      {open && (
        <PatientForm
          key={patient?.id ?? "new"}
          formId={FORM_ID}
          fixedDoctorId={fixedDoctorId}
          defaultValues={
            patient
              ? {
                  name: patient.name,
                  age: patient.age,
                  gender: patient.gender,
                  phone: patient.phone,
                  email: patient.email ?? "",
                  condition: patient.condition,
                  status: patient.status,
                  notes: patient.notes ?? "",
                  doctor: patient.doctor?.id,
                }
              : undefined
          }
          onSubmit={handleSubmit}
        />
      )}
    </Modal>
  );
}
