import { useEffect, useState } from "react";

import {
  addFamily,
  deleteFamily,
  subscribeFamilies,
  updateFamily,
} from "../../services/familyService";

import {
  getSettings,
  updateSettings,
} from "../../services/settingsService";

const DEFAULT_SETTINGS = {
  pricePerNight: 312,
  heatingPrice: 100,
  workHourRate: 150,
  guestRoomPrice: 100,
  guestRoomHeating: 100,
  adminPin: "",
};

export default function Settings() {
  const [families, setFamilies] = useState([]);

  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [saving, setSaving] = useState(false);

  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState("");
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeFamilies(setFamilies);
    return unsubscribe;
  }, []);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await getSettings();

      setSettings({
        ...DEFAULT_SETTINGS,
        ...data,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function saveSettings() {
    try {
      setSaving(true);

      await updateSettings({
        pricePerNight: Number(settings.pricePerNight),
        heatingPrice: Number(settings.heatingPrice),
        workHourRate: Number(settings.workHourRate),
        guestRoomPrice: Number(settings.guestRoomPrice),
        guestRoomHeating: Number(settings.guestRoomHeating),
      });

      alert("Nastavení bylo uloženo.");
    } catch (err) {
      console.error(err);
      alert("Nastavení se nepodařilo uložit.");
    } finally {
      setSaving(false);
    }
  }

  async function submitFamily(e) {
    e.preventDefault();

    const value = name.trim();

    if (!value) return;

    if (editing) {
      await updateFamily(editing, {
        name: value,
      });
    } else {
      await addFamily({
        name: value,
        active: true,
      });
    }

    setEditing(null);
    setName("");
  }

  function changeSetting(e) {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  function unlockSettings() {
    if (pin === String(settings.adminPin)) {
      setUnlocked(true);
      setPin("");
      setPinError("");
    } else {
      setPinError("Neplatný PIN.");
    }
  }

  function lockSettings() {
    setUnlocked(false);
    setPin("");
    setPinError("");
  }
    return (
    <>
      {!unlocked ? (

        <div className="mx-auto mt-10 max-w-md rounded-xl bg-white p-8 shadow">

          <h1 className="mb-2 text-center text-3xl font-bold">
            🔒 Nastavení
          </h1>

          <p className="mb-6 text-center text-slate-500">
            Pro vstup do nastavení zadejte PIN správce.
          </p>

          <label className="mb-2 block font-medium">
            PIN
          </label>

          <div className="flex gap-2">

            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setPinError("");
              }}
              className="flex-1 rounded-lg border p-3"
              placeholder="Zadejte PIN"
            />

            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="rounded-lg border px-4 hover:bg-slate-100"
            >
              {showPin ? "🙈" : "👁"}
            </button>

          </div>

          {pinError && (
            <div className="mt-3 rounded-lg bg-red-50 p-3 text-red-600">
              {pinError}
            </div>
          )}

          <button
            type="button"
            onClick={unlockSettings}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Odemknout
          </button>

        </div>

      ) : (

        <div className="space-y-8">

          <div className="flex items-start justify-between">

            <div>

              <h1 className="text-3xl font-bold">
                Nastavení aplikace
              </h1>

              <p className="mt-2 text-slate-500">
                Nastavení cen a správa rodin.
              </p>

            </div>

            <button
              type="button"
              onClick={lockSettings}
              className="rounded-lg border border-red-300 px-4 py-2 font-medium text-red-600 hover:bg-red-50"
            >
              🔒 Uzamknout
            </button>

          </div>

          <div className="rounded-xl bg-white p-6 shadow">

            <h2 className="mb-6 text-xl font-semibold">
              🏡 Ceník chalupy
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium">
                  Cena za noc
                </label>

                <input
                  type="number"
                  name="pricePerNight"
                  value={settings.pricePerNight}
                  onChange={changeSetting}
                  className="w-full rounded-lg border p-3"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Cena topení
                </label>

                <input
                  type="number"
                  name="heatingPrice"
                  value={settings.heatingPrice}
                  onChange={changeSetting}
                  className="w-full rounded-lg border p-3"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Brigáda Kč / hod
                </label>

                <input
                  type="number"
                  name="workHourRate"
                  value={settings.workHourRate}
                  onChange={changeSetting}
                  className="w-full rounded-lg border p-3"
                />

              </div>

            </div>

          </div>

          <div className="rounded-xl bg-white p-6 shadow">

            <h2 className="mb-6 text-xl font-semibold">
              🛏 Návštěvnický pokoj
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium">
                  Cena za noc
                </label>

                <input
                  type="number"
                  name="guestRoomPrice"
                  value={settings.guestRoomPrice}
                  onChange={changeSetting}
                  className="w-full rounded-lg border p-3"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Cena topení
                </label>

                <input
                  type="number"
                  name="guestRoomHeating"
                  value={settings.guestRoomHeating}
                  onChange={changeSetting}
                  className="w-full rounded-lg border p-3"
                />

              </div>

            </div>

            <div className="mt-8">

              <button
                onClick={saveSettings}
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-slate-400"
              >
                {saving ? "Ukládám..." : "💾 Uložit nastavení"}
              </button>

            </div>

          </div>
                    <div className="rounded-xl bg-white shadow p-6">

            <h2 className="text-xl font-semibold mb-6">
              👨‍👩‍👧‍👦 Rodiny
            </h2>

            <form
              onSubmit={submitFamily}
              className="flex flex-wrap gap-3"
            >

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Název rodiny"
                className="flex-1 rounded-lg border p-3 min-w-64"
              />

              <button
                className="rounded-lg bg-blue-600 px-5 text-white font-semibold"
              >
                {editing ? "Uložit" : "Přidat rodinu"}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setName("");
                  }}
                  className="rounded-lg border px-5"
                >
                  Zrušit
                </button>
              )}

            </form>

            <div className="mt-8 overflow-hidden rounded-xl border">

              <table className="w-full">

                <thead className="bg-slate-100">

                  <tr>

                    <th className="p-3 text-left">
                      Rodina
                    </th>

                    <th className="p-3 text-left">
                      Stav
                    </th>

                    <th className="p-3 text-right">
                      Akce
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {families.map((family) => (

                    <tr
                      key={family.id}
                      className="border-t"
                    >

                      <td className="p-3 font-medium">
                        {family.name}
                      </td>

                      <td className="p-3">

                        <button
                          onClick={() =>
                            updateFamily(family.id, {
                              active: family.active === false,
                            })
                          }
                          className={`rounded-full px-3 py-1 text-sm ${
                            family.active === false
                              ? "bg-slate-200"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {family.active === false
                            ? "Neaktivní"
                            : "Aktivní"}
                        </button>

                      </td>

                      <td className="p-3 text-right">

                        <button
                          onClick={() => {
                            setEditing(family.id);
                            setName(family.name);
                          }}
                          className="mr-4 text-blue-700 hover:underline"
                        >
                          Upravit
                        </button>

                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Opravdu chcete rodinu odstranit?"
                              )
                            ) {
                              deleteFamily(family.id);
                            }
                          }}
                          className="text-red-700 hover:underline"
                        >
                          Smazat
                        </button>

                      </td>

                    </tr>

                  ))}

                  {families.length === 0 && (

                    <tr>

                      <td
                        colSpan={3}
                        className="p-8 text-center text-slate-500"
                      >
                        Zatím není přidaná žádná rodina.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">

            <h2 className="mb-4 text-xl font-semibold">
              Přehled nastavení
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              <div className="rounded-lg bg-white p-4 shadow-sm">

                <div className="text-sm text-slate-500">
                  Chalupa
                </div>

                <div className="mt-3 flex justify-between">
                  <span>Cena za noc</span>
                  <strong>{Number(settings.pricePerNight).toLocaleString("cs-CZ")} Kč</strong>
                </div>

                <div className="mt-2 flex justify-between">
                  <span>Topení</span>
                  <strong>{Number(settings.heatingPrice).toLocaleString("cs-CZ")} Kč</strong>
                </div>

                <div className="mt-2 flex justify-between">
                  <span>Brigáda / hod</span>
                  <strong>{Number(settings.workHourRate).toLocaleString("cs-CZ")} Kč</strong>
                </div>

              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm">

                <div className="text-sm text-slate-500">
                  Návštěvnický pokoj
                </div>

                <div className="mt-3 flex justify-between">
                  <span>Cena za noc</span>
                  <strong>{Number(settings.guestRoomPrice).toLocaleString("cs-CZ")} Kč</strong>
                </div>

                <div className="mt-2 flex justify-between">
                  <span>Topení</span>
                  <strong>{Number(settings.guestRoomHeating).toLocaleString("cs-CZ")} Kč</strong>
                </div>

              </div>

            </div>

          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">

            <h2 className="mb-4 text-xl font-semibold">
              Informace
            </h2>

            <ul className="space-y-2 text-slate-700">

              <li>
                ✅ Ceny se ukládají do Firestore (<strong>settings/app</strong>)
              </li>

              <li>
                ✅ Změny cen se projeví při vytváření nových rezervací.
              </li>

              <li>
                ✅ Rodiny lze přidávat, upravovat, deaktivovat i mazat.
              </li>

              <li>
                ✅ Nastavení je společné pro všechny uživatele aplikace.
              </li>

            </ul>

          </div>

        </div>

      )}

    </>

  );
}