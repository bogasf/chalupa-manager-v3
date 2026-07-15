import { useEffect, useState } from "react";
import { subscribeLastGasReading } from "../../services/gasService";

export default function GasCard() {
  const [gas, setGas] = useState(null);

  useEffect(() => {
    return subscribeLastGasReading(setGas);
  }, []);

  return (
    <section className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-5 text-xl font-semibold">
        🔥 Stav plynu
      </h2>

      {!gas ? (
        <p className="text-slate-500">
          Zatím není žádný odečet.
        </p>
      ) : (
        <div className="space-y-5">

          <div>
            <div className="mb-1 flex justify-between">
              <span>Horní nádrž</span>
              <strong>{gas.upper}%</strong>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-3 rounded-full bg-green-600"
                style={{ width: `${gas.upper}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between">
              <span>Dolní nádrž</span>
              <strong>{gas.lower}%</strong>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-3 rounded-full bg-blue-600"
                style={{ width: `${gas.lower}%` }}
              />
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Poslední odečet:
            <br />
            {gas.date}
          </div>

        </div>
      )}
    </section>
  );
}