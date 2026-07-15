import GasForm from "./GasForm";
import GasHistory from "./GasHistory";
import GasChart from "./GasChart";

export default function Gas() {
  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          🔥 Stav plynu
        </h1>

        <p className="text-slate-500">
          Evidence stavu horní a dolní plynové nádrže.
        </p>

      </div>

      <GasForm />

      <GasChart />

      <GasHistory />

    </div>
  );
}