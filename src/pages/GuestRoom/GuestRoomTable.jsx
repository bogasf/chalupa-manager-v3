import { useEffect, useState } from "react";
import {
  subscribeGuestRoomReservations,
  deleteGuestRoomReservation,
  updateGuestRoomReservation,
} from "../../services/guestRoomService";

const money = (value) =>
  `${Number(value || 0).toLocaleString("cs-CZ")} Kč`;

export default function GuestRoomTable({ onEdit }) {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    return subscribeGuestRoomReservations(setReservations);
  }, []);

  async function remove(id) {
    if (window.confirm("Opravdu chcete rezervaci smazat?")) {
      await deleteGuestRoomReservation(id);
    }
  }

  async function togglePaid(reservation) {
    try {
      await updateGuestRoomReservation(reservation.id, {
        paid: !reservation.paid,
        paidAt: !reservation.paid
          ? new Date().toISOString()
          : null,
      });
    } catch (err) {
      console.error(err);
      alert("Nepodařilo se změnit stav platby.");
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">

      {reservations.length ? (

        <table className="w-full min-w-[1100px]">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-3 text-left">
                Host
              </th>

              <th className="p-3">
                Telefon
              </th>

              <th className="p-3">
                Příjezd
              </th>

              <th className="p-3">
                Odjezd
              </th>

              <th className="p-3 text-center">
                Osoby
              </th>

              <th className="p-3 text-center">
                Nocí
              </th>

              <th className="p-3 text-right">
                Cena
              </th>

              <th className="p-3 text-center">
                Platba
              </th>

              <th className="p-3 text-center">
                Akce
              </th>

            </tr>

          </thead>

          <tbody>

            {reservations.map((reservation) => (

              <tr
                key={reservation.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="p-3 font-medium">
                  {reservation.guestName}
                </td>

                <td className="p-3">
                  {reservation.phone || "-"}
                </td>

                <td className="p-3">
                  {reservation.arrival}
                </td>

                <td className="p-3">
                  {reservation.departure}
                </td>

                <td className="p-3 text-center">
                  {reservation.persons}
                </td>

                <td className="p-3 text-center">
                  {reservation.nights}
                </td>

                <td className="p-3 text-right font-semibold">
                  {money(reservation.total)}
                </td>

                <td className="p-3 text-center">

                  <button
                    onClick={() => togglePaid(reservation)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition
                      ${
                        reservation.paid
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }`}
                  >
                    {reservation.paid
                      ? "🟢 Zaplaceno"
                      : "🟠 Nezaplaceno"}
                  </button>

                </td>

                <td className="p-3">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onEdit(reservation)}
                      className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    >
                      Upravit
                    </button>

                    <button
                      onClick={() => remove(reservation.id)}
                      className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                    >
                      Smazat
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      ) : (

        <div className="p-10 text-center text-slate-500">
          Zatím nejsou vytvořeny žádné rezervace návštěvnického pokoje.
        </div>

      )}

    </div>
  );
}
export function hasReservationConflict(
  reservations,
  arrival,
  departure,
  currentId = null
) {
  const newArrival = new Date(arrival);
  const newDeparture = new Date(departure);

  return reservations.some((reservation) => {
    if (reservation.id === currentId) {
      return false;
    }

    const existingArrival = new Date(reservation.arrival);
    const existingDeparture = new Date(reservation.departure);

    return (
      newArrival < existingDeparture &&
      newDeparture > existingArrival
    );
  });
}