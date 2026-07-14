import { useEffect, useState } from "react";
import {
  subscribeVisits,
  deleteVisit,
} from "../../services/visitService";

export default function VisitTable({ onEdit }) {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeVisits((data) => {
      setVisits(data);
    });

    return () => unsubscribe();
  }, []);

  async function handleDelete(id) {
    const ok = window.confirm("Opravdu chcete tuto návštěvu smazat?");

    if (!ok) return;

    try {
      await deleteVisit(id);
    } catch (error) {
      console.error(error);
      alert("Nepodařilo se návštěvu smazat.");
    }
  }

  if (visits.length === 0) {
    return (
      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <p className="text-center text-gray-500">
          Zatím nejsou evidované žádné návštěvy.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-xl bg-white shadow">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="p-3 text-left">
              Rodina
            </th>

            <th className="p-3 text-center">
              Příjezd
            </th>

            <th className="p-3 text-center">
              Odjezd
            </th>

            <th className="p-3 text-center">
              Nocí
            </th>

            <th className="p-3 text-center">
              Topení
            </th>

            <th className="p-3 text-right">
              Cena
            </th>

            <th className="p-3 text-center">
              Akce
            </th>

          </tr>

        </thead>

        <tbody>

          {visits.map((visit) => (

            <tr
              key={visit.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="p-3">
                {visit.family}
              </td>

              <td className="p-3 text-center">
                {visit.arrival}
              </td>

              <td className="p-3 text-center">
                {visit.departure}
              </td>

              <td className="p-3 text-center">
                {visit.nights}
              </td>

              <td className="p-3 text-center">
                {visit.heating ? "Ano" : "Ne"}
              </td>

              <td className="p-3 text-right">
                {Number(visit.total).toLocaleString("cs-CZ")} Kč
              </td>

              <td className="p-3">

                <div className="flex justify-center gap-2">

                  <button
                    type="button"
                    onClick={() => onEdit(visit)}
                    className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Upravit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(visit.id)}
                    className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
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