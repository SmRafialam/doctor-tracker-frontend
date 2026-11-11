"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { PencilSquareIcon, TrashIcon, UsersIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import { toast } from "sonner";
import {
  Avatar,
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
  StatusBadge,
  type Column,
} from "@/components/ui";
import { useDeletePatient, useDoctorOptions, usePatientFilters, usePatients } from "@/hooks/queries";
import { useUrlState } from "@/hooks/useUrlState";
import { getErrorMessage } from "@/lib/api";
import { GENDERS, STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { Patient } from "@/lib/types";
import PatientFormModal from "./PatientFormModal";

type Props = {
  /** Scope the list to one doctor (doctor detail page): hides the doctor column/filter. */
  doctorId?: string;
  /** Prefix for URL keys so this list doesn't clash with other URL state on the page. */
  urlPrefix?: string;
};

const BASE_FILTERS = ["condition", "status", "gender", "from", "to"] as const;

function RowActions({ patient, onEdit, onDelete }: { patient: Patient; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="sm" onClick={onEdit} aria-label={`Edit ${patient.name}`}>
        <PencilSquareIcon className="h-4 w-4" aria-hidden />
      </Button>
      <Button variant="ghost" size="sm" onClick={onDelete} aria-label={`Delete ${patient.name}`} className="text-red-600 hover:bg-red-50">
        <TrashIcon className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  );
}

/**
 * The full patient list experience (search, filters, sorting, pagination,
 * add/edit/delete). Used on the Patients page and, scoped to one doctor, on the
 * doctor detail page.
 */
export default function PatientsManager({ doctorId, urlPrefix = "" }: Props) {
  const scoped = Boolean(doctorId);
  const { params, setParams, clear } = useUrlState(urlPrefix);
  const { data, isLoading, isFetching, isError, error, refetch } = usePatients(params, doctorId);
  const { data: filterOptions } = usePatientFilters();
  const { data: doctors } = useDoctorOptions();
  const deletePatient = useDeletePatient();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [deleting, setDeleting] = useState<Patient | null>(null);

  const openForm = useCallback((patient: Patient | null) => {
    setEditing(patient);
    setFormOpen(true);
  }, []);

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await deletePatient.mutateAsync(deleting.id);
      toast.success(`${deleting.name} removed`);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
    setDeleting(null);
  }

  const filterKeys = scoped ? BASE_FILTERS : [...BASE_FILTERS, "doctor"];
  const activeFilters = filterKeys.filter((k) => params[k]).length;
  const hasQuery = activeFilters > 0 || Boolean(params.q);

  const columns = useMemo<Column<Patient>[]>(() => {
    const cols: Column<Patient>[] = [
      {
        key: "name",
        header: "Patient",
        sortField: "name",
        cell: (p) => (
          <div className="flex items-center gap-3">
            <Avatar name={p.name} size="sm" />
            <div className="min-w-0">
              <p className="font-medium text-slate-900">{p.name}</p>
              <p className="truncate text-xs text-slate-500">{p.phone}</p>
            </div>
          </div>
        ),
      },
      {
        key: "age",
        header: "Age",
        sortField: "age",
        cell: (p) => (
          <span className="tabular-nums text-slate-700">
            {p.age} <span className="text-xs capitalize text-slate-500">· {p.gender}</span>
          </span>
        ),
      },
      { key: "condition", header: "Condition", cell: (p) => <span className="text-slate-700">{p.condition}</span> },
      { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    ];
    if (!scoped) {
      cols.push({
        key: "doctor",
        header: "Doctor",
        cell: (p) =>
          p.doctor ? (
            <Link href={`/doctors/${p.doctor.id}`} className="text-slate-700 hover:text-blue-700 hover:underline">
              {p.doctor.name}
            </Link>
          ) : (
            <span className="text-slate-400">Unassigned</span>
          ),
      });
    }
    cols.push(
      {
        key: "createdAt",
        header: "Registered",
        sortField: "createdAt",
        cell: (p) => <span className="whitespace-nowrap text-slate-600">{formatDate(p.createdAt)}</span>,
      },
      {
        key: "actions",
        header: "",
        align: "right",
        cell: (p) => <RowActions patient={p} onEdit={() => openForm(p)} onDelete={() => setDeleting(p)} />,
      },
    );
    return cols;
  }, [scoped, openForm]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          {data ? (
            <>
              <span className="font-semibold text-slate-900">{data.meta.total}</span> {hasQuery ? "matching " : ""}
              patient{data.meta.total === 1 ? "" : "s"}
            </>
          ) : (
            " "
          )}
        </p>
        <Button onClick={() => openForm(null)}>
          <PlusIcon className="h-5 w-5" aria-hidden />
          Add patient
        </Button>
      </div>

      <FilterPanel
        activeCount={activeFilters}
        onClear={() => clear(["sort", "limit"])}
        search={
          <DebouncedSearch value={params.q ?? ""} onSearch={(q) => setParams({ q })} label="Search patients" placeholder="Name, condition, phone…" />
        }
      >
        <FilterSelect
          label="Condition"
          value={params.condition}
          onChange={(v) => setParams({ condition: v })}
          options={(filterOptions?.conditions ?? []).map((c) => ({ value: c, label: c }))}
        />
        <FilterSelect label="Status" value={params.status} onChange={(v) => setParams({ status: v })} options={STATUSES} />
        <FilterSelect label="Gender" value={params.gender} onChange={(v) => setParams({ gender: v })} options={GENDERS} />
        {!scoped && (
          <FilterSelect
            label="Doctor"
            value={params.doctor}
            onChange={(v) => setParams({ doctor: v })}
            options={(doctors ?? []).map((d) => ({ value: d.id, label: d.name }))}
          />
        )}
        <DateFilter label="Registered from" value={params.from} max={params.to} onChange={(v) => setParams({ from: v })} />
        <DateFilter label="Registered to" value={params.to} min={params.from} onChange={(v) => setParams({ to: v })} />
      </FilterPanel>

      {isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : (
        <DataTable
          caption="Patients"
          columns={columns}
          rows={data?.data}
          getRowId={(p) => p.id}
          isLoading={isLoading}
          isFetching={isFetching && !isLoading}
          sort={params.sort ?? "-createdAt"}
          onSortChange={(sort) => setParams({ sort })}
          empty={
            <EmptyState
              icon={UsersIcon}
              title={hasQuery ? "No patients match your filters" : "No patients yet"}
              description={hasQuery ? "Try a different search or clear the filters." : "Add a patient to start tracking their care."}
              action={
                hasQuery ? (
                  <Button variant="outline" size="sm" onClick={() => clear(["limit"])}>
                    Clear filters
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => openForm(null)}>
                    Add patient
                  </Button>
                )
              }
            />
          }
          renderMobileCard={(p) => (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Avatar name={p.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{p.name}</p>
                  <p className="text-xs capitalize text-slate-500">
                    {p.age} yrs · {p.gender}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusBadge status={p.status} />
                    <span className="text-sm text-slate-700">{p.condition}</span>
                  </div>
                  {!scoped && p.doctor && (
                    <Link href={`/doctors/${p.doctor.id}`} className="mt-2 block text-xs text-blue-700 hover:underline">
                      {p.doctor.name}
                    </Link>
                  )}
                </div>
                <RowActions patient={p} onEdit={() => openForm(p)} onDelete={() => setDeleting(p)} />
              </div>
            </div>
          )}
        />
      )}

      {data && data.meta.total > 0 && (
        <Pagination
          noun="Patients"
          meta={data.meta}
          onPageChange={(page) => setParams({ page })}
          onLimitChange={(limit) => setParams({ limit })}
        />
      )}

      <PatientFormModal open={formOpen} patient={editing} fixedDoctorId={editing ? undefined : doctorId} onClose={() => setFormOpen(false)} />

      <ConfirmModal
        open={deleting !== null}
        title={scoped ? "Remove patient?" : "Delete patient?"}
        message={`${deleting?.name ?? ""} will be permanently deleted. This cannot be undone.`}
        confirmLabel={deletePatient.isPending ? "Deleting…" : "Delete"}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
