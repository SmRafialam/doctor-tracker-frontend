import type { ComponentType, ReactNode, SVGProps } from "react";
import { Card, CardBody } from "@/components/ui";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  value: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconClass: string;
  footnote?: ReactNode;
};

export default function StatTile({ label, value, icon: Icon, iconClass, footnote }: Props) {
  return (
    <Card>
      <CardBody className="flex items-start gap-4">
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg", iconClass)}>
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-slate-600">{label}</p>
          <p className="mt-0.5 text-2xl font-bold text-slate-900">{value}</p>
          {footnote && <div className="mt-1 text-xs text-slate-500">{footnote}</div>}
        </div>
      </CardBody>
    </Card>
  );
}
