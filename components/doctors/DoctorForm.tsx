"use client";

import { useForm } from "react-hook-form";
import { Input, Select } from "@/components/ui";
import { applyServerErrors } from "@/lib/api";
import { EMAIL_PATTERN, PHONE_PATTERN, SPECIALIZATIONS } from "@/lib/constants";
import type { DoctorInput } from "@/lib/types";

type Props = {
  formId: string;
  defaultValues?: Partial<DoctorInput>;
  /** Rejects with the API error; field errors are then shown inline. */
  onSubmit: (data: DoctorInput) => Promise<unknown>;
};

export default function DoctorForm({ formId, defaultValues, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DoctorInput>({ defaultValues });

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
          placeholder="Dr. Jane Doe"
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 3, message: "Name must be at least 3 characters" },
          })}
        />
      </div>
      <Select
        label="Specialization"
        required
        placeholder="Select…"
        options={SPECIALIZATIONS.map((s) => ({ value: s, label: s }))}
        error={errors.specialization?.message}
        {...register("specialization", { required: "Specialization is required" })}
      />
      <Input
        label="Hospital"
        required
        placeholder="City General Hospital"
        error={errors.hospital?.message}
        {...register("hospital", {
          required: "Hospital is required",
          minLength: { value: 2, message: "Hospital is required" },
        })}
      />
      <Input
        label="Email"
        type="email"
        required
        placeholder="jane@example.com"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
          pattern: { value: EMAIL_PATTERN, message: "Enter a valid email" },
        })}
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
    </form>
  );
}
