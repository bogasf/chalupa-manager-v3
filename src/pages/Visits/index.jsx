import { useState } from "react";

import VisitForm from "./VisitForm";
import VisitTable from "./VisitTable";

export default function Visits() {

  const [selectedVisit, setSelectedVisit] = useState(null);

  function handleEdit(visit) {
    setSelectedVisit(visit);
  }

  function handleSaved() {
    setSelectedVisit(null);
  }

  function handleCancel() {
    setSelectedVisit(null);
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Evidence návštěv
        </h1>

        <p className="text-gray-500">
          Správa pobytů na chalupě
        </p>

      </div>

      <VisitForm
        selectedVisit={selectedVisit}
        onSaved={handleSaved}
        onCancel={handleCancel}
      />

      <VisitTable
        onEdit={handleEdit}
      />

    </div>
  );
}