"use client";

import { useForm } from "react-hook-form";
import { Input, Select } from "@/components/ui";
import { SPECIALIZATIONS } from "@/lib/mock-data";
import type { DoctorInput } from "@/lib/types";

const PHONE = /^\+?[\d\s()-]{7,20}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  formId: string;
  defaultValues?: Partial<DoctorInput>;
  onSubmit: (data: DoctorInput) => void;
};

export default function DoctorForm({ formId, defaultValues, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorInput>({ defaultValues });

  return (
    <form id={formId} noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
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
        label="Years of experience"
        type="number"
        min={0}
        required
        error={errors.experience?.message}
        {...register("experience", {
          required: "Experience is required",
          valueAsNumber: true,
          min: { value: 0, message: "Cannot be negative" },
          max: { value: 70, message: "Must be 70 or less" },
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
          pattern: { value: EMAIL, message: "Enter a valid email" },
        })}
      />
      <Input
        label="Phone"
        type="tel"
        required
        placeholder="+1 555 0100"
        error={errors.phone?.message}
        {...register("phone", {
          required: "Phone is required",
          pattern: { value: PHONE, message: "Enter a valid phone number" },
        })}
      />
    </form>
  );
}
