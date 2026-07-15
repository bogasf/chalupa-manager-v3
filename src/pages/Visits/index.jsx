import { useState } from "react";
import VisitForm from "./VisitForm";
import VisitTable from "./VisitTable";
export default function Visits() { const [selectedVisit, setSelectedVisit] = useState(null); return <div className="space-y-6"><div><h1 className="text-3xl font-bold">Evidence návštěv</h1><p className="text-slate-500">Správa pobytů na chalupě a jejich plateb.</p></div><VisitForm selectedVisit={selectedVisit} onSaved={() => setSelectedVisit(null)} onCancel={() => setSelectedVisit(null)} /><VisitTable onEdit={setSelectedVisit} /></div>; }
