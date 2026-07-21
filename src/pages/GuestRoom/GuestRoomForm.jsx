import { useEffect, useMemo, useState } from "react";
import {
  addGuestRoomReservation,
  updateGuestRoomReservation,
  subscribeGuestRoomReservations,
  findReservationConflict,
} from "../../services/guestRoomService";
import { getSettings } from "../../services/settingsService";

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
  guestRoomPrice: 100,
  guestRoomHeating: 100,
};

export default function GuestRoomForm({
  selectedReservation,
  onSaved,
  onCancel,
}) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [reservations, setReservations] = useState([]);
  const [conflict, setConflict] = useState(null);

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
    return subscribeGuestRoomReservations(setReservations);
  }, []);

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

  useEffect(() => {
    if (selectedReservation) {
      setForm({
        guestName: selectedReservation.guestName || "",
        phone: selectedReservation.phone || "",
        arrival: selectedReservation.arrival || today,
        departure: selectedReservation.departure || today,
        persons: selectedReservation.persons || 1,
        heating: selectedReservation.heating || false,
        note: selectedReservation.note || "",
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
    const result = findReservationConflict(
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
    return calculateNights(form.arrival, form.departure);
  }, [form.arrival, form.departure]);

  const roomPrice = Number(settings.guestRoomPrice ?? 100);

  const heatingPrice = form.heating
    ? Number(settings.guestRoomHeating ?? 0)
    : 0;

  const total = useMemo(() => {
    return nights * roomPrice + heatingPrice;
  }, [nights, roomPrice, heatingPrice]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "persons"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.guestName.trim()) {
      alert("Zadej jméno hosta.");
      return;
    }

    if (nights <= 0) {
      alert("Datum odjezdu musí být po datu příjezdu.");
      return;
    }

    if (conflict) {
      return;
    }

    const reservation = {
      ...form,
      nights,
      pricePerNight: roomPrice,
      heatingPrice,
      total,
      price: total,
    };

    try {
      if (selectedReservation) {
        await updateGuestRoomReservation(
          selectedReservation.id,
          reservation
        );
      } else {
        await addGuestRoomReservation(reservation);
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
      alert("Rezervaci se nepodařilo uložit.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl bg-white p-6 shadow"
    >
            <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Jméno hosta *
          </label>

          <input
            type="text"
            name="guestName"
            value={form.guestName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="Např. Jan Novák"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Telefon
          </label>

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="+420 123 456 789"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Datum příjezdu
          </label>

          <input
            type="date"
            name="arrival"
            value={form.arrival}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Datum odjezdu
          </label>

          <input
            type="date"
            name="departure"
            value={form.departure}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Počet osob
          </label>

          <input
            type="number"
            name="persons"
            min="1"
            max="20"
            value={form.persons}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 w-full cursor-pointer">

            <input
              type="checkbox"
              name="heating"
              checked={form.heating}
              onChange={handleChange}
              className="h-5 w-5"
            />

            <div>
              <div className="font-medium">
                Topení
              </div>

              <div className="text-sm text-slate-500">
                +{heatingPrice.toLocaleString("cs-CZ")} Kč
              </div>
            </div>

          </label>
        </div>

      </div>

      <div>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Poznámka
        </label>

        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          placeholder="Volitelná poznámka..."
        />

      </div>
            <div className="rounded-xl border bg-slate-50 p-6">

        <h3 className="mb-4 text-lg font-semibold">
          Souhrn rezervace
        </h3>

        <div className="space-y-3">

          <div className="flex justify-between">
            <span>Počet nocí</span>
            <strong>{nights}</strong>
          </div>

          <div className="flex justify-between">
            <span>Cena za noc</span>
            <strong>
              {roomPrice.toLocaleString("cs-CZ")} Kč
            </strong>
          </div>

          <div className="flex justify-between">
            <span>
              Ubytování ({nights} × {roomPrice.toLocaleString("cs-CZ")} Kč)
            </span>

            <strong>
              {(nights * roomPrice).toLocaleString("cs-CZ")} Kč
            </strong>
          </div>

          <div className="flex justify-between">
            <span>Topení</span>

            <strong>
              {heatingPrice.toLocaleString("cs-CZ")} Kč
            </strong>
          </div>

          <hr />

          <div className="flex justify-between text-xl font-bold text-blue-700">
            <span>Celkem</span>

            <span>
              {total.toLocaleString("cs-CZ")} Kč
            </span>
          </div>

        </div>

      </div>

      {conflict && (

        <div className="rounded-xl border border-red-300 bg-red-50 p-5">

          <h3 className="mb-2 text-lg font-bold text-red-700">
            ⚠ Termín je obsazen
          </h3>

          <p className="mb-3">
            Ve zvoleném termínu již existuje rezervace.
          </p>

          <div className="space-y-1">

            <div>
              <strong>Host:</strong> {conflict.guestName}
            </div>

            <div>
              <strong>Příjezd:</strong> {conflict.arrival}
            </div>

            <div>
              <strong>Odjezd:</strong> {conflict.departure}
            </div>

          </div>

        </div>

      )}
            <div className="flex justify-end gap-3 pt-4">

        {selectedReservation && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Zrušit
          </button>
        )}

        <button
          type="submit"
          disabled={!!conflict}
          className={`rounded-lg px-6 py-3 font-semibold text-white transition ${
            conflict
              ? "cursor-not-allowed bg-slate-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {selectedReservation
            ? "💾 Uložit změny"
            : "➕ Uložit rezervaci"}
        </button>

      </div>

    </form>
  );
}