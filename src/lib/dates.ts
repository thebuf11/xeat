const pad = (n: number) => String(n).padStart(2, '0');

export const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromKey = (k: string) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const todayKey = () => toKey(new Date());
export const nowTime = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export const addDays = (k: string, n: number) => {
  const d = fromKey(k);
  d.setDate(d.getDate() + n);
  return toKey(d);
};
/** Lunes de la semana de la fecha dada */
export const weekStart = (k: string) => {
  const dow = (fromKey(k).getDay() + 6) % 7;
  return addDays(k, -dow);
};
export const weekDays = (k: string) => {
  const s = weekStart(k);
  return Array.from({ length: 7 }, (_, i) => addDays(s, i));
};
export const isoWeek = (k: string) => {
  const d = fromKey(k);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const w1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7);
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const fmt = (k: string, o: Intl.DateTimeFormatOptions) => cap(fromKey(k).toLocaleDateString('es-ES', o));
export const longDate = (k: string) => fmt(k, { weekday: 'long', day: 'numeric', month: 'long' });
export const dayLabel = (k: string) => fmt(k, { weekday: 'long', day: 'numeric', month: 'short' });
export const dayLetter = (k: string) => ['L', 'M', 'X', 'J', 'V', 'S', 'D'][(fromKey(k).getDay() + 6) % 7];
export const dayNum = (k: string) => fromKey(k).getDate();
