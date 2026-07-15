import { useState } from "react";
import SettlementTab from "./SettlementTab";
import CashBookTab from "./CashBookTab";

export default function Finance() {
  const [tab, setTab] = useState("settlement");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Finance</h1>
        <p className="text-slate-500">
          Vyúčtování rodin a pokladna chalupy.
        </p>
      </div>

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab("settlement")}
          className={`rounded-t-lg px-5 py-3 font-medium ${
            tab === "settlement"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 hover:bg-slate-200"
          }`}
        >
          📊 Vyúčtování
        </button>

        <button
          onClick={() => setTab("cashbook")}
          className={`rounded-t-lg px-5 py-3 font-medium ${
            tab === "cashbook"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 hover:bg-slate-200"
          }`}
        >
          💰 Pokladna
        </button>
      </div>

      {tab === "settlement" ? (
        <SettlementTab />
      ) : (
        <CashBookTab />
      )}
    </div>
  );
}