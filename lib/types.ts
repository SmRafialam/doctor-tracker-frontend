export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  experience: number;
  photoUrl?: string;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  condition: string;
  doctorId: string;
  phone: string;
  photoUrl?: string;
};

export type DoctorInput = Omit<Doctor, "id">;
export type PatientInput = Omit<Patient, "id">;
