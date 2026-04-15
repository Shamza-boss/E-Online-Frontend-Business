export const currencyZar = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  currencyDisplay: 'symbol',
});

export const currencyUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'symbol',
});

export const DEFAULT_USD_TO_ZAR = 19;
export const usdToZarRate =
  Number(process.env.NEXT_PUBLIC_USD_TO_ZAR ?? DEFAULT_USD_TO_ZAR) ||
  DEFAULT_USD_TO_ZAR;

export const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});

export const numberFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
});
