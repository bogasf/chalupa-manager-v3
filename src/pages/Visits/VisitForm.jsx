import { useEffect, useState } from "react";
import { addVisit } from "../../services/visitService";
import { getFamilies } from "../../services/familyService";

const PRICE_PER_NIGHT = 350;
const HEATING_PRICE = 100;

export default function VisitForm() {
  const [families, setFamilies] = useState([]);

  const [familyId, setFamilyId] = useState("");
  const [familyName, setFamilyName] = useState("");

  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");

  const [heating, setHeating] = useState(false);

  const [note, setNote] = useState("");

  useEffect(() => {
    loadFamilies();
  }, []);

  async function loadFamilies() {
    try {
      const data = await getFamilies();
      setFamilies(data);
    } catch (err) {
      console.error(err);
    }
  }

  function calculateNights() {
    if (!arrival || !departure) return 0;

    const start = new Date(arrival);
    const end = new Date(departure);

    const diff = end.getTime() - start.getTime();

    if (diff <= 0) return 0;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  const nights = calculateNights();

  const accommodation = nights * PRICE_PER_NIGHT;

  const heatingCost = heating ? HEATING_PRICE : 0;

  const total = accommodation + heatingCost;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!familyId) {
      alert("Vyber rodinu.");
      return;
    }

    if (!arrival || !departure) {
      alert("Vyber datum.");
      return;
    }

    try {
      await addVisit({
        familyId,
        family: familyName,

        arrival,
        departure,

        nights,

        pricePerNight: PRICE_PER_NIGHT,

        heating,

        heatingPrice: heatingCost,

        total,

        paid: false,

        note,
      });

      alert("Návštěva byla uložena.");

      setFamilyId("");
      setFamilyName("");
      setArrival("");
      setDeparture("");
      setHeating(false);
      setNote("");
    } catch (err) {
      console.error(err);
      alert("Chyba při ukládání.");
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div>

          <label className="mb-2 block font-semibold">
            Rodina
          </label>

          <select
            className="w-full rounded border p-3"
            value={familyId}
            onChange={(e) => {
              setFamilyId(e.target.value);

              const selected = families.find(
                (f) => f.id === e.target.value
              );

              setFamilyName(selected?.name ?? "");
            }}
          >
            <option value="">
              -- Vyber rodinu --
            </option>

            {families.map((family) => (
              <option
                key={family.id}
                value={family.id}
              >
                {family.name}
              </option>
            ))}

          </select>

        </div>

        <div className="grid grid-cols-2 gap-5">

          <div>

            <label className="mb-2 block font-semibold">
              Příjezd
            </label>

            <input
              type="date"
              className="w-full rounded border p-3"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Odjezd
            </label>

            <input
              type="date"
              className="w-full rounded border p-3"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />

          </div>

        </div>

        <div className="grid grid-cols-3 gap-5">

          <div>

            <label className="mb-2 block font-semibold">
              Počet nocí
            </label>

            <input
              className="w-full rounded border bg-gray-100 p-3"
              value={nights}
              readOnly
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Cena / noc
            </label>

            <input
              className="w-full rounded border bg-gray-100 p-3"
              value={`${PRICE_PER_NIGHT} Kč`}
              readOnly
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Celkem
            </label>

            <input
              className="w-full rounded border bg-gray-100 p-3"
              value={`${total} Kč`}
              readOnly
            />

          </div>

        </div>

        <div className="flex items-center gap-3">

          <input
            id="heating"
            type="checkbox"
            checked={heating}
            onChange={(e) => setHeating(e.target.checked)}
          />

          <label htmlFor="heating">
            Topení (+100 Kč)
          </label>

        </div>

        <div>

          <label className="mb-2 block font-semibold">
            Poznámka
          </label>

          <textarea
            className="w-full rounded border p-3"
            rows="4"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

        </div>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Uložit návštěvu
        </button>

      </form>

    </div>
  );
}