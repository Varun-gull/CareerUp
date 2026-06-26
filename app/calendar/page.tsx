import { Navbar } from "@/components/Navbar";
import { CalendarView } from "@/components/CalendarView";
import { getApplications, getCalendarEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const [applications, dbEvents] = await Promise.all([getApplications(), getCalendarEvents()]);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="page-hero mb-6">
          <p className="eyebrow">Schedule</p>
          <h1 className="mt-2 text-4xl font-black text-ink sm:text-5xl">Calendar</h1>
          <p className="mt-2 text-slate-400">Drag applications onto dates to track deadlines and submissions.</p>
        </div>
        <CalendarView applications={applications} dbEvents={dbEvents} />
      </main>
    </>
  );
}
