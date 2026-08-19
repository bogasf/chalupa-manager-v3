import { useEffect, useState } from "react";
import {
  addInvestment,
  updateInvestment,
} from "../../services/investmentService";

const today = new Date().toISOString().split("T")[0];

const DEFAULT_FORM = {
  name: "",
  type: "investice",
  price: "",
  date: today,
  status: "planovano",
  paidBy: "",
  note: "",
};

export default function InvestmentForm({
  selectedInvestment,
  onSaved,
  onCancel,
}) {
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (selectedInvestment) {
      setForm({
        name: selectedInvestment.name || "",
        type: selectedInvestment.type || "investice",
        price:
          selectedInvestment.price !== undefined
            ? selectedInvestment.price
            : "",
        date: selectedInvestment.date || today,
        status: selectedInvestment.status || "planovano",
        paidBy: selectedInvestment.paidBy || "",
        note: selectedInvestment.note || "",
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [selectedInvestment]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Zadej název investice.");
      return;
    }

    const price = Number(form.price || 0);

    if (price < 0) {
      alert("Cena nemůže být záporná.");
      return;
    }

    const data = {
      name: form.name.trim(),
      type: form.type,
      price,
      date: form.date,
      status: form.status,
      paidBy: form.paidBy.trim(),
      note: form.note.trim(),
    };

    try {
      if (selectedInvestment) {
        await updateInvestment(
          selectedInvestment.id,
          data
        );
      } else {
        await addInvestment(data);
      }

      setForm(DEFAULT_FORM);
      onSaved?.();
    } catch (err) {
      console.error(err);
      alert("Investici se nepodařilo uložit.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl bg-white p-6 shadow"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          {selectedInvestment
            ? "✏️ Upravit investici"
            : "➕ Nová investice"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Evidence investic a oprav chalupy
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Název *
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Např. Ohřívač vody Dražice"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Typ
          </label>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="investice">Investice</option>
            <option value="oprava">Oprava</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Cena
          </label>

          <div className="relative">
            <input
              type="number"
              name="price"
              min="0"
              step="1"
              value={form.price}
              onChange={handleChange}
              placeholder="0"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              Kč
            </span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Datum
          </label>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Stav
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="planovano">Plánováno</option>
            <option value="probíhá">Probíhá</option>
            <option value="dokonceno">Dokončeno</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Kdo zaplatil
          </label>

          <input
            type="text"
            name="paidBy"
            value={form.paidBy}
            onChange={handleChange}
            placeholder="Např. společný účet"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Poznámka
        </label>

        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          rows={4}
          placeholder="Další informace k investici..."
          className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {selectedInvestment && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-100"
          >
            Zrušit
          </button>
        )}

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          {selectedInvestment
            ? "💾 Uložit změny"
            : "➕ Přidat investici"}
        </button>
      </div>
    </form>
  );
}