import { useEffect, useMemo, useState } from "react";
import {
  addGuestRoomReservation,
  updateGuestRoomReservation,
  subscribeGuestRoomReservations,
  findReservationConflict,
} from "../../services/guestRoomService";

import {
  getSettings,
} from "../../services/settingsService";

const today = new Date().toISOString().split("T")[0];

function calculateNights(arrival, departure) {
  if (!arrival || !departure) return 0;

  const start = new Date(arrival);
  const end = new Date(departure);

  const diff = end - start;

  if (diff <= 0) return 0;

  return Math.round(diff / (1000 * 60 * 60 * 24));
}

const DEFAULT_SETTINGS = {
  guestRoomPrice: 800,
  guestRoomHeatingPrice: 250,
};

export default function GuestRoomForm({
  selectedReservation,
  onSaved,
  onCancel,
}) {

  const [settings, setSettings] =
    useState(DEFAULT_SETTINGS);

  const [reservations, setReservations] =
    useState([]);

  const [conflict, setConflict] =
    useState(null);

  const [form, setForm] = useState({
    guestName: "",
    phone: "",
    arrival: today,
    departure: today,
    persons: 1,
    heating: false,
    note: "",
  });

  useEffect(() => {
    return subscribeGuestRoomReservations(
      setReservations
    );
  }, []);

  useEffect(() => {

    async function load() {

      const data = await getSettings();

      if (data) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data,
        });
      }

    }

    load();

  }, []);

  useEffect(() => {

    if (selectedReservation) {

      setForm({

        guestName:
          selectedReservation.guestName || "",

        phone:
          selectedReservation.phone || "",

        arrival:
          selectedReservation.arrival || today,

        departure:
          selectedReservation.departure || today,

        persons:
          selectedReservation.persons || 1,

        heating:
          selectedReservation.heating || false,

        note:
          selectedReservation.note || "",

      });

    } else {

      setForm({

        guestName: "",
        phone: "",
        arrival: today,
        departure: today,
        persons: 1,
        heating: false,
        note: "",

      });

    }

  }, [selectedReservation]);

  useEffect(() => {

    const result =
      findReservationConflict(
        reservations,
        form.arrival,
        form.departure,
        selectedReservation?.id
      );

    setConflict(result);

  }, [
    reservations,
    form.arrival,
    form.departure,
    selectedReservation,
  ]);

  const nights = useMemo(() => {

    return calculateNights(
      form.arrival,
      form.departure
    );

  }, [
    form.arrival,
    form.departure,
  ]);

  const total = useMemo(() => {

    return (
      Number(settings.guestRoomPrice || 0) +
      (
        form.heating
          ? Number(
              settings.guestRoomHeatingPrice || 0
            )
          : 0
      )
    );

  }, [
    settings,
    form.heating,
  ]);

  function handleChange(e) {

    const { name, value, type, checked } =
      e.target;

    setForm((prev) => ({

      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : (
              name === "persons"
                ? Number(value)
                : value
            ),

    }));

  }

  async function handleSubmit(e) {

    e.preventDefault();

    if (!form.guestName.trim()) {
      alert("Zadej jméno hosta.");
      return;
    }

    if (nights <= 0) {
      alert(
        "Datum odjezdu musí být po datu příjezdu."
      );
      return;
    }

    if (conflict) {
      return;
    }

    const reservation = {

      ...form,

      nights,

      fixedPrice:
        settings.guestRoomPrice,

      heatingPrice:
        form.heating
          ? settings.guestRoomHeatingPrice
          : 0,

      total,

    };

    try {

      if (selectedReservation) {

        await updateGuestRoomReservation(
          selectedReservation.id,
          reservation
        );

      } else {

        await addGuestRoomReservation(
          reservation
        );

      }

      setForm({

        guestName: "",
        phone: "",
        arrival: today,
        departure: today,
        persons: 1,
        heating: false,
        note: "",

      });

      onSaved?.();

    } catch (err) {

      console.error(err);

      alert(
        "Rezervaci se nepodařilo uložit."
      );

    }
  }

  return (
        <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl bg-white p-6 shadow"
    >
      <div>
        <h2 className="text-2xl font-bold">
          🛏️ Rezervace návštěvnického pokoje
        </h2>

        <p className="text-slate-500">
          Samostatná evidence rezervací návštěvnického pokoje
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-1 block text-sm font-medium">
            Jméno hosta
          </label>

          <input
            type="text"
            name="guestName"
            value={form.guestName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Telefon
          </label>

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Příjezd
          </label>

          <input
            type="date"
            name="arrival"
            value={form.arrival}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Odjezd
          </label>

          <input
            type="date"
            name="departure"
            value={form.departure}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Počet osob
          </label>

          <input
            type="number"
            min="1"
            name="persons"
            value={form.persons}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="flex items-center gap-3 pt-8">

          <input
            id="heating"
            type="checkbox"
            name="heating"
            checked={form.heating}
            onChange={handleChange}
            className="h-5 w-5"
          />

          <label
            htmlFor="heating"
            className="font-medium"
          >
            🔥 Příplatek za topení
          </label>

        </div>

      </div>

      <div>

        <label className="mb-1 block text-sm font-medium">
          Poznámka
        </label>

        <textarea
          rows={3}
          name="note"
          value={form.note}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

      </div>

      <div className="rounded-xl bg-slate-100 p-5">

        <div className="flex justify-between">
          <span>Počet nocí</span>
          <strong>{nights}</strong>
        </div>

        <div className="mt-3 flex justify-between">
          <span>Pevná cena</span>

          <strong>
            {Number(settings.guestRoomPrice).toLocaleString("cs-CZ")} Kč
          </strong>
        </div>

        <div className="mt-3 flex justify-between">

          <span>Příplatek za topení</span>

          <strong>

            {form.heating
              ? `${Number(settings.guestRoomHeatingPrice).toLocaleString("cs-CZ")} Kč`
              : "0 Kč"}

          </strong>

        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-xl font-bold">

          <span>Celkem</span>

          <span>
            {total.toLocaleString("cs-CZ")} Kč
          </span>

        </div>

      </div>

      {conflict && (

        <div className="rounded-xl border border-red-300 bg-red-50 p-4">

          <h3 className="text-lg font-bold text-red-700">
            ❌ Termín není dostupný
          </h3>

          <p className="mt-2">
            Pokoj je již rezervovaný.
          </p>

          <div className="mt-4 space-y-2">

            <div>

              <strong>Host:</strong>{" "}
              {conflict.guestName}

            </div>

            <div>

              <strong>Obsazeno:</strong>

            </div>

            <div>{conflict.arrival}</div>

            <div className="text-center">
              ↓
            </div>

            <div>{conflict.departure}</div>

          </div>

        </div>

      )}

      <div className="flex gap-3">

        <button
          type="submit"
          disabled={!!conflict}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {selectedReservation
            ? "💾 Uložit změny"
            : "➕ Uložit rezervaci"}
        </button>

        {selectedReservation && (

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-slate-200 px-6 py-3 hover:bg-slate-300"
          >
            Zrušit
          </button>

        )}

      </div>

    </form>
  );
}