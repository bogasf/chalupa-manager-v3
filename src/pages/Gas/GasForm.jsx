import { useState } from "react";
import { addGasReading } from "../../services/gasService";

export default function GasForm() {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    date: today,
    upper: "",
    lower: "",
  });

  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.upper === "" || form.lower === "") {
      alert("Vyplň obě nádrže.");
      return;
    }

    setSaving(true);

    try {
      await addGasReading({
        date: form.date,
        upper: Number(form.upper),
        lower: Number(form.lower),
      });

      alert("Stav plynu uložen.");

      setForm({
        date: today,
        upper: "",
        lower: "",
      });
    } catch (err) {
      console.error(err);
      alert("Nepodařilo se uložit.");
    }

    setSaving(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-white p-6 shadow space-y-5"
    >
      <h2 className="text-xl font-bold">
        🔥 Nový odečet
      </h2>

      <div>
        <label className="mb-1 block text-sm text-slate-500">
          Datum
        </label>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-500">
          Horní nádrž (%)
        </label>

        <input
          type="number"
          min="0"
          max="100"
          name="upper"
          value={form.upper}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          placeholder="Např. 82"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-500">
          Dolní nádrž (%)
        </label>

        <input
          type="number"
          min="0"
          max="100"
          name="lower"
          value={form.lower}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          placeholder="Např. 68"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
      >
        {saving ? "Ukládám..." : "Uložit stav plynu"}
      </button>
    </form>
  );
}