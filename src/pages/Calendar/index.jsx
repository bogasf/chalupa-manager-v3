import { useEffect, useState } from "react";
import CalendarView from "../../components/calendar/CalendarView";
import { subscribeVisits } from "../../services/visitService";
import { subscribeGuestRoomReservations } from "../../services/guestRoomService";

export default function Calendar() {
  const [visitEvents, setVisitEvents] = useState([]);
  const [guestRoomEvents, setGuestRoomEvents] = useState([]);

  useEffect(() => {
    const unsubscribeVisits = subscribeVisits((visits) => {
      const events = visits.map((visit) => ({
        id: `visit-${visit.id}`,
        title: `🏠 ${visit.family}`,
        start: visit.arrival,
        end: new Date(
          new Date(visit.departure).getTime() + 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
        allDay: true,
        color: "#2563eb", // modrá
      }));

      setVisitEvents(events);
    });

    const unsubscribeGuestRoom =
      subscribeGuestRoomReservations((reservations) => {
        const events = reservations.map((reservation) => ({
          id: `room-${reservation.id}`,
          title: `🛏️ ${reservation.guestName || reservation.name || "Pokoj"}`,
          start: reservation.arrival,
          end: new Date(
            new Date(reservation.departure).getTime() + 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
          allDay: true,
          color: "#16a34a", // zelená
        }));

        setGuestRoomEvents(events);
      });

    return () => {
      unsubscribeVisits();
      unsubscribeGuestRoom();
    };
  }, []);

  const events = [...visitEvents, ...guestRoomEvents];

  function handleDateClick(info) {
    console.log("Klik na den:", info.dateStr);
  }

  function handleEventClick(info) {
    console.log(info.event);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold">
          Kalendář obsazenosti
        </h1>

        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span
              className="h-4 w-4 rounded"
              style={{ background: "#2563eb" }}
            />
            Chalupa
          </div>

          <div className="flex items-center gap-2">
            <span
              className="h-4 w-4 rounded"
              style={{ background: "#16a34a" }}
            />
            Návštěvnický pokoj
          </div>
        </div>
      </div>

      <CalendarView
        events={events}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
      />
    </div>
  );
}