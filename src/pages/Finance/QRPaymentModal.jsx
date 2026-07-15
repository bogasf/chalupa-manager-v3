import QRCode from "react-qr-code";
import { createPaymentSPD } from "../../utils/paymentQr";

export default function QRPaymentModal({
  open,
  onClose,
  family,
  amount,
  settings,
}) {
  if (!open) return null;

  const account = `${settings.accountNumber}/${settings.bankCode}`;

  const spd = createPaymentSPD({
    iban: settings.iban,
    amount,
    message: `${settings.paymentMessage} - ${family}`,
    variableSymbol: "2026001",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        <h2 className="mb-6 text-center text-2xl font-bold">
          QR platba
        </h2>

        <div className="mb-6 flex justify-center">
          <div className="rounded-xl border bg-white p-4">
            <QRCode
              value={spd}
              size={220}
            />
          </div>
        </div>

        {/* Dočasně necháme zobrazit SPD pro kontrolu */}
        <div className="mb-4 rounded bg-slate-100 p-2 text-xs break-all">
          {spd}
        </div>

        <div className="space-y-3 rounded-lg bg-slate-50 p-4">

          <div className="flex justify-between">
            <span className="text-slate-500">
              Rodina
            </span>

            <strong>
              {family}
            </strong>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              K úhradě
            </span>

            <strong>
              {Number(amount).toLocaleString("cs-CZ")} Kč
            </strong>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Účet
            </span>

            <strong>
              {account}
            </strong>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              IBAN
            </span>

            <strong className="text-right text-xs">
              {settings.iban}
            </strong>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Variabilní symbol
            </span>

            <strong>
              2026001
            </strong>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Zpráva
            </span>

            <strong className="text-right">
              {settings.paymentMessage}
            </strong>
          </div>

        </div>

        <div className="mt-6 flex justify-center">

          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Zavřít
          </button>

        </div>

      </div>
    </div>
  );
}