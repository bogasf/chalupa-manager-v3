import { useEffect, useState } from "react";
import {
  deleteGasReading,
  subscribeGasReadings,
} from "../../services/gasService";

export default function GasHistory() {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeGasReadings(setReadings);

    return () => unsubscribe();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Opravdu smazat odečet?")) return;

    try {
      await deleteGasReading(id);
    } catch (err) {
      console.error(err);
      alert("Mazání se nepodařilo.");
    }
  }

  if (readings.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">
          📋 Historie odečtů
        </h2>

        <p className="text-slate-500">
          Zatím nejsou uloženy žádné odečty.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">
        📋 Historie odečtů
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">

          <thead>

            <tr className="border-b bg-slate-100">

              <th className="p-3 text-left">
                Datum
              </th>

              <th className="p-3 text-center">
                Horní
              </th>

              <th className="p-3 text-center">
                Dolní
              </th>

              <th className="p-3 text-center">
                Akce
              </th>

            </tr>

          </thead>

          <tbody>

            {readings.map((item) => (

              <tr
                key={item.id}
                className="border-b hover:bg-slate-50"
              >

                <td className="p-3">
                  {item.date}
                </td>

                <td className="p-3 text-center font-semibold">
                  {item.upper} %
                </td>

                <td className="p-3 text-center font-semibold">
                  {item.lower} %
                </td>

                <td className="p-3 text-center">

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Smazat
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
}