import { useEffect, useMemo, useState } from "react";

import {
  subscribeGuestRoomReservations,
  calculateGuestRoomPaymentSummary,
  markGuestRoomPaid,
  updateGuestRoomPrice,
} from "../../services/guestRoomService";

import { addActivity } from "../../services/activityService";

function money(value) {
  return Number(value || 0).toLocaleString("cs-CZ") + " Kč";
}

export default function GuestRoomPayment() {

  const [reservations, setReservations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedReservation, setSelectedReservation] =
    useState(null);

  const [editPrice, setEditPrice] = useState(100);

  useEffect(() => {

    const unsubscribe =
      subscribeGuestRoomReservations((data) => {

        setReservations(data);

        setLoading(false);

      });

    return unsubscribe;

  }, []);

  const summary = useMemo(() => {

    return calculateGuestRoomPaymentSummary(
      reservations
    );

  }, [reservations]);

  async function togglePaid(reservation) {

    const newState = !reservation.paid;

    try {

      await markGuestRoomPaid(
        reservation.id,
        newState,
        reservation.paymentMethod || "",
        reservation.paymentNote || "",
        reservation.price || 100
      );

      await addActivity({

        type: "payment",

        icon: newState ? "💰" : "❌",

        title: newState
          ? "Platba přijata"
          : "Platba zrušena",

        description:
          reservation.guestName,

        user: reservation.guestName,

      });

    } catch (err) {

      console.error(err);

      alert("Nepodařilo se uložit platbu.");

    }

  }

  async function savePrice() {

    if (!selectedReservation) return;

    try {

      await updateGuestRoomPrice(

        selectedReservation.id,

        Number(editPrice)

      );

      await addActivity({

        type: "payment",

        icon: "💵",

        title: "Změna ceny",

        description:
          `${selectedReservation.guestName} (${money(editPrice)})`,

        user: selectedReservation.guestName,

      });

      setSelectedReservation(null);

    } catch (err) {

      console.error(err);

      alert("Nepodařilo se uložit cenu.");

    }

  }

  if (loading) {

    return (

      <div className="rounded-xl bg-white p-6 shadow">

        Načítám rezervace...

      </div>

    );

  }

  return (

    <div className="space-y-6">

      <div className="rounded-xl bg-white p-6 shadow">

        <h1 className="text-3xl font-bold">

          💰 Platby návštěvnického pokoje

        </h1>

        <p className="mt-2 text-slate-500">

          Evidence plateb za návštěvnický pokoj.

        </p>

      </div>

      <div className="grid gap-4 md:grid-cols-5">

        <div className="rounded-xl bg-white p-5 shadow">

          <div className="text-sm text-slate-500">

            Rezervací

          </div>

          <div className="mt-2 text-3xl font-bold">

            {summary.totalReservations}

          </div>

        </div>

        <div className="rounded-xl bg-green-50 p-5 shadow">

          <div className="text-sm">

            Zaplaceno

          </div>

          <div className="mt-2 text-3xl font-bold text-green-700">

            {summary.paidReservations}

          </div>

        </div>

        <div className="rounded-xl bg-red-50 p-5 shadow">

          <div className="text-sm">

            Nezaplaceno

          </div>

          <div className="mt-2 text-3xl font-bold text-red-700">

            {summary.unpaidReservations}

          </div>

        </div>

        <div className="rounded-xl bg-blue-50 p-5 shadow">

          <div className="text-sm">

            Vybráno

          </div>

          <div className="mt-2 text-3xl font-bold text-blue-700">

            {money(summary.collected)}

          </div>

        </div>

        <div className="rounded-xl bg-amber-50 p-5 shadow">

          <div className="text-sm">

            Čeká na úhradu

          </div>

          <div className="mt-2 text-3xl font-bold text-amber-700">

            {money(summary.waiting)}

          </div>

        </div>

      </div>
            <div className="overflow-hidden rounded-xl bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-4 py-3 text-left">
                Host
              </th>

              <th className="px-4 py-3 text-left">
                Pobyt
              </th>

              <th className="px-4 py-3 text-center">
                Cena
              </th>

              <th className="px-4 py-3 text-center">
                Stav
              </th>

              <th className="px-4 py-3 text-center">
                Platba
              </th>

              <th className="px-4 py-3 text-center">
                Akce
              </th>

            </tr>

          </thead>

          <tbody>

            {reservations.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="py-8 text-center text-slate-500"
                >

                  Žádné rezervace.

                </td>

              </tr>

            )}

            {reservations.map((reservation) => (

              <tr
                key={reservation.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-4 py-3">

                  <div className="font-semibold">

                    {reservation.guestName}

                  </div>

                  {reservation.phone && (

                    <div className="text-sm text-slate-500">

                      {reservation.phone}

                    </div>

                  )}

                </td>

                <td className="px-4 py-3">

                  <div>

                    {reservation.arrival}

                  </div>

                  <div className="text-center">

                    ↓

                  </div>

                  <div>

                    {reservation.departure}

                  </div>

                </td>

                <td className="px-4 py-3 text-center">

                  <button

                    onClick={() => {

                      setSelectedReservation(
                        reservation
                      );

                      setEditPrice(
                        reservation.price || 100
                      );

                    }}

                    className="rounded-lg bg-slate-100 px-3 py-2 hover:bg-slate-200"

                  >

                    {money(
                      reservation.price || 100
                    )}

                  </button>

                </td>

                <td className="px-4 py-3 text-center">

                  {reservation.paid ? (

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">

                      ✅ Zaplaceno

                    </span>

                  ) : (

                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">

                      ❌ Nezaplaceno

                    </span>

                  )}

                </td>

                <td className="px-4 py-3 text-center">

                  {reservation.paidAt?.toDate
                    ? reservation.paidAt
                        .toDate()
                        .toLocaleDateString("cs-CZ")
                    : "-"}

                </td>

                <td className="px-4 py-3 text-center">

                  <button

                    onClick={() =>
                      togglePaid(reservation)
                    }

                    className={`rounded-lg px-4 py-2 text-white transition ${
                      reservation.paid
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}

                  >

                    {reservation.paid
                      ? "Zrušit platbu"
                      : "Označit zaplacené"}

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
            {selectedReservation && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <h2 className="text-2xl font-bold">

              💰 Úprava platby

            </h2>

            <div className="mt-6 space-y-4">

              <div>

                <label className="mb-1 block text-sm font-medium">

                  Host

                </label>

                <input
                  disabled
                  value={selectedReservation.guestName}
                  className="w-full rounded-lg border bg-slate-100 p-3"
                />

              </div>

              <div>

                <label className="mb-1 block text-sm font-medium">

                  Cena

                </label>

                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) =>
                    setEditPrice(Number(e.target.value))
                  }
                  className="w-full rounded-lg border p-3"
                />

              </div>

              <div>

                <label className="mb-1 block text-sm font-medium">

                  Stav platby

                </label>

                <div
                  className={`rounded-lg p-3 text-center font-semibold ${
                    selectedReservation.paid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >

                  {selectedReservation.paid
                    ? "✅ Zaplaceno"
                    : "❌ Nezaplaceno"}

                </div>

              </div>

            </div>

            <div className="mt-8 flex justify-end gap-3">

              <button
                onClick={() =>
                  setSelectedReservation(null)
                }
                className="rounded-lg bg-slate-200 px-5 py-2 hover:bg-slate-300"
              >
                Zavřít
              </button>

              <button
                onClick={savePrice}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                💾 Uložit cenu
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}