import Link from "next/link";
import type { ReactNode } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader } from "@/components/ui";

type Props = {
  name: string;
  subtitle: ReactNode;
  photoUrl?: string;
  href?: string;
  children?: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
};

export default function EntityCard({ name, subtitle, photoUrl, href, children, onEdit, onDelete }: Props) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="justify-start">
        <Avatar name={name} src={photoUrl} />
        <div className="min-w-0">
          <h3 className="truncate text-base">
            {href ? (
              <Link
                href={href}
                className="rounded hover:text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {name}
              </Link>
            ) : (
              name
            )}
          </h3>
          <div className="mt-1">{subtitle}</div>
        </div>
      </CardHeader>
      {children && <CardBody className="space-y-1 text-sm text-slate-600">{children}</CardBody>}
      <CardFooter>
        <Button variant="ghost" size="sm" onClick={onEdit} aria-label={`Edit ${name}`}>
          <PencilSquareIcon className="h-4 w-4" aria-hidden />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          aria-label={`Delete ${name}`}
          className="text-red-600 hover:bg-red-50"
        >
          <TrashIcon className="h-4 w-4" aria-hidden />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
