import { useEffect, useMemo, useState } from "react";
import Card from "../../components/ui/Card";
import ActivityCard from "./components/ActivityCard";

import { subscribeFamilies } from "../../services/familyService";
import { subscribeVisits } from "../../services/visitService";
import { subscribeWorkEntries } from "../../services/workService";
import { subscribeTransactions } from "../../services/financeService";

export default function Dashboard() {
  const [families, setFamilies] = useState([]);
  const [visits, setVisits] = useState([]);
  const [work, setWork] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribes = [
      subscribeFamilies(setFamilies),
      subscribeVisits(setVisits),
      subscribeWorkEntries(setWork),
      subscribeTransactions(setTransactions),
    ];

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const values = useMemo(() => {
    const visitIncome = visits
      .filter((item) => item.paid)
      .reduce((sum, item) => sum + Number(item.total || 0), 0);

    const cashIncome = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const expense = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return {
      activeFamilies: families.filter(
        (item) => item.active !== false
      ).length,

      workHours: work.reduce(
        (sum, item) => sum + Number(item.hours || 0),
        0
      ),

      balance: visitIncome + cashIncome - expense,
    };
  }, [families, visits, work, transactions]);

  const upcomingVisits = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return visits
      .filter((visit) => visit.departure >= today)
      .sort((a, b) => a.arrival.localeCompare(b.arrival))
      .slice(0, 5);
  }, [visits]);

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Přehled
        </h1>

        <p className="text-slate-500">
          Aktuální stav správy chalupy.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <Card
          title="Aktivní rodiny"
          value={values.activeFamilies}
        />

        <Card
          title="Návštěvy"
          value={visits.length}
        />

        <Card
          title="Brigády"
          value={`${values.workHours} h`}
        />

        <Card
          title="Pokladna"
          value={`${values.balance.toLocaleString("cs-CZ")} Kč`}
        />

      </div>

      {/* NOVÁ KARTA AKTIVIT */}

      <ActivityCard />

      <section className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-semibold">
          Nejbližší návštěvy
        </h2>

        {upcomingVisits.length ? (

          <div className="divide-y">

            {upcomingVisits.map((visit) => (

              <div
                key={visit.id}
                className="flex items-center justify-between py-3"
              >

                <span className="font-medium">
                  {visit.family}
                </span>

                <span className="text-slate-600">
                  {visit.arrival} — {visit.departure}
                </span>

              </div>

            ))}

          </div>

        ) : (

          <p className="text-slate-500">
            Žádné nadcházející návštěvy.
          </p>

        )}

      </section>

    </div>
  );
}