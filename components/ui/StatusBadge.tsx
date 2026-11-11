import { CheckCircleIcon, ExclamationCircleIcon, HeartIcon } from "@heroicons/react/20/solid";
import { STATUS_LABEL } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { PatientStatus } from "@/lib/types";

// Status is never shown by color alone: every badge has an icon and a label.
const styles: Record<PatientStatus, { cls: string; Icon: typeof HeartIcon }> = {
  active: { cls: "bg-blue-50 text-blue-700 ring-blue-600/15", Icon: HeartIcon },
  critical: { cls: "bg-red-50 text-red-700 ring-red-600/20", Icon: ExclamationCircleIcon },
  recovered: { cls: "bg-green-50 text-green-800 ring-green-600/20", Icon: CheckCircleIcon },
};

export default function StatusBadge({ status }: { status: PatientStatus }) {
  const { cls, Icon } = styles[status];
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", cls)}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}
