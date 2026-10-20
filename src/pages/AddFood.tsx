import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FoodThumb, Header, Icon, Stepper } from '../components/ui';
import { nowTime, todayKey } from '../lib/dates';
import { clamp, g1, macrosFor } from '../lib/nutrition';
import { useFrequentFoods, useStore } from '../store';
import { MEALS, type Food, type MealId } from '../types';

const guessMeal = (): MealId => {
  const h = new Date().getHours();
  return h < 11 ? 'desayuno' : h < 16 ? 'almuerzo' : h < 20 ? 'merienda' : 'cena';
};

export default function AddFood() {
  const { foods, logFood, toast } = useStore();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const date = params.get('date') || todayKey();
  const [meal, setMeal] = useState<MealId>((params.get('meal') as MealId) || guessMeal());
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Food | null>(null);
  const [grams, setGrams] = useState(100);
  const frequent = useFrequentFoods(8);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return frequent;
    return foods.filter((f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)).slice(0, 30);
  }, [query, foods, frequent]);

  const mealLabel = MEALS.find((m) => m.id === meal)!.label;
  const m = selected ? macrosFor(selected, grams) : null;
  const split = m ? { p: m.protein * 4, c: m.carbs * 4, f: m.fat * 9 } : null;
  const splitTotal = split ? split.p + split.c + split.f || 1 : 1;

  const add = () => {
    if (!selected || grams <= 0) return;
    logFood(selected, grams, meal, date, nowTime());
    toast(`${selected.name} añadido a ${mealLabel}`);
    nav(date === todayKey() ? '/' : `/?d=${date}`);
  };

  return (
    <>
      <Header back subtitle="Añadir alimento" />
      <main className="space-y-5 px-4 pb-44 pt-4">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
          {MEALS.map((x) => (
            <button key={x.id} onClick={() => setMeal(x.id)} className={`chip ${meal === x.id ? 'chip-active' : ''}`}>{x.label}</button>
          ))}
        </div>

        <label className="relative block">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar alimento (ej. pechuga de pollo)" className="input !pl-12" aria-label="Buscar alimento" />
        </label>

        <div className="grid grid-cols-3 gap-3">
          <Quick icon="barcode_scanner" label="Escanear barra" onClick={() => toast('El escáner llegará en una próxima versión')} />
          <Quick icon="photo_camera" label="Foto con IA" onClick={() => toast('El reconocimiento por foto llegará pronto')} />
          <Quick icon="add_circle" label="Crear plato" onClick={() => nav('/crear')} />
        </div>

        {selected && m && split && (
          <section className="card space-y-4 p-4">
            <div className="flex items-center gap-4">
              <FoodThumb emoji={selected.emoji} size="h-20 w-20 !text-4xl" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full border border-primary-container/40 bg-primary-container/15 px-2 py-0.5 font-semibold text-primary-container">Seleccionado</span>
                  <span className="truncate text-zinc-500">{selected.category}</span>
                </div>
                <h2 className="font-display text-lg font-bold leading-snug">{selected.name}</h2>
                <p className="text-xs text-zinc-500">Base estándar: 100 g = {selected.kcal} kcal</p>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Quitar selección" className="self-start p-1 text-zinc-500"><Icon name="close" /></button>
            </div>

            <div className="inner p-4">
              <p className="label mb-3">Peso de la porción</p>
              <div className="flex flex-wrap items-center gap-2">
                <Stepper value={grams} onChange={setGrams} />
                {[50, 100].map((n) => (
                  <button key={n} onClick={() => setGrams(clamp(grams + n, 0, 5000))} className="btn-ghost px-3 py-2.5 text-sm">+{n}g</button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-end justify-between">
                <p className="font-display text-4xl font-bold text-primary-container">{m.kcal}<span className="ml-1 text-base font-medium text-zinc-400">kcal</span></p>
                <span className="label">Aporte nutricional</span>
              </div>
              <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/10">
                <div className="bg-protein" style={{ width: `${(split.p / splitTotal) * 100}%` }} />
                <div className="bg-carbs" style={{ width: `${(split.c / splitTotal) * 100}%` }} />
                <div className="bg-fat" style={{ width: `${(split.f / splitTotal) * 100}%` }} />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                <Macro label="Proteína" v={m.protein} dot="bg-protein" />
                <Macro label="Carbos" v={m.carbs} dot="bg-carbs" />
                <Macro label="Grasas" v={m.fat} dot="bg-fat" />
                <Macro label="Fibra" v={m.fiber} dot="bg-fiber" />
              </div>
              <Link to={`/alimento/${selected.id}?meal=${meal}&date=${date}`} className="mt-3 block text-center text-sm font-medium text-primary-container">Ver detalle completo</Link>
            </div>
          </section>
        )}

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Icon name={query ? 'search' : 'history'} className="text-primary-container" />
              {query ? `Resultados (${results.length})` : 'Frecuentes y recientes'}
            </h2>
            <Link to="/explorar" className="text-sm font-medium text-primary-container">Ver catálogo</Link>
          </div>
          <ul className="space-y-3">
            {results.map((f) => (
              <li key={f.id}>
                <button onClick={() => { setSelected(f); setGrams(100); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`card flex w-full items-center gap-3 p-3 text-left transition hover:bg-[#1b1b1f] ${selected?.id === f.id ? '!border-primary-container/60' : ''}`}>
                  <FoodThumb emoji={f.emoji} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{f.name}</p>
                    <p className="mb-1 text-xs text-zinc-500">100 g</p>
                    <div className="flex gap-1.5 text-[11px] font-semibold">
                      <span className="rounded-md bg-protein/15 px-1.5 py-0.5 text-protein">{g1(f.protein)}g prot</span>
                      <span className="rounded-md bg-carbs/15 px-1.5 py-0.5 text-carbs">{g1(f.carbs)}g carbs</span>
                      <span className="rounded-md bg-fat/15 px-1.5 py-0.5 text-fat">{g1(f.fat)}g grasa</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold">{f.kcal}</p>
                    <p className="text-[10px] uppercase text-zinc-500">kcal</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {results.length === 0 && (
            <div className="py-8 text-center text-sm text-zinc-500">
              Sin resultados para “{query}”.{' '}
              <Link to="/crear" className="text-primary-container underline">Créalo</Link>
            </div>
          )}
        </section>
      </main>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-white/5 bg-background/95 px-4 pb-3 pt-3 backdrop-blur-xl">
        <button onClick={add} disabled={!selected || grams <= 0} className="btn-primary w-full py-4 text-base">
          <Icon name="check_circle" />
          {selected && m ? `Añadir al ${mealLabel} (${grams}g · ${m.kcal} kcal)` : 'Selecciona un alimento'}
        </button>
      </div>
    </>
  );
}

function Quick({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card flex flex-col items-center gap-2 px-2 py-4 text-sm text-zinc-200 active:scale-95">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container/15 text-primary-container"><Icon name={icon} /></span>
      {label}
    </button>
  );
}

function Macro({ label, v, dot }: { label: string; v: number; dot: string }) {
  return (
    <div className="inner px-1 py-2">
      <p className="flex items-center justify-center gap-1 text-[11px] text-zinc-400"><span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{label}</p>
      <p className="font-display font-bold">{g1(v)}g</p>
    </div>
  );
}
