export function formatCurrency(value) {
  if (value === null || value === undefined) return '0';

  const absValue = Math.abs(value);
  const suffixes = [
    { limit: 1e12, suffix: 'T' },
    { limit: 1e9, suffix: 'B' },
    { limit: 1e6, suffix: 'M' },
    { limit: 1e3, suffix: 'K' },
  ];

  for (const { limit, suffix } of suffixes) {
    if (absValue >= limit) {
      return (value / limit).toFixed(1).replace(/\.0$/, '') + suffix;
    }
  }

  return value.toString();
}
