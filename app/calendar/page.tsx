import { Navbar } from "@/components/Navbar";
import { CalendarView } from "@/components/CalendarView";
import { getApplications, getCalendarEvents } from "@/lib/data";
import type { CalendarEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const [applications, dbEvents] = await Promise.all([getApplications(), getCalendarEvents()]);

  const today = new Date().toISOString().slice(0, 10);

  // Derive events directly from applications so they always show up
  const derivedEvents: CalendarEvent[] = [];
  for (const app of applications) {
    // Deadline date
    if (app.deadline && /^\d{4}-\d{2}-\d{2}$/.test(app.deadline)) {
      derivedEvents.push({
        id: `derived-dl-${app.id}`,
        applicationId: app.id,
        company: app.company,
        role: app.role,
        status: app.status,
        eventType: "deadline",
        date: app.deadline,
      });
    }
    // Applied date — show on today if status is applied or beyond
    if (["applied", "interviewing", "offer"].includes(app.status)) {
      derivedEvents.push({
        id: `derived-sub-${app.id}`,
        applicationId: app.id,
        company: app.company,
        role: app.role,
        status: app.status,
        eventType: "submitted",
        date: today,
      });
    }
  }

  // Merge: prefer DB events (which have real dates from drag-drop), dedupe by applicationId+eventType
  const dbKeys = new Set(dbEvents.map((e) => `${e.applicationId}-${e.eventType}`));
  const merged = [
    ...dbEvents,
    ...derivedEvents.filter((e) => !dbKeys.has(`${e.applicationId}-${e.eventType}`)),
  ];

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="mb-6">
          <p className="eyebrow">Schedule</p>
          <h1 className="mt-2 text-4xl font-black text-ink">Calendar</h1>
          <p className="mt-2 text-slate-600">Drag applications onto dates to track deadlines and submissions.</p>
        </div>
        <CalendarView applications={applications} initialEvents={merged} />
      </main>
    </>
  );
}
