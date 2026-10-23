export type PlanId = 'pro' | 'agency';
export type CurrencyCode = 'usd' | 'gbp' | 'eur' | 'aud' | 'cad' | 'nzd' | 'inr' | 'zar';

export interface Region {
  code: string;
  label: string;
  currency: CurrencyCode;
  locale: string;
}

// Yearly prices in the smallest currency unit (pence / cents / paise).
export const PRICES: Record<CurrencyCode, Record<PlanId, number>> = {
  gbp: { pro: 2900, agency: 9900 },
  usd: { pro: 3900, agency: 12900 },
  eur: { pro: 3500, agency: 11900 },
  aud: { pro: 5900, agency: 19900 },
  cad: { pro: 5500, agency: 17900 },
  nzd: { pro: 6500, agency: 21900 },
  inr: { pro: 299900, agency: 999900 },
  zar: { pro: 64900, agency: 219900 },
};

export const REGIONS: Region[] = [
  { code: 'GB', label: 'United Kingdom', currency: 'gbp', locale: 'en-GB' },
  { code: 'US', label: 'United States', currency: 'usd', locale: 'en-US' },
  { code: 'IE', label: 'Ireland', currency: 'eur', locale: 'en-IE' },
  { code: 'DE', label: 'Germany', currency: 'eur', locale: 'de-DE' },
  { code: 'FR', label: 'France', currency: 'eur', locale: 'fr-FR' },
  { code: 'ES', label: 'Spain', currency: 'eur', locale: 'es-ES' },
  { code: 'IT', label: 'Italy', currency: 'eur', locale: 'it-IT' },
  { code: 'NL', label: 'Netherlands', currency: 'eur', locale: 'nl-NL' },
  { code: 'AU', label: 'Australia', currency: 'aud', locale: 'en-AU' },
  { code: 'CA', label: 'Canada', currency: 'cad', locale: 'en-CA' },
  { code: 'NZ', label: 'New Zealand', currency: 'nzd', locale: 'en-NZ' },
  { code: 'IN', label: 'India', currency: 'inr', locale: 'en-IN' },
  { code: 'ZA', label: 'South Africa', currency: 'zar', locale: 'en-ZA' },
];

const EURO_ZONE = ['AT', 'BE', 'CY', 'EE', 'FI', 'GR', 'HR', 'LT', 'LU', 'LV', 'MT', 'PT', 'SI', 'SK'];

export const DEFAULT_REGION: Region = { code: 'INTL', label: 'Rest of world', currency: 'usd', locale: 'en-US' };

export function regionForCountry(code?: string | null): Region {
  const c = (code ?? '').toUpperCase();
  const found = REGIONS.find((r) => r.code === c);
  if (found) return found;
  if (EURO_ZONE.includes(c)) return { code: c, label: c, currency: 'eur', locale: 'en-IE' };
  return DEFAULT_REGION;
}

export function formatPrice(amount: number, region: Region): string {
  return new Intl.NumberFormat(region.locale, {
    style: 'currency',
    currency: region.currency.toUpperCase(),
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

export function isPlan(v: unknown): v is PlanId {
  return v === 'pro' || v === 'agency';
}
