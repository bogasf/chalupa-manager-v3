import { useEffect, useMemo, useState } from "react";
import {
  subscribeFixedCosts,
  deleteFixedCost,
} from "../../services/fixedCostService";
import { formatDate } from "../../utils/dateUtils";

const money = (value) =>
  `${Number(value || 0).toLocaleString("cs-CZ")} Kč`;

export default function FixedCostTable({ onEdit }) {
  const [costs, setCosts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeFixedCosts(setCosts);

    return () => unsubscribe();
  }, []);

  const summary = useMemo(() => {
    const total = costs.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );

    return {
      total,
      familyCount: 4,
      perFamily: total / 4,
    };
  }, [costs]);

  async function remove(item) {
    if (!window.confirm(`Opravdu chcete smazat "${item.name}"?`)) {
      return;
    }

    try {
      await deleteFixedCost(item.id);
    } catch (err) {
      console.error(err);
      alert("Nepodařilo se smazat položku.");
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>
              <th className="p-3 text-left">Název</th>
              <th className="p-3 text-left">Od</th>
              <th className="p-3 text-left">Do</th>
              <th className="p-3 text-right">Cena</th>
              <th className="p-3 text-left">Poznámka</th>
              <th className="p-3 text-center">Akce</th>
            </tr>

          </thead>

          <tbody>

            {costs.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-slate-500"
                >
                  Zatím nejsou zadány žádné fixní náklady.
                </td>
              </tr>
            )}

            {costs.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-3 font-medium">
                  {item.name}
                </td>

                <td className="p-3">
                  {formatDate(item.from)}
                </td>

                <td className="p-3">
                  {formatDate(item.to)}
                </td>

                <td className="p-3 text-right font-semibold">
                  {money(item.price)}
                </td>

                <td className="p-3">
                  {item.note || "—"}
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onEdit(item)}
                      className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Upravit
                    </button>

                    <button
                      onClick={() => remove(item)}
                      className="rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
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

      <div className="mt-6 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-5 text-xl font-semibold">
          Přehled fixních nákladů
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border p-4">

            <div className="text-sm text-slate-500">
              Celkem fixní náklady
            </div>

            <div className="mt-2 text-3xl font-bold">
              {money(summary.total)}
            </div>

          </div>

          <div className="rounded-lg border p-4">

            <div className="text-sm text-slate-500">
              Rozdělení
            </div>

            <div className="mt-2 text-3xl font-bold">
              1 / {summary.familyCount}
            </div>

          </div>

          <div className="rounded-lg border border-green-300 bg-green-50 p-4">

            <div className="text-sm text-slate-500">
              Na jednu rodinu
            </div>

            <div className="mt-2 text-3xl font-bold text-green-700">
              {money(summary.perFamily)}
            </div>

          </div>

        </div>

      </div>
    </>
  );
}