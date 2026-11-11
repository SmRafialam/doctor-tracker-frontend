"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { AxiosError } from "axios";
import { Avatar, Badge, Button, Card, CardBody, ErrorState, Skeleton } from "@/components/ui";
import PatientsManager from "@/components/patients/PatientsManager";
import { useDoctor } from "@/hooks/queries";
import { getErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import DoctorFormModal from "./DoctorFormModal";

function BackLink() {
  return (
    <Link
      href="/doctors"
      className="inline-flex items-center gap-1 rounded text-sm font-medium text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <ArrowLeftIcon className="h-4 w-4" aria-hidden />
      Back to doctors
    </Link>
  );
}

export default function DoctorDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: doctor, isLoading, isError, error, refetch } = useDoctor(id);
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BackLink />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !doctor) {
    const notFound = error instanceof AxiosError && (error.response?.status === 404 || error.response?.status === 400);
    return (
      <div className="space-y-6">
        <BackLink />
        <ErrorState
          message={notFound ? "This doctor doesn't exist or was removed." : getErrorMessage(error)}
          onRetry={notFound ? undefined : () => refetch()}
        />
      </div>
    );
  }

  const contact = [
    { icon: EnvelopeIcon, label: "Email", value: <a href={`mailto:${doctor.email}`} className="text-blue-700 hover:underline">{doctor.email}</a> },
    { icon: PhoneIcon, label: "Phone", value: <a href={`tel:${doctor.phone.replace(/\s/g, "")}`} className="hover:underline">{doctor.phone}</a> },
    { icon: BuildingOffice2Icon, label: "Hospital", value: doctor.hospital },
    { icon: CalendarDaysIcon, label: "Joined", value: formatDate(doctor.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <BackLink />

      <Card>
        <CardBody className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={doctor.name} size="lg" />
            <div className="space-y-2">
              <h1>{doctor.name}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="blue">{doctor.specialization}</Badge>
                <span className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{doctor.patientCount}</span> patient
                  {doctor.patientCount === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => setEditOpen(true)} className="self-start lg:self-center">
            <PencilSquareIcon className="h-4 w-4" aria-hidden />
            Edit profile
          </Button>
        </CardBody>
        <dl className="grid gap-4 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
          {contact.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex min-w-0 items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden />
              <div className="min-w-0">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
                <dd className="truncate text-sm text-slate-800">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </Card>

      <section aria-labelledby="patients-heading" className="space-y-4">
        <h2 id="patients-heading">Patients</h2>
        <PatientsManager doctorId={doctor.id} />
      </section>

      <DoctorFormModal open={editOpen} doctor={doctor} onClose={() => setEditOpen(false)} />
    </div>
  );
}
