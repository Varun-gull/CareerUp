import { Navbar } from "@/components/Navbar";
import { CalendarView } from "@/components/CalendarView";
import { getApplications, getCalendarEvents } from "@/lib/data";

export default async function CalendarPage() {
  const [applications, events] = await Promise.all([getApplications(), getCalendarEvents()]);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="mb-6">
          <p className="eyebrow">Schedule</p>
          <h1 className="mt-2 text-4xl font-black text-ink">Calendar</h1>
          <p className="mt-2 text-slate-600">Drag applications onto dates to track deadlines and submissions.</p>
        </div>
        <CalendarView applications={applications} initialEvents={events} />
      </main>
    </>
  );
}
