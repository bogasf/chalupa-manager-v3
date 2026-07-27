import { useEffect, useState } from "react";
import {
  addFixedCost,
  updateFixedCost,
} from "../../services/fixedCostService";

const empty = {
  name: "",
  from: "",
  to: "",
  price: "",
  note: "",
};

export default function FixedCostForm({
  selectedCost,
  onSaved,
  onCancel,
}) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(
      selectedCost
        ? { ...empty, ...selectedCost }
        : empty
    );
  }, [selectedCost]);

  function change(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      return alert("Zadejte název.");
    }

    if (!form.from || !form.to) {
      return alert("Vyplňte období.");
    }

    if (form.to < form.from) {
      return alert("Datum Do nesmí být dříve než Od.");
    }

    if (!Number(form.price)) {
      return alert("Zadejte cenu.");
    }

    setSaving(true);

    try {
      const data = {
        ...form,
        price: Number(form.price),
      };

      if (selectedCost) {
        await updateFixedCost(selectedCost.id, data);
      } else {
        await addFixedCost(data);
      }

      setForm(empty);
      onSaved?.();

    } catch (err) {
      console.error(err);
      alert("Nepodařilo se uložit položku.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <h2 className="mb-5 text-xl font-semibold">
        {selectedCost
          ? "Upravit položku"
          : "Nový fixní náklad"}
      </h2>

      <form
        onSubmit={submit}
        className="space-y-5"
      >

        <label className="block">

          Název

          <input
            className="mt-1 w-full rounded border p-3"
            value={form.name}
            onChange={(e) =>
              change("name", e.target.value)
            }
          />

        </label>

        <div className="grid gap-4 sm:grid-cols-2">

          <label>

            Od

            <input
              type="date"
              className="mt-1 w-full rounded border p-3"
              value={form.from}
              onChange={(e) =>
                change("from", e.target.value)
              }
            />

          </label>

          <label>

            Do

            <input
              type="date"
              className="mt-1 w-full rounded border p-3"
              value={form.to}
              onChange={(e) =>
                change("to", e.target.value)
              }
            />

          </label>

        </div>

        <label>

          Cena

          <input
            type="number"
            className="mt-1 w-full rounded border p-3"
            value={form.price}
            onChange={(e) =>
              change("price", e.target.value)
            }
          />

        </label>

        <label>

          Poznámka

          <textarea
            rows={3}
            className="mt-1 w-full rounded border p-3"
            value={form.note}
            onChange={(e) =>
              change("note", e.target.value)
            }
          />

        </label>

        <div className="flex gap-3">

          <button
            disabled={saving}
            className="rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {saving
              ? "Ukládám..."
              : "Uložit"}
          </button>

          {selectedCost && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded bg-slate-200 px-6 py-3"
            >
              Zrušit
            </button>
          )}

        </div>

      </form>

    </div>
  );
}