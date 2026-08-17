import { useEffect, useState } from "react";
import { getFamilies } from "../../services/familyService";
import {
  addPurchase,
  deletePurchase,
  subscribePurchases,
  updatePurchase,
} from "../../services/purchaseService";

const blank = {
  familyId: "",
  family: "",
  date: new Date().toISOString().slice(0, 10),
  name: "",
  amount: "",
  note: "",
};

export default function Purchases() {
  const [families, setFamilies] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    async function loadFamilies() {
      try {
        const data = await getFamilies();
        setFamilies(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadFamilies();

    const unsubscribe = subscribePurchases(setPurchases);

    return unsubscribe;
  }, []);

  async function submit(e) {
    e.preventDefault();

    if (!form.familyId) {
      alert("Vyberte rodinu.");
      return;
    }

    if (!form.name.trim()) {
      alert("Zadejte název nákupu.");
      return;
    }

    if (!Number(form.amount) || Number(form.amount) <= 0) {
      alert("Zadejte částku.");
      return;
    }

    const data = {
      ...form,
      amount: Number(form.amount),
    };

    try {
      if (editing) {
        await updatePurchase(editing, data);
      } else {
        await addPurchase(data);
      }

      setForm(blank);
      setEditing(null);
    } catch (error) {
      console.error(error);
      alert("Nákup se nepodařilo uložit.");
    }
  }

  function editPurchase(purchase) {
    setEditing(purchase.id);

    setForm({
      familyId: purchase.familyId ?? "",
      family: purchase.family ?? "",
      date: purchase.date ?? "",
      name: purchase.name ?? "",
      amount: purchase.amount ?? "",
      note: purchase.note ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function removePurchase(purchase) {
    if (
      !window.confirm(
        `Opravdu chcete smazat nákup "${purchase.name}"?`
      )
    ) {
      return;
    }

    try {
      await deletePurchase(purchase.id);
    } catch (error) {
      console.error(error);
      alert("Nákup se nepodařilo smazat.");
    }
  }

  const totalPurchases = purchases.reduce(
    (sum, purchase) => sum + Number(purchase.amount || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">🛒 Nákupy</h1>

        <p className="text-slate-500">
          Nákupy rodin, které se započítají jako kredit do vyúčtování.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          {editing ? "Upravit nákup" : "Nový nákup"}
        </h2>

        <form
          onSubmit={submit}
          className="grid gap-4 md:grid-cols-2"
        >
          <select
            required
            className="rounded border p-3"
            value={form.familyId}
            onChange={(e) => {
              const family = families.find(
                (item) => item.id === e.target.value
              );

              setForm({
                ...form,
                familyId: e.target.value,
                family: family?.name ?? "",
              });
            }}
          >
            <option value="">Rodina</option>

            {families
              .filter((item) => item.active !== false)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>

          <input
            required
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

          <input
            required
            type="text"
            className="rounded border p-3"
            placeholder="Název nákupu"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            required
            type="number"
            min="1"
            step="1"
            className="rounded border p-3"
            placeholder="Částka v Kč"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value,
              })
            }
          />

          <textarea
            rows="2"
            className="rounded border p-3 md:col-span-2"
            placeholder="Poznámka"
            value={form.note}
            onChange={(e) =>
              setForm({
                ...form,
                note: e.target.value,
              })
            }
          />

          <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
            <button
              type="submit"
              className="rounded bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {editing ? "Uložit změny" : "Přidat nákup"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(blank);
                }}
                className="rounded border px-5 py-3"
              >
                Zrušit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <span className="font-semibold">
            Celkem nákupy
          </span>

          <span className="text-xl font-bold text-green-600">
            {totalPurchases.toLocaleString("cs-CZ")} Kč
          </span>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {purchases.length ? (
          purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="rounded-lg border bg-white p-3 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">
                    🛒 {purchase.name}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {purchase.family}
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    📅 {purchase.date}
                  </div>
                </div>

                <div className="font-bold text-green-600">
                  +{Number(purchase.amount).toLocaleString("cs-CZ")} Kč
                </div>
              </div>

              {purchase.note && (
                <div className="mt-2 text-sm text-slate-600">
                  {purchase.note}
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => editPurchase(purchase)}
                  className="flex-1 rounded bg-blue-600 py-2 text-sm text-white"
                >
                  Upravit
                </button>

                <button
                  type="button"
                  onClick={() => removePurchase(purchase)}
                  className="flex-1 rounded bg-red-600 py-2 text-sm text-white"
                >
                  Smazat
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg bg-white p-6 text-center text-slate-500 shadow">
            Zatím nejsou žádné nákupy.
          </div>
        )}
      </div>

      <div className="hidden overflow-x-auto rounded-xl bg-white shadow md:block">
        {purchases.length ? (
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Datum</th>
                <th className="p-3 text-left">Rodina</th>
                <th className="p-3 text-left">Nákup</th>
                <th className="p-3 text-right">Částka</th>
                <th className="p-3 text-left">Poznámka</th>
                <th className="p-3 text-center">Akce</th>
              </tr>
            </thead>

            <tbody>
              {purchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="border-t"
                >
                  <td className="p-3">
                    {purchase.date}
                  </td>

                  <td className="p-3 font-medium">
                    {purchase.family}
                  </td>

                  <td className="p-3">
                    {purchase.name}
                  </td>

                  <td className="p-3 text-right font-semibold text-green-600">
                    +{Number(purchase.amount).toLocaleString("cs-CZ")} Kč
                  </td>

                  <td className="p-3">
                    {purchase.note}
                  </td>

                  <td className="whitespace-nowrap p-3 text-center">
                    <button
                      type="button"
                      onClick={() => editPurchase(purchase)}
                      className="mr-3 text-blue-700 hover:underline"
                    >
                      Upravit
                    </button>

                    <button
                      type="button"
                      onClick={() => removePurchase(purchase)}
                      className="text-red-700 hover:underline"
                    >
                      Smazat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-slate-500">
            Zatím nejsou žádné nákupy.
          </div>
        )}
      </div>
    </div>
  );
}