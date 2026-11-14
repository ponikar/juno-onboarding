const DAY = 24 * 60 * 60 * 1000;

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, n: number) {
  const s = startOfDay(d);
  return new Date(s.getFullYear(), s.getMonth(), s.getDate() + n);
}

export function trialDates(today: Date) {
  return { today: startOfDay(today), remind: addDays(today, 5), charge: addDays(today, 7) };
}

export function toISODate(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function fromISODate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function daysUntil(iso: string, today: Date) {
  return Math.round((fromISODate(iso).getTime() - startOfDay(today).getTime()) / DAY);
}

export function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); // device format (eval D-12)
}
