import { useEffect, useState } from "react";
import {
  getSettings,
  saveSettings,
} from "../../services/settingsService";

const DEFAULT_SETTINGS = {
  visitNightPrice: 312,
  visitHeatingPrice: 100,
  workHourRate: 150,

  guestRoomPrice: 800,
  guestRoomHeatingPrice: 250,
};

export default function PricingSettings() {
  const [settings, setSettings] =
    useState(DEFAULT_SETTINGS);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSettings();

        if (data) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...data,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  function change(name, value) {
    setSettings((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  async function save() {
    try {
      setSaving(true);

      await saveSettings(settings);

      alert("✅ Nastavení bylo uloženo.");
    } catch (err) {
      console.error(err);
      alert("Nepodařilo se uložit nastavení.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        ⚙️ Ceník
      </h2>

      <div className="grid gap-8 md:grid-cols-2">

        <div>

          <h3 className="mb-4 text-lg font-semibold">
            🏡 Chalupa
          </h3>

          <div className="space-y-4">

            <Input
              label="Cena za noc"
              value={settings.visitNightPrice}
              onChange={(v) =>
                change("visitNightPrice", v)
              }
            />

            <Input
              label="Topení"
              value={settings.visitHeatingPrice}
              onChange={(v) =>
                change("visitHeatingPrice", v)
              }
            />

            <Input
              label="Brigáda Kč / hod"
              value={settings.workHourRate}
              onChange={(v) =>
                change("workHourRate", v)
              }
            />

          </div>

        </div>

        <div>

          <h3 className="mb-4 text-lg font-semibold">
            🛏️ Návštěvnický pokoj
          </h3>

          <div className="space-y-4">

            <Input
              label="Pevná cena"
              value={settings.guestRoomPrice}
              onChange={(v) =>
                change("guestRoomPrice", v)
              }
            />

            <Input
              label="Příplatek za topení"
              value={settings.guestRoomHeatingPrice}
              onChange={(v) =>
                change("guestRoomHeatingPrice", v)
              }
            />

          </div>

        </div>

      </div>

      <div className="mt-8">

        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 disabled:bg-slate-400"
        >
          {saving
            ? "Ukládám..."
            : "💾 Uložit nastavení"}
        </button>

      </div>

    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="mb-1 block text-sm font-medium">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg border p-3"
      />

    </div>
  );
}