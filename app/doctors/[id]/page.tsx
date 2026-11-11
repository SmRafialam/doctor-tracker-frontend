import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { Avatar, Badge, Card, CardBody, CardHeader } from "@/components/ui";
import { doctors, getDoctor, patients } from "@/lib/mock-data";

export function generateStaticParams() {
  return doctors.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: PageProps<"/doctors/[id]">) {
  const { id } = await params;
  return { title: `${getDoctor(id)?.name ?? "Doctor"} · Doctor Tracker` };
}

export default async function DoctorDetailsPage({ params }: PageProps<"/doctors/[id]">) {
  const { id } = await params;
  const doctor = getDoctor(id);
  if (!doctor) notFound();

  const assigned = patients.filter((p) => p.doctorId === doctor.id);

  return (
    <div className="space-y-6">
      <Link
        href="/doctors"
        className="inline-flex items-center gap-1 rounded text-sm font-medium text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden />
        Back to doctors
      </Link>

      <Card>
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar name={doctor.name} src={doctor.photoUrl} size="lg" />
          <div className="space-y-2">
            <h1>{doctor.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="blue">{doctor.specialization}</Badge>
              <span className="text-sm text-slate-600">{doctor.experience} years experience</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <h2 className="text-base">Contact</h2>
          </CardHeader>
          <CardBody>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <dt>
                  <EnvelopeIcon className="h-5 w-5 text-slate-400" aria-label="Email" />
                </dt>
                <dd>
                  <a href={`mailto:${doctor.email}`} className="text-blue-700 hover:underline">
                    {doctor.email}
                  </a>
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <dt>
                  <PhoneIcon className="h-5 w-5 text-slate-400" aria-label="Phone" />
                </dt>
                <dd>{doctor.phone}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-base">Patients ({assigned.length})</h2>
          </CardHeader>
          <CardBody className="p-0">
            {assigned.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {assigned.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-4 px-5 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{p.name}</p>
                      <p className="text-sm text-slate-500">Age {p.age}</p>
                    </div>
                    <Badge tone="green">{p.condition}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-6 text-sm text-slate-500">No patients assigned.</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
