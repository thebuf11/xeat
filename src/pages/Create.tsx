import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Icon } from '../components/ui';
import { g1 } from '../lib/nutrition';
import { useStore } from '../store';

const EMOJIS = ['🍽️', '🍲', '🥗', '🍛', '🥪', '🍳', '🍕', '🍔', '🌮', '🍜', '🥘', '🍰', '🥤', '🍎'];

interface Ing { foodId: string; grams: number }

const n = (v: string) => Math.max(0, Number(v.replace(',', '.')) || 0);

export default function Create() {
  const { foods, addFood, toast } = useStore();
  const nav = useNavigate();
  const [mode, setMode] = useState<'alimento' | 'plato'>('plato');
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [v, setV] = useState({ kcal: '', protein: '', carbs: '', fat: '', fiber: '' });
  const [ings, setIngs] = useState<Ing[]>([]);
  const [pick, setPick] = useState('');
  const [pickG, setPickG] = useState('100');

  // Totales y valores por 100 g del plato
  const dish = useMemo(() => {
    const t = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, grams: 0 };
    ings.forEach((i) => {
      const f = foods.find((x) => x.id === i.foodId);
      if (!f) return;
      const k = i.grams / 100;
      t.kcal += f.kcal * k; t.protein += f.protein * k; t.carbs += f.carbs * k; t.fat += f.fat * k; t.fiber += f.fiber * k; t.grams += i.grams;
    });
    const per = (x: number) => (t.grams ? (x / t.grams) * 100 : 0);
    return { ...t, per: { kcal: per(t.kcal), protein: per(t.protein), carbs: per(t.carbs), fat: per(t.fat), fiber: per(t.fiber) } };
  }, [ings, foods]);

  const addIng = () => {
    const g = n(pickG);
    if (!pick || g <= 0) return;
    setIngs([...ings, { foodId: pick, grams: g }]);
    setPick('');
  };

  const valid = name.trim().length > 0 && (mode === 'alimento' ? n(v.kcal) > 0 || n(v.protein) + n(v.carbs) + n(v.fat) > 0 : dish.grams > 0);

  const save = () => {
    if (!valid) return;
    const src = mode === 'alimento'
      ? { kcal: n(v.kcal), protein: n(v.protein), carbs: n(v.carbs), fat: n(v.fat), fiber: n(v.fiber) }
      : dish.per;
    const food = addFood({
      name: name.trim(),
      category: 'Mis alimentos',
      emoji: mode === 'plato' ? emoji : emoji === EMOJIS[0] ? '🍴' : emoji,
      kcal: Math.round(src.kcal),
      protein: Math.round(src.protein * 10) / 10,
      carbs: Math.round(src.carbs * 10) / 10,
      fat: Math.round(src.fat * 10) / 10,
      fiber: Math.round(src.fiber * 10) / 10,
    });
    toast(`"${food.name}" guardado`);
    nav(`/alimento/${food.id}`, { replace: true });
  };

  const fields: { key: keyof typeof v; label: string; unit: string }[] = [
    { key: 'kcal', label: 'Calorías', unit: 'kcal' },
    { key: 'protein', label: 'Proteína', unit: 'g' },
    { key: 'carbs', label: 'Carbohidratos', unit: 'g' },
    { key: 'fat', label: 'Grasas', unit: 'g' },
    { key: 'fiber', label: 'Fibra', unit: 'g' },
  ];

  return (
    <>
      <Header back subtitle="Crear" />
      <main className="space-y-5 px-4 pb-32 pt-4">
        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-ink/[0.08] bg-card p-1">
          {(['plato', 'alimento'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`rounded-xl py-2.5 text-sm font-semibold capitalize transition ${mode === m ? 'bg-primary-container text-white' : 'text-zinc-400'}`}>{m === 'plato' ? 'Plato (ingredientes)' : 'Alimento (por 100 g)'}</button>
          ))}
        </div>

        <section className="card space-y-4 p-4">
          <label className="block">
            <span className="label">Nombre</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={mode === 'plato' ? 'Ej. Lentejas de mamá' : 'Ej. Barrita proteica'} className="input mt-1.5" />
          </label>
          <div>
            <span className="label">Icono</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button key={e} onClick={() => setEmoji(e)} aria-pressed={emoji === e} className={`h-11 w-11 rounded-xl text-xl ${emoji === e ? 'bg-primary-container/25 ring-2 ring-primary-container' : 'bg-ink/5'}`}>{e}</button>
              ))}
            </div>
          </div>
        </section>

        {mode === 'alimento' ? (
          <section className="card p-4">
            <p className="label mb-3">Valores nutricionales por 100 g</p>
            <div className="grid grid-cols-2 gap-3">
              {fields.map((f) => (
                <label key={f.key} className="block">
                  <span className="text-xs text-zinc-400">{f.label} ({f.unit})</span>
                  <input inputMode="decimal" value={v[f.key]} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} placeholder="0" className="input mt-1" />
                </label>
              ))}
            </div>
          </section>
        ) : (
          <section className="card space-y-4 p-4">
            <p className="label">Ingredientes</p>
            {ings.length === 0 && <p className="text-sm text-zinc-500">Añade los ingredientes con su peso (en crudo o como los uses).</p>}
            <ul className="space-y-2">
              {ings.map((i, idx) => {
                const f = foods.find((x) => x.id === i.foodId)!;
                return (
                  <li key={idx} className="inner flex items-center gap-3 p-3">
                    <span className="text-xl">{f.emoji}</span>
                    <span className="min-w-0 flex-1 truncate text-sm">{f.name}</span>
                    <span className="text-sm text-zinc-400">{i.grams} g</span>
                    <button onClick={() => setIngs(ings.filter((_, j) => j !== idx))} aria-label="Quitar ingrediente" className="text-zinc-600 hover:text-error"><Icon name="close" className="!text-[20px]" /></button>
                  </li>
                );
              })}
            </ul>
            <div className="flex gap-2">
              <select value={pick} onChange={(e) => setPick(e.target.value)} className="input min-w-0 flex-1 !px-3" aria-label="Ingrediente">
                <option value="">Elegir alimento…</option>
                {foods.map((f) => <option key={f.id} value={f.id}>{f.emoji} {f.name}</option>)}
              </select>
              <input inputMode="decimal" value={pickG} onChange={(e) => setPickG(e.target.value)} className="input !w-20 !px-3 text-center" aria-label="Gramos" />
              <button onClick={addIng} disabled={!pick} aria-label="Añadir ingrediente" className="btn-primary w-12"><Icon name="add" /></button>
            </div>
            {dish.grams > 0 && (
              <div className="inner p-3 text-sm">
                <p className="mb-1 font-semibold">Total del plato: {Math.round(dish.grams)} g · {Math.round(dish.kcal)} kcal</p>
                <p className="text-xs text-zinc-400">{g1(dish.protein)}g prot · {g1(dish.carbs)}g carbos · {g1(dish.fat)}g grasas · {g1(dish.fiber)}g fibra</p>
                <p className="mt-1 text-xs text-zinc-500">Por 100 g: {Math.round(dish.per.kcal)} kcal</p>
              </div>
            )}
          </section>
        )}
      </main>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md bg-gradient-to-t from-background via-background to-transparent px-4 pb-3 pt-6">
        <button onClick={save} disabled={!valid} className="btn-primary w-full py-4 text-base"><Icon name="save" /> Guardar en mis alimentos</button>
      </div>
    </>
  );
}
