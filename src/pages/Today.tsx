import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Bar, Empty, Header, Icon, Ring } from '../components/ui';
import { addDays, dayLetter, dayNum, longDate, todayKey, weekDays } from '../lib/dates';
import { entriesOn, g1, num, pct, sum } from '../lib/nutrition';
import { useStore } from '../store';
import { MEALS } from '../types';

export default function Today() {
  const { state, deleteEntry } = useStore();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const today = todayKey();
  const date = params.get('d') || today;
  const { settings: goals } = state;

  const dayEntries = entriesOn(state.entries, date);
  const total = sum(dayEntries);
  const remaining = goals.kcal - total.kcal;
  const done = pct(total.kcal, goals.kcal);
  const withData = new Set(state.entries.map((e) => e.date));
  const loggedMeals = MEALS.filter((m) => dayEntries.some((e) => e.meal === m.id)).length;

  const select = (k: string) => setParams(k === today ? {} : { d: k }, { replace: true });

  const macros = [
    { label: 'Proteínas', v: total.protein, goal: goals.protein, text: 'text-protein', bar: 'bg-protein' },
    { label: 'Carbos', v: total.carbs, goal: goals.carbs, text: 'text-carbs', bar: 'bg-carbs' },
    { label: 'Grasas', v: total.fat, goal: goals.fat, text: 'text-fat', bar: 'bg-fat' },
  ];

  return (
    <>
      <Header subtitle={date === today ? 'Hoy' : 'Diario'} />
      <main className="space-y-5 px-4 py-4">
        {/* Selector de día */}
        <section className="card p-3">
          <div className="mb-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 font-display text-lg font-semibold">
              <Icon name="calendar_today" className="text-primary-container" />
              {date === today ? 'Hoy, ' : ''}{longDate(date)}
            </div>
            {date !== today && (
              <button onClick={() => select(today)} className="rounded-full bg-primary-container/15 px-3 py-1 text-xs font-semibold text-primary-container">Ir a hoy</button>
            )}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekDays(date).map((k) => {
              const sel = k === date;
              return (
                <button key={k} onClick={() => select(k)} aria-pressed={sel}
                  className={`flex flex-col items-center gap-1 rounded-2xl py-2 text-sm transition ${sel ? 'bg-primary-container text-white shadow-[0_0_18px_rgba(249,115,22,0.4)]' : 'text-zinc-400 hover:bg-ink/5'}`}>
                  <span className="text-[11px] font-medium">{dayLetter(k)}</span>
                  <span className="font-display text-lg font-bold">{dayNum(k)}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${withData.has(k) ? (sel ? 'bg-white' : 'bg-primary-container') : 'bg-transparent'}`} />
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between px-1 text-xs text-zinc-500">
            <button onClick={() => select(addDays(date, -7))} className="flex items-center gap-1"><Icon name="chevron_left" className="!text-[18px]" />Semana anterior</button>
            <button onClick={() => select(addDays(date, 7))} className="flex items-center gap-1">Semana siguiente<Icon name="chevron_right" className="!text-[18px]" /></button>
          </div>
        </section>

        {/* Balance */}
        <section className="card p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="label !text-primary-container">Balance diario</p>
              <h2 className="font-display text-2xl font-bold leading-tight">Energía &<br />Vitalidad</h2>
            </div>
            <span className="rounded-full border border-primary-container/30 bg-primary-container/10 px-3 py-1 text-xs font-semibold text-primary-container">{done}% completado</span>
          </div>
          <div className="flex items-center gap-4">
            <Ring size={150} rings={[
              { value: done, color: 'rgb(var(--primary-container))' },
              { value: pct(total.protein, goals.protein), color: 'rgb(var(--protein))' },
              { value: pct(total.fat, goals.fat), color: 'rgb(var(--fat))' },
            ]}>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{remaining >= 0 ? 'Restan' : 'Exceso'}</span>
              <span className="font-display text-3xl font-bold leading-none">{num(Math.abs(remaining))}</span>
              <span className="text-xs text-zinc-500">kcal</span>
            </Ring>
            <div className="flex-1 space-y-2">
              <Stat icon="local_fire_department" label="Consumidas" value={num(total.kcal)} />
              <Stat icon="flag" label="Meta diaria" value={num(goals.kcal)} />
              <Stat icon="grass" label="Fibra" value={g1(total.fiber)} unit="g" />
            </div>
          </div>
        </section>

        {/* Macros */}
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold">Macronutrientes</h2>
            <span className="label">Objetivos del día</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {macros.map((m) => (
              <div key={m.label} className="card p-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className={`h-2 w-2 rounded-full ${m.bar}`} />
                  <span className={`font-semibold ${m.text}`}>{pct(m.v, m.goal)}%</span>
                </div>
                <p className="text-sm text-zinc-300">{m.label}</p>
                <p className="mb-2 font-display text-xl font-bold">{Math.round(m.v)}<span className="text-xs font-normal text-zinc-500">/{m.goal}g</span></p>
                <Bar value={pct(m.v, m.goal)} color={m.bar} />
              </div>
            ))}
          </div>
        </section>

        {/* Comidas */}
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold">Registro de comidas</h2>
            <span className="text-xs text-zinc-500">{loggedMeals} de 4 registradas</span>
          </div>
          <div className="space-y-4">
            {MEALS.map((meal) => {
              const items = dayEntries.filter((e) => e.meal === meal.id);
              const t = sum(items);
              const time = items.length ? [...items].sort((a, b) => a.time.localeCompare(b.time))[0].time : meal.defaultTime;
              return (
                <div key={meal.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${items.length ? 'bg-primary-container/15 text-primary-container' : 'bg-ink/5 text-zinc-500'}`}>
                        <Icon name={meal.icon} />
                      </div>
                      <div>
                        <p className="font-display font-semibold">{meal.label}</p>
                        <p className="text-xs text-zinc-500">{time}</p>
                      </div>
                    </div>
                    {items.length > 0 && <p className="font-display text-lg font-bold">{num(t.kcal)} <span className="text-xs font-normal text-zinc-500">kcal</span></p>}
                  </div>

                  {items.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {items.map((e) => (
                        <li key={e.id} className="inner flex items-center gap-3 p-3">
                          <span className="text-2xl">{e.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{e.name}</p>
                            <p className="text-xs text-zinc-500">{e.grams} g · {e.kcal} kcal</p>
                            <div className="mt-1 flex gap-1.5 text-[11px] font-semibold">
                              <span className="rounded-md bg-protein/15 px-1.5 py-0.5 text-protein">{Math.round(e.protein)}g Prot</span>
                              <span className="rounded-md bg-carbs/15 px-1.5 py-0.5 text-carbs">{Math.round(e.carbs)}g Carbos</span>
                              <span className="rounded-md bg-fat/15 px-1.5 py-0.5 text-fat">{Math.round(e.fat)}g Grasa</span>
                            </div>
                          </div>
                          <button onClick={() => deleteEntry(e.id)} aria-label={`Eliminar ${e.name}`} className="p-1 text-zinc-600 hover:text-error">
                            <Icon name="delete" className="!text-[20px]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button onClick={() => nav(`/anadir?meal=${meal.id}&date=${date}`)}
                    className={`mt-3 w-full py-3 text-sm ${items.length ? 'btn-ghost text-zinc-300' : 'btn-ghost border-dashed !text-primary-container'}`}>
                    <Icon name="add_circle" className="!text-[20px]" /> {items.length ? 'Añadir más' : `Registrar ${meal.label}`}
                  </button>
                </div>
              );
            })}
          </div>
          {dayEntries.length === 0 && <Empty icon="restaurant" text="Aún no has registrado nada este día. Empieza añadiendo una comida." />}
        </section>

        <p className="text-center text-xs text-zinc-600">
          Puedes cambiar tus metas en <Link to="/ajustes" className="text-primary-container underline">Ajustes</Link>
        </p>
      </main>
    </>
  );
}

function Stat({ icon, label, value, unit = 'kcal' }: { icon: string; label: string; value: string; unit?: string }) {
  return (
    <div className="inner flex items-center justify-between px-3 py-2.5">
      <div className="flex items-center gap-2 text-xs text-zinc-400"><Icon name={icon} className="!text-[18px] text-primary-container" />{label}</div>
      <p className="font-display font-bold leading-none">{value}<span className="ml-0.5 text-[10px] font-normal text-zinc-500">{unit}</span></p>
    </div>
  );
}
