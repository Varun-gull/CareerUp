import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <section className="card flex flex-col items-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-[#2F4156]">
        <Icon size={28} />
      </div>
      <h2 className="mt-5 text-2xl font-black text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      <Link href={actionHref} className="primary-button mt-6">
        {actionLabel}
      </Link>
    </section>
  );
}
