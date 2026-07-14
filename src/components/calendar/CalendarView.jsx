import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarView({
  events = [],
  onDateClick,
  onEventClick,
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="cs"
        height="auto"
        events={events}
        dateClick={(info) => onDateClick?.(info)}
        eventClick={(info) => onEventClick?.(info)}
      />
    </div>
  );
}