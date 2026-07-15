import type { LucideIcon } from "lucide-react";

export function DashboardCard({
  title,
  value,
  helper,
  icon: Icon
}: {
  title: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}) {
  return (
    <section className="group card p-5 transition hover:-translate-y-1 hover:shadow-strong">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="section-label">{title}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
          <Icon size={23} />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{helper}</p>
    </section>
  );
}
