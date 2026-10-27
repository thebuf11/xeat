import { useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Bar, Header, Icon, Stepper } from '../components/ui';
import { nowTime, todayKey } from '../lib/dates';
import { clamp, energySplit, g1, macrosFor, pct } from '../lib/nutrition';
import { useStore } from '../store';
import { MEALS, type MealId } from '../types';

export default function FoodDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { getFood, state, toggleFav, logFood, toast, deleteFood } = useStore();
  const nav = useNavigate();
  const food = id ? getFood(id) : undefined;
  const date = params.get('date') || todayKey();
  const [grams, setGrams] = useState(100);
  const [meal, setMeal] = useState<MealId>((params.get('meal') as MealId) || 'almuerzo');

  if (!food) return <Navigate to="/explorar" replace />;

  const m = macrosFor(food, grams);
  const split = energySplit(m);
  const goals = state.settings;
  const fav = state.favorites.includes(food.id);
  const k = grams / 100;

  const register = () => {
    if (grams <= 0) return;
    logFood(food, grams, meal, date, nowTime());
    toast(`Registrado en ${MEALS.find((x) => x.id === meal)!.label}`);
    nav(date === todayKey() ? '/' : `/?d=${date}`);
  };

  const remove = () => {
    if (confirm(`¿Eliminar "${food.name}" de tus alimentos?`)) {
      deleteFood(food.id);
      nav('/explorar', { replace: true });
    }
  };

  return (
    <>
      <Header back subtitle="Detalle de alimento" />
      <main className="space-y-4 px-4 pb-32 pt-4">
        <section className="card p-4">
          <div className="relative mb-4 flex h-44 items-center justify-center rounded-xl bg-gradient-to-br from-primary-container/20 via-surface-container-high to-surface-container-low text-8xl">
            {food.emoji}
            <button onClick={() => toggleFav(food.id)} aria-label={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'} aria-pressed={fav}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50">
              <Icon name="favorite" fill={fav} className={fav ? 'text-primary-container' : ''} />
            </button>
          </div>
          <p className="label !text-primary-container">{food.custom ? 'Creado por ti' : 'Base de datos Xeat'} · {food.category}</p>
          <h2 className="mb-4 mt-1 font-display text-2xl font-bold leading-tight">{food.name}</h2>
          <div className="inner flex items-center justify-between p-3">
            <div>
              <p className="text-xs text-zinc-500">Tamaño de porción</p>
              <p className="font-display font-semibold">Gramaje activo</p>
            </div>
            <Stepper value={grams} onChange={setGrams} />
          </div>
        </section>

        <section className="card p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container/15 text-primary-container"><Icon name="local_fire_department" /></div>
              <div>
                <p className="label">Aporte energético</p>
                <p className="font-display text-3xl font-bold">{m.kcal}<span className="ml-1 text-sm font-normal text-zinc-400">kcal</span></p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500">Meta diaria</p>
              <span className="rounded-full bg-primary-container/15 px-2.5 py-1 text-xs font-semibold text-primary-container">{pct(m.kcal, goals.kcal)}% cubierto</span>
            </div>
          </div>
          <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-ink/10">
            <div className="bg-protein" style={{ width: `${split.protein}%` }} />
            <div className="bg-carbs" style={{ width: `${split.fat}%` }} />
            <div className="bg-fat" style={{ width: `${split.carbs}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-protein" />Proteínas {split.protein}%</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-carbs" />Grasas {split.fat}%</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-fat" />Carbos {split.carbs}%</span>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <Tile label="Proteína" v={m.protein} color="text-protein" note={`${clamp(pct(m.protein, goals.protein), 0, 999)}% de tu objetivo`} />
          <Tile label="Grasas totales" v={m.fat} color="text-carbs" note={`${clamp(pct(m.fat, goals.fat), 0, 999)}% de tu objetivo`} />
          <Tile label="Carbohidratos" v={m.carbs} color="text-fat" note={m.carbs < 5 ? 'Bajo en carbohidratos' : `${pct(m.carbs, goals.carbs)}% de tu objetivo`} />
          <Tile label="Fibra dietética" v={m.fiber} color="text-fiber" note={m.fiber >= 3 ? 'Buena fuente de fibra' : 'Aporte bajo de fibra'} />
        </div>

        {food.micros && food.micros.length > 0 && (
          <section className="card p-4">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/15 text-primary-container"><Icon name="vital_signs" /></div>
                <div>
                  <h3 className="font-display text-lg font-semibold leading-tight">Vitaminas y minerales</h3>
                  <p className="text-xs text-zinc-500">% del Valor Diario Recomendado</p>
                </div>
              </div>
              <span className="rounded-full bg-ink/5 px-2.5 py-1 text-xs">{grams} g</span>
            </div>
            <ul className="space-y-4">
              {[...food.micros].sort((a, b) => b.pct - a.pct).map((x) => {
                const p = Math.round(x.pct * k);
                return (
                  <li key={x.name}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-semibold">{x.name}{p >= 100 && <span className="ml-2 rounded-md bg-primary-container/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-container">Muy alto</span>}</span>
                      <span>{g1(x.amount * k)} {x.unit} <span className={p >= 50 ? 'text-primary-container' : 'text-zinc-500'}>({p}%)</span></span>
                    </div>
                    <Bar value={p} />
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section className="card p-4">
          <p className="label mb-3">Destino del registro</p>
          <div className="grid grid-cols-4 gap-2">
            {MEALS.map((x) => (
              <button key={x.id} onClick={() => setMeal(x.id)} aria-pressed={meal === x.id}
                className={`flex flex-col items-center gap-1 rounded-xl py-3 text-xs font-semibold transition ${meal === x.id ? 'bg-primary-container text-white shadow-[0_0_18px_rgba(249,115,22,0.4)]' : 'bg-ink/5 text-zinc-400'}`}>
                <Icon name={x.icon} />{x.label}
              </button>
            ))}
          </div>
        </section>

        {food.custom && (
          <button onClick={remove} className="w-full py-2 text-sm text-error/80 hover:text-error">Eliminar este alimento</button>
        )}
      </main>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md bg-gradient-to-t from-background via-background to-transparent px-4 pb-3 pt-6">
        <button onClick={register} disabled={grams <= 0} className="btn-primary w-full py-4 text-base">
          <Icon name="bookmark_add" /> Registrar esta porción en mi diario
        </button>
      </div>
    </>
  );
}

function Tile({ label, v, color, note }: { label: string; v: number; color: string; note: string }) {
  return (
    <div className="card p-4">
      <p className={`label ${color}`}>{label}</p>
      <p className="mt-2 font-display text-3xl font-bold">{g1(v)}<span className="text-sm font-normal text-zinc-500">g</span></p>
      <p className="mt-1 text-xs text-zinc-500">{note}</p>
    </div>
  );
}
