import { useEffect, useMemo, useState } from "react";
import Card from "../../components/ui/Card";
import { subscribeFamilies } from "../../services/familyService";
import { subscribeVisits } from "../../services/visitService";
import { subscribeWorkEntries } from "../../services/workService";
import { subscribeTransactions } from "../../services/financeService";
export default function Dashboard() {
  const [families, setFamilies] = useState([]), [visits, setVisits] = useState([]), [work, setWork] = useState([]), [transactions, setTransactions] = useState([]);
  useEffect(() => { const subscriptions = [subscribeFamilies(setFamilies), subscribeVisits(setVisits), subscribeWorkEntries(setWork), subscribeTransactions(setTransactions)]; return () => subscriptions.forEach((unsubscribe) => unsubscribe()); }, []);
  const values = useMemo(() => { const income = visits.filter((item) => item.paid).reduce((sum, item) => sum + Number(item.total || 0), 0) + transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + Number(item.amount || 0), 0); const expense = transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + Number(item.amount || 0), 0); return { active: families.filter((item) => item.active !== false).length, hours: work.reduce((sum, item) => sum + Number(item.hours || 0), 0), balance: income - expense }; }, [families, visits, work, transactions]);
  const upcoming = visits.filter((item) => item.departure >= new Date().toISOString().slice(0, 10)).slice(0, 5);
  return <div className="space-y-8"><div><h1 className="text-3xl font-bold">Přehled</h1><p className="text-slate-500">Aktuální stav správy chalupy.</p></div><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"><Card title="Aktivní rodiny" value={values.active} /><Card title="Návštěvy" value={visits.length} /><Card title="Brigády" value={`${values.hours} h`} /><Card title="Pokladna" value={`${values.balance.toLocaleString("cs-CZ")} Kč`} /></div><section className="rounded-xl bg-white p-6 shadow"><h2 className="mb-4 text-xl font-semibold">Nejbližší návštěvy</h2>{upcoming.length ? <div className="divide-y">{upcoming.map((visit) => <div key={visit.id} className="flex items-center justify-between py-3"><span className="font-medium">{visit.family}</span><span className="text-slate-600">{visit.arrival} — {visit.departure}</span></div>)}</div> : <p className="text-slate-500">Žádné nadcházející návštěvy.</p>}</section></div>;
}
