import type { CalendarEvent } from "@/lib/types";

export const INTERVIEW_SCHEDULED_EVENT = "interview-scheduled";

export function dispatchInterviewScheduled(event: CalendarEvent) {
  window.dispatchEvent(new CustomEvent(INTERVIEW_SCHEDULED_EVENT, { detail: event }));
}
