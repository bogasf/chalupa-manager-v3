import { useEffect, useState } from "react";
import { addFamily, getFamilies } from "../../services/familyService";

export default function Settings() {

  const [families, setFamilies] = useState([]);
  const [name, setName] = useState("");

  async function loadFamilies() {
    const data = await getFamilies();
    setFamilies(data);
  }

  useEffect(() => {
    loadFamilies();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return;

    await addFamily({
      name,
      active: true
    });

    setName("");

    loadFamilies();
  }

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">

        Rodiny

      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex gap-3"
      >

        <input
          className="border rounded p-2 flex-1"
          placeholder="Nová rodina"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-5 rounded"
        >
          Přidat
        </button>

      </form>

      <div className="bg-white rounded shadow">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-3">

                Rodina

              </th>

            </tr>

          </thead>

          <tbody>

            {families.map(f=>(
              <tr
                key={f.id}
                className="border-b"
              >
                <td className="p-3">

                  {f.name}

                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );

}