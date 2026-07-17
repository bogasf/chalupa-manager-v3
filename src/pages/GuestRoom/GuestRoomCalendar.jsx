import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { subscribeGuestRoomReservations } from "../../services/guestRoomService";

const weekDays = [
  "Po",
  "Út",
  "St",
  "Čt",
  "Pá",
  "So",
  "Ne",
];

function isReserved(date, reservations) {
  return reservations.find((reservation) => {
    const arrival = new Date(reservation.arrival);
    const departure = new Date(reservation.departure);

    return date >= arrival && date < departure;
  });
}

export default function GuestRoomCalendar() {

  const [reservations, setReservations] = useState([]);

  const [currentMonth, setCurrentMonth] = useState(
    new Date()
  );

  useEffect(() => {
    return subscribeGuestRoomReservations(
      setReservations
    );
  }, []);

  const firstDay = useMemo(() => {

    return new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );

  }, [currentMonth]);

  const lastDay = useMemo(() => {

    return new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

  }, [currentMonth]);

  const firstWeekDay =
    (firstDay.getDay() + 6) % 7;

  const daysInMonth = lastDay.getDate();

  const cells = [];

  for (let i = 0; i < firstWeekDay; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {

    cells.push(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      )
    );

  }

  function previousMonth() {

    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );

  }

  function nextMonth() {

    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );

  }
    return (
    <div className="rounded-xl bg-white p-6 shadow">

      <div className="mb-6 flex items-center justify-between">

        <button
          onClick={previousMonth}
          className="rounded-lg border p-2 hover:bg-slate-100"
        >
          <ChevronLeft />
        </button>

        <h2 className="text-2xl font-bold">
          {currentMonth.toLocaleDateString("cs-CZ", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          onClick={nextMonth}
          className="rounded-lg border p-2 hover:bg-slate-100"
        >
          <ChevronRight />
        </button>

      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">

        {weekDays.map((day) => (

          <div
            key={day}
            className="rounded-lg bg-slate-100 p-2 text-center font-semibold"
          >
            {day}
          </div>

        ))}

      </div>

      <div className="grid grid-cols-7 gap-2">

        {cells.map((date, index) => {

          if (!date) {

            return (
              <div
                key={index}
                className="aspect-square"
              />
            );

          }

          const reservation = isReserved(
            date,
            reservations
          );

          const today =
            new Date().toDateString() ===
            date.toDateString();

          return (

            <div
              key={date.toISOString()}
              className={`
                aspect-square
                rounded-lg
                border
                p-2
                transition

                ${
                  reservation
                    ? "border-red-300 bg-red-100"
                    : "border-emerald-300 bg-emerald-50 hover:bg-emerald-100"
                }

                ${
                  today
                    ? "ring-2 ring-blue-500"
                    : ""
                }
              `}
            >

              <div className="flex justify-between">

                <span className="font-bold">
                  {date.getDate()}
                </span>

                {reservation ? (
                  <span>
                    🔴
                  </span>
                ) : (
                  <span>
                    🟢
                  </span>
                )}

              </div>

              {reservation && (

                <div className="mt-2">

                  <div className="truncate text-xs font-semibold">
                    {reservation.guestName}
                  </div>

                  <div className="text-xs text-slate-600">
                    {reservation.persons} osoby
                  </div>

                </div>

              )}

            </div>

          );

        })}

      </div>
          <div className="mt-6 flex flex-wrap gap-6 rounded-lg bg-slate-50 p-4">

        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-emerald-100 border border-emerald-300" />
          <span>Volný termín</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-red-100 border border-red-300" />
          <span>Obsazený termín</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded border-2 border-blue-500" />
          <span>Dnešní den</span>
        </div>

      </div>

      <div className="mt-6 rounded-xl border bg-slate-50 p-4">

        <h3 className="mb-3 text-lg font-semibold">
          Statistiky měsíce
        </h3>

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-lg bg-white p-4 shadow-sm">

            <div className="text-sm text-slate-500">
              Počet rezervací
            </div>

            <div className="mt-2 text-3xl font-bold">
              {reservations.length}
            </div>

          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">

            <div className="text-sm text-slate-500">
              Dní v měsíci
            </div>

            <div className="mt-2 text-3xl font-bold">
              {daysInMonth}
            </div>

          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">

            <div className="text-sm text-slate-500">
              Aktuální měsíc
            </div>

            <div className="mt-2 text-xl font-bold capitalize">
              {currentMonth.toLocaleDateString("cs-CZ", {
                month: "long",
                year: "numeric",
              })}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}