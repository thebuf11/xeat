import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Empty, Header, Icon } from '../components/ui';
import { exportCsv } from '../lib/csv';
import { addDays, dayLabel, dayLetter, dayNum, fmt, fromKey, isoWeek, toKey, todayKey, weekDays } from '../lib/dates';
import { entriesOn, g1, num, pct, streak, sum } from '../lib/nutrition';
import { useStore } from '../store';
import { MEALS } from '../types';

type Filter = 'todos' | 'deficit' | 'superavit' | 'proteina';
type Range = 'semana' | 'mes';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'deficit', label: 'Déficit' },
  { id: 'superavit', label: 'Superávit' },
  { id: 'proteina', label: 'Alta proteína' },
];

function monthDays(k: string) {
  const d = fromKey(k);
  const n = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return Array.from({ length: n }, (_, i) => toKey(new Date(d.getFullYear(), d.getMonth(), i + 1)));
}

export default function History() {
  const { state } = useStore();
  const { settings: goals, entries } = state;
  const today = todayKey();
  const [anchor, setAnchor] = useState(today);
  const [range, setRange] = useState<Range>('semana');
  const [filter, setFilter] = useState<Filter>('todos');
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const days = useMemo(() => (range === 'semana' ? weekDays(anchor) : monthDays(anchor)), [anchor, range]);
  const stats = useMemo(() => days.map((k) => {
    const items = entriesOn(entries, k);
    return { k, items, t: sum(items) };
  }), [days, entries]);

  const logged = stats.filter((s) => s.items.length > 0);
  const avg = logged.length ? Math.round(logged.reduce((a, s) => a + s.t.kcal, 0) / logged.length) : 0;
  const max = Math.max(goals.kcal, ...stats.map((s) => s.t.kcal)) * 1.1;
  const run = streak(entries, today, (k) => addDays(k, -1));

  const visible = logged.filter((s) => {
    if (filter === 'deficit') return s.t.kcal < goals.kcal * 0.9;
    if (filter === 'superavit') return s.t.kcal > goals.kcal * 1.05;
    if (filter === 'proteina') return s.t.protein >= goals.protein;
    return true;
  }).reverse();

  const step = (dir: 1 | -1) => {
    if (range === 'semana') return setAnchor(addDays(anchor, 7 * dir));
    const d = fromKey(anchor);
    setAnchor(toKey(new Date(d.getFullYear(), d.getMonth() + dir, 1)));
  };

  const title = range === 'semana' ? `Semana ${isoWeek(anchor)} · ${fmt(anchor, { month: 'long' })}` : fmt(anchor, { month: 'long', year: 'numeric' });
  const sub = `${fmt(days[0], { day: 'numeric', month: 'short' })} - ${fmt(days[days.length - 1], { day: 'numeric', month: 'short' })}`;

  return (
    <>
      <Header subtitle="Historial" />
      <main className="space-y-5 px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => step(-1)} aria-label="Anterior" className="btn-ghost h-11 w-11"><Icon name="chevron_left" /></button>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-lg font-bold">{title}</h2>
            <p className="text-xs text-zinc-500">{sub}</p>
          </div>
          <button onClick={() => step(1)} aria-label="Siguiente" className="btn-ghost h-11 w-11"><Icon name="chevron_right" /></button>
          <button onClick={() => setRange(range === 'semana' ? 'mes' : 'semana')}
            className="flex items-center gap-2 rounded-xl border border-primary-container/40 bg-primary-container/10 px-3 py-2.5 text-sm font-semibold text-primary-container">
            <Icon name={range === 'semana' ? 'calendar_month' : 'date_range'} className="!text-[20px]" />{range === 'semana' ? 'Mes' : 'Semana'}
          </button>
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`chip ${filter === f.id ? 'chip-active' : ''}`}>{f.label}</button>
          ))}
        </div>

        {/* Tendencia */}
        <section className="card p-4">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container/15 text-primary-container"><Icon name="bar_chart" /></div>
              <div>
                <h3 className="font-display text-lg font-semibold leading-tight">Tendencia {range === 'semana' ? 'semanal' : 'mensual'}</h3>
                <p className="text-xs text-zinc-500">Promedio: {num(avg)} kcal / día</p>
              </div>
            </div>
            <span className="whitespace-nowrap rounded-xl border border-ink/10 bg-ink/5 px-2.5 py-1 text-xs">Meta: {num(goals.kcal)} kcal</span>
          </div>
          <div className="inner px-3 pb-2 pt-6">
            <div className="relative flex h-24 items-end gap-1">
              <div className="pointer-events-none absolute inset-x-0 border-t border-dashed border-primary-container/50" style={{ bottom: `${(goals.kcal / max) * 100}%` }} />
              {stats.map((s) => {
                const h = s.t.kcal ? Math.max(6, (s.t.kcal / max) * 100) : 4;
                const hit = s.t.kcal > 0 && pct(s.t.kcal, goals.kcal) >= 90 && pct(s.t.kcal, goals.kcal) <= 110;
                return (
                  <div key={s.k} className="relative flex h-full flex-1 items-end justify-center">
                    {range === 'semana' && s.t.kcal > 0 && (
                      <span className="absolute text-[10px] text-zinc-500" style={{ bottom: `calc(${h}% + 2px)` }}>{(s.t.kcal / 1000).toFixed(2).replace('.', ',')}k</span>
                    )}
                    <div className={`w-full max-w-[28px] rounded-t-md ${s.t.kcal ? (hit ? 'bg-primary-container' : 'bg-zinc-600') : 'bg-ink/10'}`} style={{ height: `${h}%` }} />
                  </div>
                );
              })}
            </div>
            <div className="mt-1 flex gap-1">
              {stats.map((s) => (
                <span key={s.k} className={`flex-1 text-center text-[10px] ${s.k === today ? 'font-bold text-primary-container' : 'text-zinc-500'}`}>
                  {range === 'semana' ? dayLetter(s.k) : dayNum(s.k) % 5 === 0 || dayNum(s.k) === 1 ? dayNum(s.k) : ''}
                </span>
              ))}
            </div>
          </div>
          <div className="inner mt-4 flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container/15 text-primary-container"><Icon name="local_fire_department" fill /></div>
              <div>
                <p className="text-sm font-semibold">{run > 0 ? `Racha de ${run} ${run === 1 ? 'día' : 'días'} activa` : 'Sin racha activa'}</p>
                <p className="text-xs text-zinc-500">{run > 0 ? '¡Excelente consistencia!' : 'Registra hoy para empezar una racha'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Días */}
        <section className="space-y-4">
          {visible.length === 0 && <Empty icon="event_busy" text={logged.length ? 'Ningún día coincide con este filtro.' : 'No hay registros en este periodo.'} />}
          {visible.map(({ k, items, t }) => {
            const p = pct(t.kcal, goals.kcal);
            const expanded = open[k] ?? (k === today || k === addDays(today, -1));
            const ok = p >= 95 && p <= 105;
            return (
              <article key={k} className="card overflow-hidden">
                <button onClick={() => setOpen({ ...open, [k]: !expanded })} aria-expanded={expanded} className="flex w-full items-center justify-between p-4 text-left">
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${ok ? 'bg-secondary' : 'bg-primary-container'}`} />
                    <span className="font-display text-lg font-semibold">{dayLabel(k)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${ok ? 'bg-secondary/15 text-secondary' : 'bg-primary-container/15 text-primary-container'}`}>
                      {ok && '✓ '}{p}% Meta
                    </span>
                    <Icon name={expanded ? 'expand_less' : 'expand_more'} className="text-zinc-500" />
                  </div>
                </button>
                <div className="flex flex-wrap gap-2 px-4 pb-4 text-xs font-medium">
                  <Pill dot="bg-primary-container" text={`${num(t.kcal)} kcal`} />
                  <Pill dot="bg-protein" text={`${Math.round(t.protein)}g Proteína`} />
                  <Pill dot="bg-fat" text={`${Math.round(t.fat)}g Grasas`} />
                  <Pill dot="bg-carbs" text={`${Math.round(t.carbs)}g Carbos`} />
                </div>
                {expanded && (
                  <div className="space-y-2 border-t border-ink/5 p-3">
                    {MEALS.map((meal) => {
                      const mi = items.filter((e) => e.meal === meal.id);
                      if (!mi.length) return null;
                      const mt = sum(mi);
                      return (
                        <div key={meal.id} className="inner p-3">
                          <div className="flex items-baseline justify-between">
                            <p className="font-display text-sm font-bold uppercase tracking-wide text-primary-container">{meal.label}</p>
                            <p className="font-display font-bold">{mt.kcal} <span className="text-xs font-normal text-zinc-500">kcal</span></p>
                          </div>
                          <ul className="mt-2 space-y-1.5">
                            {mi.map((e) => (
                              <li key={e.id} className="flex items-center gap-2 text-sm">
                                <span>{e.emoji}</span>
                                <span className="min-w-0 flex-1 truncate">{e.name}</span>
                                <span className="text-xs text-zinc-500">{e.grams}g</span>
                                <span className="w-16 text-right text-xs text-fat">{g1(e.protein)}g prot</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                    <Link to={`/?d=${k}`} className="block py-1 text-center text-sm font-medium text-primary-container">Abrir este día</Link>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        {/* Exportar */}
        <section className="card flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container/15 text-primary-container"><Icon name="description" /></div>
            <div>
              <h3 className="font-display font-semibold">Reporte nutricional</h3>
              <p className="text-xs text-zinc-500">Exporta tus registros para tu nutricionista</p>
            </div>
          </div>
          <button onClick={() => exportCsv(entries)} disabled={!entries.length} className="btn-primary shrink-0 px-4 py-2.5 text-sm"><Icon name="download" className="!text-[18px]" />CSV</button>
        </section>
      </main>
    </>
  );
}

const Pill = ({ dot, text }: { dot: string; text: string }) => (
  <span className="flex items-center gap-1.5 rounded-lg border border-ink/5 bg-ink/5 px-2.5 py-1.5"><i className={`h-1.5 w-1.5 rounded-full ${dot}`} />{text}</span>
);
