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
    <section className="card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-black text-ink">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C8D9E6]/40 text-[#2F4156]">
          <Icon size={23} />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600">{helper}</p>
    </section>
  );
}
