import { useState } from "react";

import GuestRoomForm from "./GuestRoomForm";
import GuestRoomTable from "./GuestRoomTable";

export default function GuestRoom() {
  const [selectedReservation, setSelectedReservation] = useState(null);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          🛏️ Návštěvnický pokoj
        </h1>

        <p className="text-slate-500">
          Evidence rezervací návštěvnického pokoje.
        </p>
      </div>

      <GuestRoomForm
        selectedReservation={selectedReservation}
        onSaved={() => setSelectedReservation(null)}
        onCancel={() => setSelectedReservation(null)}
      />

      <GuestRoomTable
        onEdit={setSelectedReservation}
      />

    </div>
  );
}