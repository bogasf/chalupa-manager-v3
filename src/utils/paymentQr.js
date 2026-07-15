/**
 * Vytvoří SPD řetězec pro českou QR platbu.
 * https://qr-platba.cz/
 */
export function createPaymentSPD({
  iban,
  amount,
  message = "",
  variableSymbol = "",
}) {
  if (!iban) {
    throw new Error("Chybí IBAN.");
  }

  const parts = [
    "SPD",
    "1.0",
    `ACC:${iban.replace(/\s/g, "")}`,
    `AM:${Number(amount).toFixed(2)}`,
    "CC:CZK",
  ];

  if (variableSymbol) {
    parts.push(`X-VS:${variableSymbol}`);
  }

  if (message) {
    parts.push(`MSG:${message}`);
  }

  return parts.join("*");
}