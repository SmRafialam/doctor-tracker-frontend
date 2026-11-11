"use client";

import { useForm } from "react-hook-form";
import { Input, Select } from "@/components/ui";
import { doctors } from "@/lib/mock-data";
import type { PatientInput } from "@/lib/types";

const PHONE = /^\+?[\d\s()-]{7,20}$/;

type Props = {
  formId: string;
  defaultValues?: Partial<PatientInput>;
  onSubmit: (data: PatientInput) => void;
};

export default function PatientForm({ formId, defaultValues, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientInput>({ defaultValues });

  return (
    <form id={formId} noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Input
          label="Full name"
          required
          placeholder="John Smith"
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" },
          })}
        />
      </div>
      <Input
        label="Age"
        type="number"
        min={0}
        required
        error={errors.age?.message}
        {...register("age", {
          required: "Age is required",
          valueAsNumber: true,
          min: { value: 0, message: "Cannot be negative" },
          max: { value: 130, message: "Enter a realistic age" },
        })}
      />
      <Input
        label="Phone"
        type="tel"
        required
        placeholder="+1 555 0200"
        error={errors.phone?.message}
        {...register("phone", {
          required: "Phone is required",
          pattern: { value: PHONE, message: "Enter a valid phone number" },
        })}
      />
      <Input
        label="Condition"
        required
        placeholder="e.g. Hypertension"
        error={errors.condition?.message}
        {...register("condition", { required: "Condition is required" })}
      />
      <Select
        label="Assigned doctor"
        required
        placeholder="Select…"
        options={doctors.map((d) => ({ value: d.id, label: d.name }))}
        error={errors.doctorId?.message}
        {...register("doctorId", { required: "Assign a doctor" })}
      />
    </form>
  );
}
