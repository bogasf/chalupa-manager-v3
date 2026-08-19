import { useEffect, useMemo, useState } from "react";
import {
  subscribeVisits,
  deleteVisit,
  updateVisit,
} from "../../services/visitService";
import { addActivity } from "../../services/activityService";
import { formatDate } from "../../utils/dateUtils";

const money = (value) =>
  `${Number(value || 0).toLocaleString("cs-CZ")} Kč`;

export default function VisitTable({ onEdit }) {
  const [visits, setVisits] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    return subscribeVisits(setVisits);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { activeVisits, historyVisits } = useMemo(() => {
    const active = [];
    const history = [];

    visits.forEach((visit) => {
      // Zaplacené návštěvy se v evidenci nezobrazují
      if (visit.paid) {
        return;
      }

      const departure = new Date(visit.departure);
      departure.setHours(0, 0, 0, 0);

      if (departure < today) {
        history.push(visit);
      } else {
        active.push(visit);
      }
    });

    // Nejbližší příjezdy nahoře
    active.sort(
      (a, b) =>
        new Date(a.arrival) - new Date(b.arrival)
    );

    // Nejnovější ukončené návštěvy nahoře
    history.sort(
      (a, b) =>
        new Date(b.departure) - new Date(a.departure)
    );

    return {
      activeVisits: active,
      historyVisits: history,
    };
  }, [visits]);

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
        description: `${formatDate(
          visit.arrival
        )} – ${formatDate(visit.departure)}`,
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
        paidAt: paid
          ? new Date().toISOString()
          : null,
      });

      await addActivity({
        type: "payment",
        icon: paid ? "💰" : "❌",
        title: paid
          ? "Pobyt zaplacen"
          : "Platba zrušena",
        description: `${money(visit.total)}`,
        user: visit.family,
      });
    } catch (err) {
      console.error(err);
      alert("Nepodařilo se změnit stav platby.");
    }
  }

  function renderTable(list) {
    if (!list.length) {
      return (
        <p className="p-8 text-center text-slate-500">
          Žádné nezaplacené návštěvy.
        </p>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Rodina</th>
              <th className="p-3">Příjezd</th>
              <th className="p-3">Odjezd</th>
              <th className="p-3">Nocí</th>
              <th className="p-3">Cena</th>
              <th className="p-3">Poznámka</th>
              <th className="p-3 text-center">
                Platba
              </th>
              <th className="p-3 text-center">
                Akce
              </th>
            </tr>
          </thead>

          <tbody>
            {list.map((visit) => (
              <tr
                key={visit.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-3 font-medium">
                  {visit.family}
                </td>

                <td className="p-3">
                  {formatDate(visit.arrival)}
                </td>

                <td className="p-3">
                  {formatDate(visit.departure)}
                </td>

                <td className="p-3">
                  {visit.nights}
                </td>

                <td className="p-3 font-semibold">
                  {money(visit.total)}
                </td>

                <td className="max-w-xs p-3 text-sm text-slate-700">
                  {visit.note?.trim() ? (
                    visit.note
                  ) : (
                    <span className="text-slate-400">
                      —
                    </span>
                  )}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => togglePaid(visit)}
                    className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-200"
                  >
                    🟠 Nezaplaceno
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
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* NEZAPLACENÉ AKTIVNÍ A NADCHÁZEJÍCÍ */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="flex items-center justify-between border-b bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              🟠 Nezaplacené návštěvy
            </h2>

            <p className="text-sm text-slate-500">
              {activeVisits.length}{" "}
              {activeVisits.length === 1
                ? "návštěva"
                : "návštěv"}
            </p>
          </div>
        </div>

        {renderTable(activeVisits)}
      </div>

      {/* HISTORIE NEZAPLACENÝCH */}
      {historyVisits.length > 0 && (
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <button
            onClick={() =>
              setShowHistory((prev) => !prev)
            }
            className="flex w-full items-center justify-between bg-slate-100 px-5 py-4 text-left transition hover:bg-slate-200"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-700">
                📁 Historie nezaplacených návštěv
              </h2>

              <p className="text-sm text-slate-500">
                {historyVisits.length}{" "}
                {historyVisits.length === 1
                  ? "ukončená návštěva"
                  : "ukončených návštěv"}
              </p>
            </div>

            <span className="text-xl">
              {showHistory ? "▲" : "▼"}
            </span>
          </button>

          {showHistory && (
            <div>
              {renderTable(historyVisits)}
            </div>
          )}
        </div>
      )}

      {/* VŠECHNY NÁVŠTĚVY ZAPLACENÉ */}
      {!activeVisits.length &&
        !historyVisits.length &&
        visits.length > 0 && (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <div className="text-3xl">✅</div>

            <p className="mt-2 font-semibold text-slate-700">
              Všechny návštěvy jsou zaplacené.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              V evidenci nejsou žádné nezaplacené pobyty.
            </p>
          </div>
        )}

      {/* ŽÁDNÉ NÁVŠTĚVY */}
      {!visits.length && (
        <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow">
          Zatím nejsou evidované žádné návštěvy.
        </div>
      )}
    </div>
  );
}