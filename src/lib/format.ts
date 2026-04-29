export type Currency = "FCFA" | "EUR";

const FCFA_TO_EUR = 1 / 656;

export function convertFromFCFA(amountFCFA: number, currency: Currency): number {
  return currency === "EUR" ? amountFCFA * FCFA_TO_EUR : amountFCFA;
}

export function formatPrice(amountFCFA: number, currency: Currency): string {
  const value = convertFromFCFA(amountFCFA, currency);
  if (currency === "EUR") {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  }
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value)} FCFA`;
}
