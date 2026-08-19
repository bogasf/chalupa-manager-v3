import { useState } from "react";
import InvestmentForm from "../../components/Investments/InvestmentForm";
import InvestmentTable from "../../components/Investments/InvestmentTable";

export default function Investments() {
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function handleSaved() {
    setSelectedInvestment(null);
    setShowForm(false);
  }

  function handleEdit(investment) {
    setSelectedInvestment(investment);
    setShowForm(true);
  }

  function handleCancel() {
    setSelectedInvestment(null);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          🔧 Investice
        </h1>

        <p className="text-slate-500">
          Evidence investic a oprav chalupy.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            setSelectedInvestment(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          ➕ Přidat investici
        </button>
      </div>

      {showForm && (
        <InvestmentForm
          selectedInvestment={selectedInvestment}
          onSaved={handleSaved}
          onCancel={handleCancel}
        />
      )}

      <InvestmentTable
        onEdit={handleEdit}
      />
    </div>
  );
}