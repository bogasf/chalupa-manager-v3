import { useEffect, useMemo, useState } from "react";
import {
  addTransaction,
  deleteTransaction,
  subscribeTransactions,
} from "../../services/financeService";
import { subscribeVisits } from "../../services/visitService";

const today = () => new Date().toISOString().slice(0, 10);

const money = (value) =>
  `${Number(value || 0).toLocaleString("cs-CZ")} Kč`;

export default function CashBookTab() {
  const [transactions, setTransactions] = useState([]);
  const [visits, setVisits] = useState([]);

  const [form, setForm] = useState({
    date: today(),
    type: "expense",
    amount: "",
    description: "",
  });

  useEffect(() => {
    const unsubscribeTransactions =
      subscribeTransactions(setTransactions);

    const unsubscribeVisits =
      subscribeVisits(setVisits);

    return () => {
      unsubscribeTransactions();
      unsubscribeVisits();
    };
  }, []);

  const totals = useMemo(() => {
    const visitIncome = visits
      .filter((item) => item.paid)
      .reduce(
        (sum, item) => sum + Number(item.total || 0),
        0
      );

    const income =
      visitIncome +
      transactions
        .filter((item) => item.type === "income")
        .reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );

    const expense = transactions
      .filter((item) => item.type === "expense")
      .reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions, visits]);

  async function submit(e) {
    e.preventDefault();

    if (
      !Number(form.amount) ||
      !form.description.trim()
    ) {
      return alert("Doplňte částku a popis.");
    }

    await addTransaction({
      ...form,
      amount: Number(form.amount),
    });

    setForm({
      date: today(),
      type: "expense",
      amount: "",
      description: "",
    });
  }

  return (
    <div className="space-y-6">

      <div className="grid gap-4 md:grid-cols-3">

        <Stat
          title="Příjmy"
          value={money(totals.income)}
          color="text-emerald-700"
        />

        <Stat
          title="Výdaje"
          value={money(totals.expense)}
          color="text-red-700"
        />

        <Stat
          title="Zůstatek"
          value={money(totals.balance)}
          color="text-blue-700"
        />

      </div>

      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-semibold">
          Nová položka
        </h2>

        <form
          onSubmit={submit}
          className="grid gap-3 md:grid-cols-5"
        >

          <input
            type="date"
            className="rounded border p-3"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
          />

          <select
            className="rounded border p-3"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
              })
            }
          >
            <option value="expense">
              Výdaj
            </option>

            <option value="income">
              Příjem
            </option>
          </select>

          <input
            type="number"
            min="1"
            step="1"
            placeholder="Částka"
            className="rounded border p-3"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value,
              })
            }
          />

          <input
            placeholder="Popis"
            className="rounded border p-3"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <button className="rounded bg-blue-600 px-4 font-semibold text-white">
            Přidat
          </button>

        </form>

      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-3 text-left">
                Datum
              </th>

              <th className="p-3 text-left">
                Popis
              </th>

              <th className="p-3 text-left">
                Typ
              </th>

              <th className="p-3 text-right">
                Částka
              </th>

              <th />

            </tr>

          </thead>

          <tbody>

            {transactions.map((item) => (

              <tr
                key={item.id}
                className="border-t"
              >

                <td className="p-3">
                  {item.date}
                </td>

                <td className="p-3">
                  {item.description}
                </td>

                <td className="p-3">
                  {item.type === "income"
                    ? "Příjem"
                    : "Výdaj"}
                </td>

                <td
                  className={`p-3 text-right font-medium ${
                    item.type === "income"
                      ? "text-emerald-700"
                      : "text-red-700"
                  }`}
                >
                  {item.type === "income"
                    ? "+"
                    : "-"}{" "}
                  {money(item.amount)}
                </td>

                <td className="p-3">

                  <button
                    onClick={() =>
                      window.confirm(
                        "Smazat položku?"
                      ) &&
                      deleteTransaction(item.id)
                    }
                    className="text-red-700 hover:underline"
                  >
                    Smazat
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

function Stat({ title, value, color }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-slate-500">{title}</p>

      <p className={`mt-1 text-2xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}