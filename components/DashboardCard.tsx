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
    <section className="card p-5 transition hover:-translate-y-0.5 hover:shadow-glow">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-ink">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-800 ring-1 ring-purple-100">
          <Icon size={23} />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{helper}</p>
    </section>
  );
}
