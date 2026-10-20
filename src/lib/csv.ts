import type { Entry } from '../types';

export function exportCsv(entries: Entry[]) {
  const head = ['Fecha', 'Hora', 'Comida', 'Alimento', 'Gramos', 'Kcal', 'Proteina_g', 'Grasas_g', 'Carbos_g', 'Fibra_g'];
  const rows = [...entries]
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .map((e) => [e.date, e.time, e.meal, `"${e.name.replace(/"/g, '""')}"`, e.grams, e.kcal, e.protein, e.fat, e.carbs, e.fiber]);
  const csv = '﻿' + [head, ...rows].map((r) => r.join(';')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = `xeat-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
