export type PageMeta = { page: number; limit: number; total: number; totalPages: number };
export type Paginated<T> = { data: T[]; meta: PageMeta };

export type User = { id: string; name: string; email: string; role: "admin" };

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientCount: number;
  createdAt: string;
  updatedAt: string;
};
export type DoctorInput = Pick<Doctor, "name" | "specialization" | "hospital" | "phone" | "email">;
export type DoctorOption = { id: string; name: string; specialization: string };

export type Gender = "male" | "female" | "other";
export type PatientStatus = "active" | "critical" | "recovered";

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email?: string;
  condition: string;
  status: PatientStatus;
  notes?: string;
  doctor: DoctorOption | null;
  createdAt: string;
  updatedAt: string;
};
export type PatientInput = {
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email?: string;
  condition: string;
  status: PatientStatus;
  notes?: string;
  doctor: string;
};

export type Bucket = { name: string; value: number };

export type DashboardStats = {
  totals: {
    doctors: number;
    patients: number;
    patientsThisMonth: number;
    patientsLastMonth: number;
    doctorsThisMonth: number;
    criticalPatients: number;
    avgPatientsPerDoctor: number;
    doctorsWithoutPatients: number;
  };
  patientsPerDoctor: { id: string; name: string; specialization: string; count: number }[];
  trend: { month: string; patients: number; doctors: number }[];
  byStatus: Bucket[];
  byCondition: Bucket[];
  bySpecialization: Bucket[];
};

/** Query-string params for list endpoints; empty values are dropped before sending. */
export type ListParams = Record<string, string | undefined>;
