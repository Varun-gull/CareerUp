export default function Loading() {
  return (
    <>
      {/* Animated progress bar */}
      <div className="fixed inset-x-0 top-0 z-50 h-1 overflow-hidden">
        <div className="h-full w-full animate-[loading_1.2s_ease-in-out_infinite] bg-gradient-to-r from-sky via-brand to-sky bg-[length:200%_100%]" />
        <style>{`
          @keyframes loading {
            0%   { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>

      {/* Skeleton navbar */}
      <div className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
          <div className="flex gap-3">
            <div className="h-8 w-20 animate-pulse rounded-full bg-slate-200" />
            <div className="h-8 w-20 animate-pulse rounded-full bg-slate-200" />
            <div className="h-8 w-20 animate-pulse rounded-full bg-slate-200" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>

      {/* Skeleton page body */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}
        <div className="h-4 w-20 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-3 h-9 w-64 animate-pulse rounded-2xl bg-slate-200" />
        <div className="mt-3 h-4 w-96 animate-pulse rounded-full bg-slate-200" />

        {/* Card grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white/80 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-200" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
                <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-100" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-8 w-24 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-8 w-20 animate-pulse rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
