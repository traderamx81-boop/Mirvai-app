export type Currency = 'NGN' | 'USD' | 'GBP';

export interface ExchangeRates {
  USD: number; // e.g. 1500 (1 USD = 1500 NGN)
  GBP: number; // e.g. 1900 (1 GBP = 1900 NGN)
}

export const defaultRates: ExchangeRates = {
  USD: 1500,
  GBP: 1900,
};

export function formatPrice(amountInNGN: number, currency: Currency = 'NGN', rates: ExchangeRates = defaultRates): string {
  if (currency === 'USD') {
    const usd = Math.round(amountInNGN / (rates.USD || 1500));
    return '$' + new Intl.NumberFormat('en-US').format(usd);
  }
  if (currency === 'GBP') {
    const gbp = Math.round(amountInNGN / (rates.GBP || 1900));
    return '£' + new Intl.NumberFormat('en-GB').format(gbp);
  }
  return '₦' + new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(amountInNGN);
}
