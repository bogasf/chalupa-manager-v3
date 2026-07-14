import { useEffect, useState } from "react";
import CalendarView from "../../components/calendar/CalendarView";
import { subscribeVisits } from "../../services/visitService";

export default function Calendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeVisits((visits) => {
      const calendarEvents = visits.map((visit) => ({
        id: visit.id,

        title: visit.family,

        start: visit.arrival,

        // FullCalendar bere konec jako exkluzivní.
        // Přidáme 1 den, aby se zobrazil celý pobyt.
        end: new Date(
          new Date(visit.departure).getTime() + 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],

        allDay: true,
      }));

      setEvents(calendarEvents);
    });

    return () => unsubscribe();
  }, []);

  function handleDateClick(info) {
    console.log("Klik na den:", info.dateStr);
  }

  function handleEventClick(info) {
    console.log(info.event);
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Kalendář obsazenosti
      </h1>

      <CalendarView
        events={events}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
      />

    </div>
  );
}