"use client";

import { toast } from "sonner";
import { Button, Modal } from "@/components/ui";
import { useSaveDoctor } from "@/hooks/queries";
import { getErrorMessage } from "@/lib/api";
import type { Doctor, DoctorInput } from "@/lib/types";
import DoctorForm from "./DoctorForm";

const FORM_ID = "doctor-form";

type Props = {
  open: boolean;
  /** null = create a new doctor */
  doctor: Doctor | null;
  onClose: () => void;
};

export default function DoctorFormModal({ open, doctor, onClose }: Props) {
  const save = useSaveDoctor();

  async function handleSubmit(input: DoctorInput) {
    try {
      await save.mutateAsync({ id: doctor?.id, input });
      toast.success(doctor ? "Doctor updated" : "Doctor added");
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error; // let the form map field errors
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={doctor ? "Edit doctor" : "Add doctor"}
      actions={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={save.isPending}>
            {save.isPending ? "Saving…" : doctor ? "Save changes" : "Add doctor"}
          </Button>
        </>
      }
    >
      {/* Re-keyed per doctor so the form resets between uses. */}
      {open && (
        <DoctorForm
          key={doctor?.id ?? "new"}
          formId={FORM_ID}
          defaultValues={
            doctor
              ? {
                  name: doctor.name,
                  specialization: doctor.specialization,
                  hospital: doctor.hospital,
                  phone: doctor.phone,
                  email: doctor.email,
                }
              : undefined
          }
          onSubmit={handleSubmit}
        />
      )}
    </Modal>
  );
}
