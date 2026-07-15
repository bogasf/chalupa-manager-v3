import { useEffect, useState } from "react";
import { subscribeVisits, deleteVisit, updateVisit } from "../../services/visitService";
const money = (value) => `${Number(value || 0).toLocaleString("cs-CZ")} Kč`;
export default function VisitTable({ onEdit }) {
  const [visits, setVisits] = useState([]);
  useEffect(() => subscribeVisits(setVisits), []);
  async function remove(id) { if (window.confirm("Opravdu chcete návštěvu smazat?")) await deleteVisit(id); }
  return <div className="overflow-x-auto rounded-xl bg-white shadow">{visits.length ? <table className="w-full min-w-[760px]"><thead className="bg-slate-100 text-left"><tr>{["Rodina", "Příjezd", "Odjezd", "Nocí", "Cena", "Platba", "Akce"].map((title) => <th key={title} className="p-3">{title}</th>)}</tr></thead><tbody>{visits.map((visit) => <tr key={visit.id} className="border-t hover:bg-slate-50"><td className="p-3 font-medium">{visit.family}</td><td className="p-3">{visit.arrival}</td><td className="p-3">{visit.departure}</td><td className="p-3">{visit.nights}</td><td className="p-3">{money(visit.total)}</td><td className="p-3"><button onClick={() => updateVisit(visit.id, { paid: !visit.paid })} className={`rounded-full px-3 py-1 text-sm ${visit.paid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{visit.paid ? "Zaplaceno" : "Nezaplaceno"}</button></td><td className="flex gap-2 p-3"><button onClick={() => onEdit(visit)} className="text-blue-700 hover:underline">Upravit</button><button onClick={() => remove(visit.id)} className="text-red-700 hover:underline">Smazat</button></td></tr>)}</tbody></table> : <p className="p-8 text-center text-slate-500">Zatím nejsou evidované žádné návštěvy.</p>}</div>;
}
