import type { Entry, Food, Macros } from '../types';

const r1 = (n: number) => Math.round(n * 10) / 10;

export const ZERO: Macros = { kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 };

export function macrosFor(food: Food, grams: number): Macros {
  const f = grams / 100;
  return {
    kcal: Math.round(food.kcal * f),
    protein: r1(food.protein * f),
    fat: r1(food.fat * f),
    carbs: r1(food.carbs * f),
    fiber: r1(food.fiber * f),
  };
}

export function sum(items: Macros[]): Macros {
  const t = items.reduce(
    (a, m) => ({
      kcal: a.kcal + m.kcal,
      protein: a.protein + m.protein,
      fat: a.fat + m.fat,
      carbs: a.carbs + m.carbs,
      fiber: a.fiber + m.fiber,
    }),
    ZERO,
  );
  return { kcal: Math.round(t.kcal), protein: r1(t.protein), fat: r1(t.fat), carbs: r1(t.carbs), fiber: r1(t.fiber) };
}

export const entriesOn = (entries: Entry[], date: string) => entries.filter((e) => e.date === date);

/** Reparto energético (% de kcal): proteína 4, carbos 4, grasa 9 */
export function energySplit(m: Macros) {
  const p = m.protein * 4, c = m.carbs * 4, f = m.fat * 9;
  const t = p + c + f || 1;
  return { protein: Math.round((p / t) * 100), fat: Math.round((f / t) * 100), carbs: Math.round((c / t) * 100) };
}

export const pct = (v: number, goal: number) => (goal > 0 ? Math.round((v / goal) * 100) : 0);
export const clamp = (n: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n));
export const num = (n: number) => n.toLocaleString('es-ES');
export const g1 = (n: number) => (Math.round(n * 10) / 10).toString().replace('.', ',');

/** Racha: días consecutivos con registros, terminando hoy (o ayer si hoy aún está vacío) */
export function streak(entries: Entry[], today: string, prev: (k: string) => string): number {
  const days = new Set(entries.map((e) => e.date));
  let k = days.has(today) ? today : prev(today);
  let n = 0;
  while (days.has(k)) { n++; k = prev(k); }
  return n;
}
