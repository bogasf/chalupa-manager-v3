import { useEffect, useMemo, useState } from "react";
import {
  subscribeInvestments,
  deleteInvestment,
} from "../../services/investmentService";

const money = (value) =>
  `${Number(value || 0).toLocaleString("cs-CZ")} Kč`;

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("cs-CZ");
};

const statusLabel = {
  planovano: "Plánováno",
  "probíhá": "Probíhá",
  dokonceno: "Dokončeno",
};

export default function InvestmentTable({ onEdit }) {
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    return subscribeInvestments(setInvestments);
  }, []);

  async function removeInvestment(id) {
    if (
      !window.confirm(
        "Opravdu chcete tuto investici smazat?"
      )
    ) {
      return;
    }

    try {
      await deleteInvestment(id);
    } catch (err) {
      console.error(err);
      alert("Investici se nepodařilo smazat.");
    }
  }

  const total = useMemo(() => {
    return investments.reduce(
      (sum, investment) =>
        sum + Number(investment.price || 0),
      0
    );
  }, [investments]);

  const completedTotal = useMemo(() => {
    return investments
      .filter(
        (investment) =>
          investment.status === "dokonceno"
      )
      .reduce(
        (sum, investment) =>
          sum + Number(investment.price || 0),
        0
      );
  }, [investments]);

  const plannedTotal = useMemo(() => {
    return investments
      .filter(
        (investment) =>
          investment.status === "planovano"
      )
      .reduce(
        (sum, investment) =>
          sum + Number(investment.price || 0),
        0
      );
  }, [investments]);

  return (
    <div className="space-y-6">

      {/* Souhrn */}
      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-xl bg-white p-5 shadow">
          <div className="text-sm text-slate-500">
            Celkem investice a opravy
          </div>

          <div className="mt-2 text-2xl font-bold text-slate-800">
            {money(total)}
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <div className="text-sm text-slate-500">
            Dokončeno
          </div>

          <div className="mt-2 text-2xl font-bold text-green-600">
            {money(completedTotal)}
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <div className="text-sm text-slate-500">
            Plánováno
          </div>

          <div className="mt-2 text-2xl font-bold text-orange-600">
            {money(plannedTotal)}
          </div>
        </div>

      </div>

      {/* Tabulka */}
      <div className="overflow-x-auto rounded-xl bg-white shadow">

        {investments.length > 0 ? (

          <table className="w-full min-w-[1000px]">

            <thead className="bg-slate-100">
              <tr>

                <th className="p-3 text-left">
                  Název
                </th>

                <th className="p-3 text-center">
                  Typ
                </th>

                <th className="p-3 text-right">
                  Cena
                </th>

                <th className="p-3 text-center">
                  Datum
                </th>

                <th className="p-3 text-center">
                  Stav
                </th>

                <th className="p-3 text-left">
                  Zaplatil
                </th>

                <th className="p-3 text-left">
                  Poznámka
                </th>

                <th className="p-3 text-center">
                  Akce
                </th>

              </tr>
            </thead>

            <tbody>

              {investments.map((investment) => (

                <tr
                  key={investment.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="p-3 font-semibold">
                    {investment.name}
                  </td>

                  <td className="p-3 text-center">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        investment.type === "oprava"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {investment.type === "oprava"
                        ? "Oprava"
                        : "Investice"}
                    </span>

                  </td>

                  <td className="p-3 text-right font-bold">
                    {money(investment.price)}
                  </td>

                  <td className="p-3 text-center">
                    {formatDate(investment.date)}
                  </td>

                  <td className="p-3 text-center">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        investment.status === "dokonceno"
                          ? "bg-green-100 text-green-700"
                          : investment.status ===
                            "probíhá"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {statusLabel[
                        investment.status
                      ] || investment.status}
                    </span>

                  </td>

                  <td className="p-3">
                    {investment.paidBy || "-"}
                  </td>

                  <td className="max-w-[300px] p-3 text-sm text-slate-600">
                    {investment.note || "-"}
                  </td>

                  <td className="p-3">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          onEdit?.(investment)
                        }
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        ✏️ Upravit
                      </button>

                      <button
                        onClick={() =>
                          removeInvestment(
                            investment.id
                          )
                        }
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        🗑️ Smazat
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        ) : (

          <div className="p-10 text-center text-slate-500">
            Zatím nejsou evidovány žádné investice ani opravy.
          </div>

        )}

      </div>

    </div>
  );
}