"use client";

import { useForm } from "react-hook-form";
import { Input, Select, Textarea } from "@/components/ui";
import { useDoctorOptions, usePatientFilters } from "@/hooks/queries";
import { applyServerErrors } from "@/lib/api";
import { EMAIL_PATTERN, GENDERS, PHONE_PATTERN, STATUSES } from "@/lib/constants";
import type { PatientInput } from "@/lib/types";

type Props = {
  formId: string;
  defaultValues?: Partial<PatientInput>;
  /** When set, the patient is created under this doctor and the doctor picker is hidden. */
  fixedDoctorId?: string;
  onSubmit: (data: PatientInput) => Promise<unknown>;
};

export default function PatientForm({ formId, defaultValues, fixedDoctorId, onSubmit }: Props) {
  const { data: doctors, isLoading: doctorsLoading } = useDoctorOptions();
  const { data: filters } = usePatientFilters();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PatientInput>({
    defaultValues: { status: "active", ...defaultValues, ...(fixedDoctorId && { doctor: fixedDoctorId }) },
  });

  const submit = handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      applyServerErrors(error, setError);
    }
  });

  return (
    <form id={formId} noValidate onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
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
        inputMode="numeric"
        min={0}
        max={130}
        required
        error={errors.age?.message}
        {...register("age", {
          required: "Age is required",
          valueAsNumber: true,
          validate: (v) => (Number.isInteger(v) && v >= 0 && v <= 130) || "Enter an age between 0 and 130",
        })}
      />
      <Select
        label="Gender"
        required
        placeholder="Select…"
        options={GENDERS}
        error={errors.gender?.message}
        {...register("gender", { required: "Gender is required" })}
      />
      <Input
        label="Phone"
        type="tel"
        required
        placeholder="+880 1711 000000"
        error={errors.phone?.message}
        {...register("phone", {
          required: "Phone is required",
          pattern: { value: PHONE_PATTERN, message: "Enter a valid phone number" },
        })}
      />
      <Input
        label="Email"
        type="email"
        placeholder="Optional"
        error={errors.email?.message}
        {...register("email", {
          validate: (v) => !v || EMAIL_PATTERN.test(v) || "Enter a valid email",
        })}
      />
      <Input
        label="Condition"
        required
        placeholder="e.g. Hypertension"
        list="known-conditions"
        error={errors.condition?.message}
        {...register("condition", {
          required: "Condition is required",
          minLength: { value: 2, message: "Condition is required" },
        })}
      />
      {/* Suggests existing conditions, which keeps the condition filter clean. */}
      <datalist id="known-conditions">
        {filters?.conditions.map((c) => <option key={c} value={c} />)}
      </datalist>
      <Select
        label="Status"
        required
        options={STATUSES}
        error={errors.status?.message}
        {...register("status", { required: "Status is required" })}
      />
      {!fixedDoctorId && (
        <div className="sm:col-span-2">
          <Select
            label="Assigned doctor"
            required
            disabled={doctorsLoading}
            placeholder={doctorsLoading ? "Loading doctors…" : "Select…"}
            options={(doctors ?? []).map((d) => ({ value: d.id, label: `${d.name} · ${d.specialization}` }))}
            error={errors.doctor?.message}
            {...register("doctor", { required: "Assign a doctor" })}
          />
        </div>
      )}
      <div className="sm:col-span-2">
        <Textarea label="Notes" placeholder="Optional clinical notes" error={errors.notes?.message} {...register("notes", { maxLength: { value: 1000, message: "Max 1000 characters" } })} />
      </div>
    </form>
  );
}
