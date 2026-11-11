"use client";

import { keepPreviousData, queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, cleanParams } from "@/lib/api";
import type {
  DashboardStats,
  Doctor,
  DoctorInput,
  DoctorOption,
  ListParams,
  Paginated,
  Patient,
  PatientInput,
  User,
} from "@/lib/types";

/**
 * Query-key factory: every cache entry is addressed through here, so
 * invalidation after a mutation is precise and typo-free.
 */
export const keys = {
  me: ["me"] as const,
  dashboard: (months: number) => ["dashboard", months] as const,
  doctors: (params: ListParams) => ["doctors", "list", params] as const,
  doctor: (id: string) => ["doctors", "detail", id] as const,
  doctorOptions: ["doctors", "options"] as const,
  doctorFilters: ["doctors", "filters"] as const,
  patients: (params: ListParams) => ["patients", "list", params] as const,
  patientFilters: ["patients", "filters"] as const,
};

// ── Auth ────────────────────────────────────────────────────────────────────
export function useMe() {
  return useQuery({
    queryKey: keys.me,
    queryFn: async () => (await api.get<{ user: User }>("/auth/me")).data.user,
    staleTime: 5 * 60_000,
  });
}

// ── Query definitions ───────────────────────────────────────────────────────
// Shared by the hooks below AND by prefetching (after login, on nav hover),
// so a prefetch fills exactly the cache entry the page will read.
export const dashboardQuery = (months: number) =>
  queryOptions({
    queryKey: keys.dashboard(months),
    queryFn: async () => (await api.get<DashboardStats>("/dashboard/stats", { params: { months } })).data,
  });

export const doctorsQuery = (params: ListParams) =>
  queryOptions({
    queryKey: keys.doctors(params),
    queryFn: async ({ signal }) =>
      (await api.get<Paginated<Doctor>>("/doctors", { params: cleanParams(params), signal })).data,
  });

export const patientsQuery = (params: ListParams, doctorId?: string) =>
  queryOptions({
    queryKey: keys.patients(doctorId ? { ...params, doctor: doctorId } : params),
    queryFn: async ({ signal }) =>
      (
        await api.get<Paginated<Patient>>(doctorId ? `/doctors/${doctorId}/patients` : "/patients", {
          params: cleanParams(params),
          signal,
        })
      ).data,
  });

// ── Dashboard ───────────────────────────────────────────────────────────────
export function useDashboard(months: number) {
  return useQuery({ ...dashboardQuery(months), placeholderData: keepPreviousData });
}

// ── Doctors ─────────────────────────────────────────────────────────────────
export function useDoctors(params: ListParams) {
  // keepPreviousData: keep showing the current page while the next one loads (no layout jump).
  return useQuery({ ...doctorsQuery(params), placeholderData: keepPreviousData });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: keys.doctor(id),
    queryFn: async () => (await api.get<{ data: Doctor }>(`/doctors/${id}`)).data.data,
  });
}

export function useDoctorOptions() {
  return useQuery({
    queryKey: keys.doctorOptions,
    queryFn: async () => (await api.get<{ data: DoctorOption[] }>("/doctors/options")).data.data,
    staleTime: 5 * 60_000,
  });
}

export function useDoctorFilters() {
  return useQuery({
    queryKey: keys.doctorFilters,
    queryFn: async () =>
      (await api.get<{ specializations: string[]; hospitals: string[] }>("/doctors/filters")).data,
    staleTime: 5 * 60_000,
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return (...prefixes: string[]) =>
    Promise.all(prefixes.map((p) => qc.invalidateQueries({ queryKey: [p] })));
}

export function useSaveDoctor() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: DoctorInput }) =>
      id
        ? (await api.patch<{ data: Doctor }>(`/doctors/${id}`, input)).data.data
        : (await api.post<{ data: Doctor }>("/doctors", input)).data.data,
    // Patients embed the doctor's name, so they are refreshed too.
    onSuccess: () => invalidate("doctors", "patients", "dashboard"),
  });
}

export function useDeleteDoctor() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/doctors/${id}`),
    onSuccess: () => invalidate("doctors", "dashboard"),
  });
}

// ── Patients ────────────────────────────────────────────────────────────────
/** Lists patients; pass `doctorId` to use the doctor-scoped endpoint. */
export function usePatients(params: ListParams, doctorId?: string) {
  return useQuery({ ...patientsQuery(params, doctorId), placeholderData: keepPreviousData });
}

export function usePatientFilters() {
  return useQuery({
    queryKey: keys.patientFilters,
    queryFn: async () => (await api.get<{ conditions: string[] }>("/patients/filters")).data,
    staleTime: 60_000,
  });
}

export function useSavePatient() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: PatientInput }) =>
      id
        ? (await api.patch<{ data: Patient }>(`/patients/${id}`, input)).data.data
        : (await api.post<{ data: Patient }>("/patients", input)).data.data,
    // Doctors carry a patient count, so they're refreshed as well.
    onSuccess: () => invalidate("patients", "doctors", "dashboard"),
  });
}

export function useDeletePatient() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/patients/${id}`),
    onSuccess: () => invalidate("patients", "doctors", "dashboard"),
  });
}
