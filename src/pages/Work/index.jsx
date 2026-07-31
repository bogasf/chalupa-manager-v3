import { useEffect, useState } from "react";
import { getFamilies } from "../../services/familyService";
import { getWorkTypes } from "../../services/workTypeService";
import {
  addWorkEntry,
  deleteWorkEntry,
  subscribeWorkEntries,
  updateWorkEntry,
} from "../../services/workService";
import { addActivity } from "../../services/activityService";
import { uploadWorkPhotos } from "../../services/photoService";
import PhotoUploader from "../../components/work/PhotoUploader";
import PhotoGallery from "../../components/work/PhotoGallery";

const blank = {
  familyId: "",
  family: "",
  workTypeId: "",
  workType: "",
  customWork: "",
  date: new Date().toISOString().slice(0, 10),
  hours: "",
  note: "",
};

export default function Work() {
  const [families, setFamilies] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [familyData, workTypeData] = await Promise.all([
          getFamilies(),
          getWorkTypes(),
        ]);

        setFamilies(familyData);
        setWorkTypes(workTypeData);
      } catch (error) {
        console.error(error);
      }
    }

    load();

    return subscribeWorkEntries(setEntries);
  }, []);

  async function submit(e) {
    e.preventDefault();

    if (!form.familyId) {
      return alert("Vyberte rodinu.");
    }

    if (!form.workTypeId) {
      return alert("Vyberte typ práce.");
    }

    if (!Number(form.hours)) {
      return alert("Zadejte počet hodin.");
    }

    const data = {
      ...form,
      hours: Number(form.hours),
      work:
        form.workType === "Jiné"
          ? form.customWork
          : form.workType,
    };

    try {
      if (editing) {
        await updateWorkEntry(editing, {
          ...data,
          photos: entries.find((e) => e.id === editing)?.photos ?? [],
        });

        await addActivity({
          type: "work",
          icon: "✏️",
          title: "Brigáda upravena",
          description: data.work,
          user: data.family,
        });
      } else {
        const docRef = await addWorkEntry({
          ...data,
          photos: [],
        });

        if (photos.length) {
          const uploaded = await uploadWorkPhotos(
            docRef.id,
            photos
          );

          await updateWorkEntry(docRef.id, {
            photos: uploaded,
          });
        }

        await addActivity({
          type: "work",
          icon: "🔨",
          title: "Nová brigáda",
          description: data.work,
          user: data.family,
        });
      }

      setForm(blank);
      setPhotos([]);
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Nepodařilo se uložit brigádu.");
    }
  }

  function edit(entry) {
    setEditing(entry.id);

    setForm({
      familyId: entry.familyId,
      family: entry.family,
      workTypeId: entry.workTypeId ?? "",
      workType: entry.workType ?? "",
      customWork: entry.customWork ?? "",
      date: entry.date,
      hours: entry.hours,
      note: entry.note ?? "",
    });

    setPhotos([]);
  }

  async function remove(entry) {
    if (!window.confirm("Opravdu chcete smazat brigádu?")) {
      return;
    }

    try {
      await deleteWorkEntry(entry.id);

      await addActivity({
        type: "work",
        icon: "🗑️",
        title: "Brigáda smazána",
        description: entry.work,
        user: entry.family,
      });
    } catch (err) {
      console.error(err);
      alert("Nepodařilo se smazat brigádu.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Brigády</h1>

        <p className="text-slate-500">
          Evidence odpracovaných hodin jednotlivých rodin.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          {editing ? "Upravit brigádu" : "Nový záznam"}
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

          <select
            required
            className="rounded border p-3"
            value={form.workTypeId}
            onChange={(e) => {
              const work = workTypes.find(
                (item) => item.id === e.target.value
              );

              setForm({
                ...form,
                workTypeId: e.target.value,
                workType: work?.name ?? "",
              });
            }}
          >
            <option value="">Typ práce</option>

            {workTypes
              .filter((item) => item.active !== false)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>

          {form.workType === "Jiné" && (
            <input
              className="rounded border p-3 md:col-span-2"
              placeholder="Popis práce"
              value={form.customWork}
              onChange={(e) =>
                setForm({
                  ...form,
                  customWork: e.target.value,
                })
              }
            />
          )}

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
            min="0.5"
            step="0.5"
            type="number"
            className="rounded border p-3"
            placeholder="Počet hodin"
            value={form.hours}
            onChange={(e) =>
              setForm({
                ...form,
                hours: e.target.value,
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

          <PhotoUploader
            photos={photos}
            setPhotos={setPhotos}
          />

          <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
            <button className="rounded bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
              {editing ? "Uložit změny" : "Přidat brigádu"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(blank);
                  setPhotos([]);
                }}
                className="rounded border px-5 py-3"
              >
                Zrušit
              </button>
            )}
          </div>
        </form>
      </div>
            {/* MOBIL */}
      <div className="space-y-4 md:hidden">
        {entries.length ? (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl border bg-white p-4 shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-bold">
                    🔨 {entry.work}
                  </div>

                  <div className="mt-2 space-y-1 text-sm text-slate-600">
                    <div>📅 {entry.date}</div>
                    <div>👨‍👩‍👧 {entry.family}</div>
                    <div>⏱ {entry.hours} hod.</div>
                  </div>
                </div>

                {entry.photos?.length > 0 && (
                  <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                    📷 {entry.photos.length}
                  </div>
                )}
              </div>

              {entry.note && (
                <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
                  📝 {entry.note}
                </div>
              )}

              {entry.photos?.length > 0 && (
                <div className="mt-4">
                  <PhotoGallery photos={entry.photos} />
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => edit(entry)}
                  className="flex-1 rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
                >
                  ✏️ Upravit
                </button>

                <button
                  onClick={() => remove(entry)}
                  className="flex-1 rounded-lg bg-red-600 py-2 font-medium text-white hover:bg-red-700"
                >
                  🗑 Smazat
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow">
            Zatím nejsou zapsané žádné brigády.
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden overflow-x-auto rounded-xl bg-white shadow md:block">
        {entries.length ? (
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Datum</th>
                <th className="p-3 text-left">Rodina</th>
                <th className="p-3 text-left">Práce</th>
                <th className="p-3 text-right">Hodin</th>
                <th className="p-3 text-left">Poznámka</th>
                <th className="p-3 text-center">📷</th>
                <th className="p-3 text-center">Akce</th>
              </tr>
            </thead>

            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-t align-top"
                >
                  <td className="p-3">
                    {entry.date}
                  </td>

                  <td className="p-3 font-medium">
                    {entry.family}
                  </td>

                  <td className="p-3">
                    {entry.work}
                  </td>

                  <td className="p-3 text-right">
                    {entry.hours}
                  </td>

                  <td className="p-3">
                    {entry.note}
                  </td>

                  <td className="p-3">
                    {entry.photos?.length ? (
                      <PhotoGallery
                        photos={entry.photos}
                      />
                    ) : (
                      <div className="text-center text-slate-400">
                        —
                      </div>
                    )}
                  </td>

                  <td className="p-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => edit(entry)}
                      className="mr-3 text-blue-700 hover:underline"
                    >
                      Upravit
                    </button>

                    <button
                      onClick={() => remove(entry)}
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
            Zatím nejsou zapsané žádné brigády.
          </div>
        )}
      </div>
    </div>
  );
}