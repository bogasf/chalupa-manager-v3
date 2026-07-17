import { useEffect, useState } from "react";
import { addVisit, updateVisit } from "../../services/visitService";
import { getFamilies } from "../../services/familyService";
import { getSettings } from "../../services/settingsService";
import { addActivity } from "../../services/activityService";

const empty = {
  familyId: "",
  family: "",
  arrival: "",
  departure: "",
  heating: false,
  paid: false,
  note: "",
};

export default function VisitForm({
  selectedVisit,
  onSaved,
  onCancel,
}) {
  const [families, setFamilies] = useState([]);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    pricePerNight: 350,
    heatingPrice: 100,
  });

  const [form, setForm] = useState(empty);

  useEffect(() => {
    async function load() {
      try {
        const familyData = await getFamilies();
        setFamilies(familyData);

        const appSettings = await getSettings();
        setSettings(appSettings);
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);

  useEffect(() => {
    setForm(
      selectedVisit
        ? { ...empty, ...selectedVisit }
        : empty
    );
  }, [selectedVisit]);

  const nights =
    form.arrival && form.departure
      ? Math.max(
          0,
          Math.floor(
            (new Date(`${form.departure}T00:00:00`) -
              new Date(`${form.arrival}T00:00:00`)) /
              86400000
          )
        )
      : 0;

  const total =
    nights * settings.pricePerNight +
    (form.heating ? settings.heatingPrice : 0);

  function change(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submit(event) {
    event.preventDefault();

    if (!form.familyId) {
      return alert("Vyberte rodinu.");
    }

    if (!form.arrival || !form.departure) {
      return alert(
        "Vyplňte datum příjezdu i odjezdu."
      );
    }

    if (form.departure < form.arrival) {
      return alert(
        "Datum odjezdu nesmí být dříve než příjezd."
      );
    }

    if (!nights) {
      return alert(
        "Pobyt musí mít alespoň jednu noc."
      );
    }

    const data = {
      ...form,
      nights,
      pricePerNight: settings.pricePerNight,
      heatingPrice: form.heating
        ? settings.heatingPrice
        : 0,
      total,
    };

    setSaving(true);

    try {
      if (selectedVisit) {
        await updateVisit(selectedVisit.id, data);

        await addActivity({
          type: "visit",
          icon: "✏️",
          title: "Návštěva upravena",
          description: `${data.arrival} – ${data.departure}`,
          user: data.family,
        });
      } else {
        await addVisit(data);

        await addActivity({
          type: "visit",
          icon: "📅",
          title: "Nová návštěva",
          description: `${data.arrival} – ${data.departure}`,
          user: data.family,
        });
      }

      setForm(empty);

      onSaved?.();

    } catch (error) {
      console.error(error);
      alert("Návštěvu se nepodařilo uložit.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <div className="mb-5 flex items-center justify-between">

        <h2 className="text-xl font-semibold">
          {selectedVisit
            ? "Upravit návštěvu"
            : "Nová návštěva"}
        </h2>

        {selectedVisit && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-slate-600 hover:underline"
          >
            Zrušit úpravy
          </button>
        )}

      </div>

      <form
        onSubmit={submit}
        className="space-y-5"
      >

        <label className="block font-medium">

          Rodina

          <select
            required
            className="mt-1 w-full rounded border p-3"
            value={form.familyId}
            onChange={(e) => {
              const family = families.find(
                (item) =>
                  item.id === e.target.value
              );

              setForm((current) => ({
                ...current,
                familyId: e.target.value,
                family: family?.name ?? "",
              }));
            }}
          >
            <option value="">
              — vyberte rodinu —
            </option>

            {families
              .filter(
                (family) =>
                  family.active !== false
              )
              .map((family) => (
                <option
                  key={family.id}
                  value={family.id}
                >
                  {family.name}
                </option>
              ))}

          </select>

        </label>

        <div className="grid gap-4 sm:grid-cols-2">

          <label className="font-medium">

            Příjezd

            <input
              required
              type="date"
              className="mt-1 w-full rounded border p-3"
              value={form.arrival}
              onChange={(e) =>
                change(
                  "arrival",
                  e.target.value
                )
              }
            />

          </label>

          <label className="font-medium">

            Odjezd

            <input
              required
              type="date"
              className="mt-1 w-full rounded border p-3"
              value={form.departure}
              onChange={(e) =>
                change(
                  "departure",
                  e.target.value
                )
              }
            />

          </label>

        </div>

        <div className="grid gap-4 sm:grid-cols-3">

          <Info
            label="Počet nocí"
            value={nights}
          />

          <Info
            label="Cena za noc"
            value={`${settings.pricePerNight} Kč`}
          />

          <Info
            label="Celkem"
            value={`${total.toLocaleString(
              "cs-CZ"
            )} Kč`}
          />

        </div>

        <div className="flex flex-wrap gap-6">

          <label className="flex items-center gap-2">

            <input
              type="checkbox"
              checked={form.heating}
              onChange={(e) =>
                change(
                  "heating",
                  e.target.checked
                )
              }
            />

            Topení (+{settings.heatingPrice} Kč)

          </label>

          <label className="flex items-center gap-2">

            <input
              type="checkbox"
              checked={form.paid}
              onChange={(e) =>
                change(
                  "paid",
                  e.target.checked
                )
              }
            />

            Zaplaceno

          </label>

        </div>

        <label className="block font-medium">

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

        <button
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving
            ? "Ukládám..."
            : selectedVisit
            ? "Uložit změny"
            : "Uložit návštěvu"}
        </button>

      </form>

    </div>
  );
}

function Info({ label, value }) {
  return (
    <label className="font-medium">

      {label}

      <output className="mt-1 block rounded border bg-slate-50 p-3 font-normal">
        {value}
      </output>

    </label>
  );
}