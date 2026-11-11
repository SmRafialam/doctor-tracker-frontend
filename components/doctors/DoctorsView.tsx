"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { EnvelopeIcon, PencilSquareIcon, TrashIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import { toast } from "sonner";
import {
  Avatar,
  Badge,
  Button,
  ConfirmModal,
  DataTable,
  DateFilter,
  DebouncedSearch,
  EmptyState,
  ErrorState,
  FilterPanel,
  FilterSelect,
  Pagination,
  type Column,
} from "@/components/ui";
import { useDeleteDoctor, useDoctorFilters, useDoctors } from "@/hooks/queries";
import { useUrlState } from "@/hooks/useUrlState";
import { getErrorMessage } from "@/lib/api";
import { SPECIALIZATIONS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { Doctor } from "@/lib/types";
import DoctorFormModal from "./DoctorFormModal";

const FILTER_KEYS = ["specialization", "hospital", "from", "to"] as const;

function RowActions({ doctor, onEdit, onDelete }: { doctor: Doctor; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="sm" onClick={onEdit} aria-label={`Edit ${doctor.name}`}>
        <PencilSquareIcon className="h-4 w-4" aria-hidden />
      </Button>
      <Button variant="ghost" size="sm" onClick={onDelete} aria-label={`Delete ${doctor.name}`} className="text-red-600 hover:bg-red-50">
        <TrashIcon className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  );
}

export default function DoctorsView() {
  const { params, setParams, clear } = useUrlState();
  const { data, isLoading, isFetching, isError, error, refetch } = useDoctors(params);
  const { data: filterOptions } = useDoctorFilters();
  const deleteDoctor = useDeleteDoctor();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [deleting, setDeleting] = useState<Doctor | null>(null);

  const openForm = useCallback((doctor: Doctor | null) => {
    setEditing(doctor);
    setFormOpen(true);
  }, []);

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await deleteDoctor.mutateAsync(deleting.id);
      toast.success(`${deleting.name} removed`);
      setDeleting(null);
    } catch (e) {
      toast.error(getErrorMessage(e));
      setDeleting(null);
    }
  }

  const activeFilters = FILTER_KEYS.filter((k) => params[k]).length;
  const hasQuery = activeFilters > 0 || Boolean(params.q);

  // Stable column definitions: rebuilt only when the callbacks change.
  const columns = useMemo<Column<Doctor>[]>(
    () => [
      {
        key: "name",
        header: "Doctor",
        sortField: "name",
        cell: (d) => (
          <div className="flex items-center gap-3">
            <Avatar name={d.name} size="sm" />
            <div className="min-w-0">
              <Link href={`/doctors/${d.id}`} className="font-medium text-slate-900 hover:text-blue-700 hover:underline">
                {d.name}
              </Link>
              <p className="truncate text-xs text-slate-500">{d.email}</p>
            </div>
          </div>
        ),
      },
      { key: "spec", header: "Specialization", cell: (d) => <Badge tone="blue">{d.specialization}</Badge> },
      { key: "hospital", header: "Hospital", cell: (d) => <span className="text-slate-700">{d.hospital}</span> },
      { key: "phone", header: "Phone", cell: (d) => <span className="whitespace-nowrap tabular-nums text-slate-600">{d.phone}</span> },
      {
        key: "patients",
        header: "Patients",
        align: "right",
        cell: (d) => <span className="font-medium tabular-nums">{d.patientCount}</span>,
      },
      {
        key: "createdAt",
        header: "Joined",
        sortField: "createdAt",
        cell: (d) => <span className="whitespace-nowrap text-slate-600">{formatDate(d.createdAt)}</span>,
      },
      {
        key: "actions",
        header: "",
        align: "right",
        cell: (d) => <RowActions doctor={d} onEdit={() => openForm(d)} onDelete={() => setDeleting(d)} />,
      },
    ],
    [openForm],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1>Doctors</h1>
          <p className="mt-1 text-sm text-slate-600">Manage your medical staff and view their patients.</p>
        </div>
        <Button onClick={() => openForm(null)}>
          <PlusIcon className="h-5 w-5" aria-hidden />
          Add doctor
        </Button>
      </div>

      <FilterPanel
        activeCount={activeFilters}
        onClear={() => clear(["sort", "limit"])}
        search={
          <DebouncedSearch value={params.q ?? ""} onSearch={(q) => setParams({ q })} label="Search doctors" placeholder="Name, hospital, email…" />
        }
      >
        <FilterSelect
          label="Specialization"
          value={params.specialization}
          onChange={(v) => setParams({ specialization: v })}
          options={SPECIALIZATIONS.map((s) => ({ value: s, label: s }))}
        />
        <FilterSelect
          label="Hospital"
          value={params.hospital}
          onChange={(v) => setParams({ hospital: v })}
          options={(filterOptions?.hospitals ?? []).map((h) => ({ value: h, label: h }))}
        />
        <DateFilter label="Joined from" value={params.from} max={params.to} onChange={(v) => setParams({ from: v })} />
        <DateFilter label="Joined to" value={params.to} min={params.from} onChange={(v) => setParams({ to: v })} />
      </FilterPanel>

      {isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : (
        <DataTable
          caption="Doctors"
          columns={columns}
          rows={data?.data}
          getRowId={(d) => d.id}
          isLoading={isLoading}
          isFetching={isFetching && !isLoading}
          sort={params.sort ?? "-createdAt"}
          onSortChange={(sort) => setParams({ sort })}
          empty={
            <EmptyState
              icon={UserGroupIcon}
              title={hasQuery ? "No doctors match your filters" : "No doctors yet"}
              description={hasQuery ? "Try a different search or clear the filters." : "Add your first doctor to get started."}
              action={
                hasQuery ? (
                  <Button variant="outline" size="sm" onClick={() => clear(["limit"])}>
                    Clear filters
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => openForm(null)}>
                    Add doctor
                  </Button>
                )
              }
            />
          }
          renderMobileCard={(d) => (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Avatar name={d.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <Link href={`/doctors/${d.id}`} className="font-medium text-slate-900 hover:underline">
                    {d.name}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge tone="blue">{d.specialization}</Badge>
                    <span className="text-xs text-slate-500">{d.patientCount} patients</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{d.hospital}</p>
                  <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
                    <EnvelopeIcon className="h-3.5 w-3.5" aria-hidden />
                    {d.email}
                  </p>
                </div>
                <RowActions doctor={d} onEdit={() => openForm(d)} onDelete={() => setDeleting(d)} />
              </div>
            </div>
          )}
        />
      )}

      {data && data.meta.total > 0 && (
        <Pagination
          noun="Doctors"
          meta={data.meta}
          onPageChange={(page) => setParams({ page })}
          onLimitChange={(limit) => setParams({ limit })}
        />
      )}

      <DoctorFormModal open={formOpen} doctor={editing} onClose={() => setFormOpen(false)} />

      <ConfirmModal
        open={deleting !== null}
        title="Delete doctor?"
        message={`${deleting?.name ?? ""} will be permanently removed. Doctors with assigned patients can't be deleted until those patients are reassigned or removed.`}
        confirmLabel={deleteDoctor.isPending ? "Deleting…" : "Delete"}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
