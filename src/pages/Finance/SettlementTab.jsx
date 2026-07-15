import { useEffect, useMemo, useState } from "react";
import { getFamilies } from "../../services/familyService";
import { subscribeVisits } from "../../services/visitService";
import { subscribeWorkEntries } from "../../services/workService";
import { getSettings } from "../../services/settingsService";
import QRPaymentModal from "./QRPaymentModal";

const money = (value) =>
  `${Number(value || 0).toLocaleString("cs-CZ")} Kč`;

export default function SettlementTab() {
  const [families, setFamilies] = useState([]);
  const [visits, setVisits] = useState([]);
  const [workEntries, setWorkEntries] = useState([]);

  const [settings, setSettings] = useState({
    workHourRate: 150,
    accountNumber: "",
    bankCode: "",
    paymentMessage: "Vyúčtování chalupy",
  });

  const [selectedRow, setSelectedRow] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const familyData = await getFamilies();
        const appSettings = await getSettings();

        setFamilies(familyData);
        setSettings(appSettings);
      } catch (error) {
        console.error(error);
      }
    }

    load();

    const unsubscribeVisits = subscribeVisits(setVisits);
    const unsubscribeWork = subscribeWorkEntries(setWorkEntries);

    return () => {
      unsubscribeVisits();
      unsubscribeWork();
    };
  }, []);

  const rows = useMemo(() => {
    return families
      .filter((family) => family.active !== false)
      .map((family) => {
        const familyVisits = visits.filter(
          (item) => item.familyId === family.id
        );

        const visitTotal = familyVisits.reduce(
          (sum, item) => sum + Number(item.total || 0),
          0
        );

        const familyWork = workEntries.filter(
          (item) => item.familyId === family.id
        );

        const hours = familyWork.reduce(
          (sum, item) => sum + Number(item.hours || 0),
          0
        );

        const workCredit =
          hours * Number(settings.workHourRate || 0);

        return {
          id: family.id,
          family: family.name,
          visitTotal,
          workCredit,
          balance: visitTotal - workCredit,
        };
      });
  }, [families, visits, workEntries, settings]);
  return (
  <>
    <div className="overflow-x-auto rounded-xl bg-white shadow">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="p-3 text-left">
              Rodina
            </th>

            <th className="p-3 text-right">
              Návštěvy
            </th>

            <th className="p-3 text-right">
              Brigády
            </th>

            <th className="p-3 text-right">
              K úhradě
            </th>

            <th className="p-3 text-center">
              QR
            </th>

          </tr>

        </thead>

        <tbody>

          {rows.map((row) => (

            <tr
              key={row.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="p-3 font-medium">
                {row.family}
              </td>

              <td className="p-3 text-right">
                {money(row.visitTotal)}
              </td>

              <td className="p-3 text-right text-emerald-700">
                - {money(row.workCredit)}
              </td>

              <td className="p-3 text-right text-lg font-bold">
                {money(row.balance)}
              </td>

              <td className="p-3 text-center">

                <button
                  onClick={() => {
                    setSelectedRow(row);
                    setQrOpen(true);
                  }}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  📱 QR
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

    <QRPaymentModal
      open={qrOpen}
      onClose={() => setQrOpen(false)}
      family={selectedRow?.family ?? ""}
      amount={selectedRow?.balance ?? 0}
      settings={settings}
    />
  </>
);
}