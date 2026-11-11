import { cn } from "@/lib/cn";

const sizes = { sm: "h-9 w-9 text-xs", md: "h-12 w-12 text-base", lg: "h-20 w-20 text-2xl" };

function initials(name: string) {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/** Shows the photo when one is provided, otherwise the person's initials. */
export default function Avatar({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string;
  size?: keyof typeof sizes;
}) {
  const base = cn("shrink-0 rounded-full", sizes[size]);

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary user photo URLs
    return <img src={src} alt={`Photo of ${name}`} className={cn(base, "object-cover")} />;
  }

  return (
    <span
      role="img"
      aria-label={`Photo of ${name}`}
      className={cn(base, "flex items-center justify-center bg-blue-100 font-semibold text-blue-700")}
    >
      {initials(name)}
    </span>
  );
}
