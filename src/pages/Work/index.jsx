import { useEffect, useState } from "react";
import { getFamilies } from "../../services/familyService";
import { getWorkTypes } from "../../services/workTypeService";
import {
  addWorkEntry,
  deleteWorkEntry,
  subscribeWorkEntries,
  updateWorkEntry,
} from "../../services/workService";

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

    if (editing) {
      await updateWorkEntry(editing, data);
    } else {
      await addWorkEntry(data);
    }

    setForm(blank);
    setEditing(null);
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
                <option
                  key={item.id}
                  value={item.id}
                >
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
                <option
                  key={item.id}
                  value={item.id}
                >
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

          <div className="flex gap-3 md:col-span-2">

            <button
              className="rounded bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {editing ? "Uložit změny" : "Přidat brigádu"}
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

      <div className="overflow-x-auto rounded-xl bg-white shadow">

        {entries.length ? (

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="p-3 text-left">
                  Datum
                </th>

                <th className="p-3 text-left">
                  Rodina
                </th>

                <th className="p-3 text-left">
                  Práce
                </th>

                <th className="p-3 text-right">
                  Hodin
                </th>

                <th className="p-3 text-left">
                  Poznámka
                </th>

                <th className="p-3">
                  Akce
                </th>

              </tr>

            </thead>

            <tbody>

              {entries.map((entry) => (

                <tr
                  key={entry.id}
                  className="border-t"
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

                  <td className="p-3 text-center">

                    <button
                      onClick={() => edit(entry)}
                      className="mr-3 text-blue-700 hover:underline"
                    >
                      Upravit
                    </button>

                    <button
                      onClick={() =>
                        window.confirm(
                          "Smazat brigádu?"
                        ) &&
                        deleteWorkEntry(entry.id)
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

        ) : (

          <p className="p-8 text-center text-slate-500">
            Zatím nejsou zapsané žádné brigády.
          </p>

        )}

      </div>

    </div>
  );
} 