import { useEffect, useMemo, useState } from "react";
import {
  subscribeGuestRoomReservations,
  updateGuestRoomReservation,
} from "../../services/guestRoomService";
import { getSettings } from "../../services/settingsService";
import QRPaymentModal from "./QRPaymentModal";

const money = (value) =>
  `${Number(value || 0).toLocaleString("cs-CZ")} Kč`;

export default function GuestRoomSettlementTab() {
  const [reservations, setReservations] = useState([]);
  const [settings, setSettings] = useState({});
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeGuestRoomReservations(setReservations);
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        setSettings(data || {});
      } catch (err) {
        console.error("Chyba načítání nastavení:", err);
      }
    }

    loadSettings();
  }, []);

  const rows = useMemo(() => {
    return [...reservations].sort((a, b) =>
      (a.arrival || "").localeCompare(b.arrival || "")
    );
  }, [reservations]);

  const unpaidTotal = useMemo(() => {
    return rows
      .filter((r) => !r.paid)
      .reduce((sum, r) => sum + Number(r.total || 0), 0);
  }, [rows]);

  async function togglePaid(row) {
    try {
      await updateGuestRoomReservation(row.id, {
        paid: !row.paid,
      });
    } catch (err) {
      console.error(err);
      alert("Nepodařilo se uložit změnu.");
    }
  }

  return (
    <>
      <div className="mb-4 rounded-xl bg-white p-5 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              🛏️ Návštěvnický pokoj
            </h2>

            <p className="text-slate-500">
              Přehled plateb rezervací
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-500">
              Nezaplaceno celkem
            </div>

            <div className="text-2xl font-bold text-red-600">
              {money(unpaidTotal)}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Host</th>
              <th className="p-3">Příjezd</th>
              <th className="p-3">Odjezd</th>
              <th className="p-3">Osoby</th>
              <th className="p-3 text-right">Cena</th>
              <th className="p-3 text-center">Stav</th>
              <th className="p-3 text-center">QR</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center text-slate-500"
                >
                  Zatím nejsou žádné rezervace.
                </td>
              </tr>
            )}

            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-3 font-medium">
                  {row.guestName}
                </td>

                <td className="p-3 text-center">
                  {row.arrival}
                </td>

                <td className="p-3 text-center">
                  {row.departure}
                </td>

                <td className="p-3 text-center">
                  {row.persons}
                </td>

                <td className="p-3 text-right font-bold">
                  {money(row.total)}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => togglePaid(row)}
                    className={`rounded-lg px-4 py-2 text-white ${
                      row.paid
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    {row.paid
                      ? "✅ Zaplaceno"
                      : "🟠 Nezaplaceno"}
                  </button>
                </td>

                <td className="p-3 text-center">
                  {!row.paid ? (
                    <button
                      onClick={() => {
                        setSelectedReservation(row);
                        setQrOpen(true);
                      }}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      📱 QR
                    </button>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <QRPaymentModal
        open={qrOpen}
        onClose={() => {
          setQrOpen(false);
          setSelectedReservation(null);
        }}
        family={selectedReservation?.guestName ?? ""}
        amount={selectedReservation?.total ?? 0}
        settings={settings}
      />
    </>
  );
}