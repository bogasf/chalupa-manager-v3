import { useEffect, useState } from "react";
import {
  subscribeVisits,
  deleteVisit,
  updateVisit,
} from "../../services/visitService";
import { addActivity } from "../../services/activityService";

const money = (value) =>
  `${Number(value || 0).toLocaleString("cs-CZ")} Kč`;

export default function VisitTable({ onEdit }) {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    return subscribeVisits(setVisits);
  }, []);

  async function remove(visit) {
    if (!window.confirm("Opravdu chcete návštěvu smazat?")) {
      return;
    }

    try {
      await deleteVisit(visit.id);

      await addActivity({
        type: "visit",
        icon: "🗑️",
        title: "Návštěva smazána",
        description: `${visit.arrival} – ${visit.departure}`,
        user: visit.family,
      });
    } catch (err) {
      console.error(err);
      alert("Nepodařilo se návštěvu smazat.");
    }
  }

  async function togglePaid(visit) {
    try {
      const paid = !visit.paid;

      await updateVisit(visit.id, {
        paid,
        paidAt: paid ? new Date().toISOString() : null,
      });

      await addActivity({
        type: "payment",
        icon: paid ? "💰" : "❌",
        title: paid ? "Pobyt zaplacen" : "Platba zrušena",
        description: `${money(visit.total)}`,
        user: visit.family,
      });
    } catch (err) {
      console.error(err);
      alert("Nepodařilo se změnit stav platby.");
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      {visits.length ? (
        <table className="w-full min-w-[760px]">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Rodina</th>
              <th className="p-3">Příjezd</th>
              <th className="p-3">Odjezd</th>
              <th className="p-3">Nocí</th>
              <th className="p-3">Cena</th>
              <th className="p-3 text-center">Platba</th>
              <th className="p-3 text-center">Akce</th>
            </tr>
          </thead>

          <tbody>
            {visits.map((visit) => (
              <tr
                key={visit.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-3 font-medium">
                  {visit.family}
                </td>

                <td className="p-3">
                  {visit.arrival}
                </td>

                <td className="p-3">
                  {visit.departure}
                </td>

                <td className="p-3">
                  {visit.nights}
                </td>

                <td className="p-3 font-semibold">
                  {money(visit.total)}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => togglePaid(visit)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      visit.paid
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    }`}
                  >
                    {visit.paid
                      ? "🟢 Zaplaceno"
                      : "🟠 Nezaplaceno"}
                  </button>
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(visit)}
                      className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    >
                      Upravit
                    </button>

                    <button
                      onClick={() => remove(visit)}
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
        <p className="p-8 text-center text-slate-500">
          Zatím nejsou evidované žádné návštěvy.
        </p>
      )}
    </div>
  );
}