import { useEffect, useState } from "react";
import { APP_VERSION } from "../../config/version";
import { getSettings } from "../../services/settingsService";

export default function UpdateChecker() {
  const [update, setUpdate] = useState(null);

  useEffect(() => {
    checkVersion();
  }, []);

  async function checkVersion() {
    try {
      const settings = await getSettings();

      if (
        settings.appVersion &&
        settings.appVersion !== APP_VERSION
      ) {
        setUpdate({
          latest: settings.appVersion,
          changes: settings.latestChanges || "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  function reloadApp() {
    window.location.reload(true);
  }

  if (!update) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">

        <h2 className="text-2xl font-bold">
          🚀 Nová verze aplikace
        </h2>

        <p className="mt-4">
          Aktuální verze:
          <strong> {APP_VERSION}</strong>
        </p>

        <p>
          Dostupná verze:
          <strong> {update.latest}</strong>
        </p>

        <div className="mt-5 rounded-lg bg-slate-100 p-4">
          <strong>Co je nového</strong>

          <p className="mt-2 whitespace-pre-line">
            {update.changes}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={() => setUpdate(null)}
            className="rounded-lg border px-4 py-2"
          >
            Později
          </button>

          <button
            onClick={reloadApp}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white"
          >
            Aktualizovat
          </button>

        </div>

      </div>

    </div>
  );
}