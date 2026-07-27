import { useState } from "react";
import FixedCostForm from "./FixedCostForm";
import FixedCostTable from "./FixedCostTable";

export default function FixedCosts() {
  const [selectedCost, setSelectedCost] = useState(null);

  function handleSaved() {
    setSelectedCost(null);
  }

  function handleCancel() {
    setSelectedCost(null);
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Fixní náklady
        </h1>

        <p className="text-slate-500">
          Evidence ročních a dlouhodobých nákladů chalupy.
        </p>
      </div>

      <FixedCostForm
        selectedCost={selectedCost}
        onSaved={handleSaved}
        onCancel={handleCancel}
      />

      <FixedCostTable
        onEdit={setSelectedCost}
      />

    </div>
  );
}