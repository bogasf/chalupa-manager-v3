import { useEffect, useState } from "react";
import { subscribeGasReadings } from "../../services/gasService";

import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function GasChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeGasReadings((items) => {
      const sorted = [...items].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setData(sorted);
    });

    return () => unsubscribe();
  }, []);

  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">
          📈 Vývoj stavu plynu
        </h2>

        <p className="text-slate-500">
          Zatím nejsou žádná data.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <h2 className="mb-6 text-xl font-bold">
        📈 Vývoj stavu plynu
      </h2>

      <ResponsiveContainer width="100%" height={350}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis
            domain={[0, 100]}
            unit="%"
          />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="upper"
            name="Horní nádrž"
            stroke="#2563eb"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="lower"
            name="Dolní nádrž"
            stroke="#16a34a"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}