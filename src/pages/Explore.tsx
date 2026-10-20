import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Empty, FoodThumb, Header, Icon } from '../components/ui';
import { CATEGORIES } from '../data/foods';
import { g1 } from '../lib/nutrition';
import { useStore } from '../store';

export default function Explore() {
  const { foods, state } = useStore();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('Todos');
  const [onlyFav, setOnlyFav] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return foods.filter((f) =>
      (cat === 'Todos' || (cat === 'Mis alimentos' ? f.custom : f.category === cat)) &&
      (!onlyFav || state.favorites.includes(f.id)) &&
      (!q || f.name.toLowerCase().includes(q)),
    );
  }, [foods, query, cat, onlyFav, state.favorites]);

  return (
    <>
      <Header subtitle="Explorar" />
      <main className="space-y-4 px-4 py-4">
        <div className="flex gap-3">
          <label className="relative block flex-1">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar en el catálogo" className="input !pl-12" aria-label="Buscar en el catálogo" />
          </label>
          <button onClick={() => setOnlyFav(!onlyFav)} aria-pressed={onlyFav} aria-label="Solo favoritos"
            className={`btn-ghost h-[50px] w-[50px] ${onlyFav ? '!border-primary-container/50 !text-primary-container' : ''}`}>
            <Icon name="favorite" fill={onlyFav} />
          </button>
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`chip ${cat === c ? 'chip-active' : ''}`}>{c}</button>
          ))}
        </div>

        <Link to="/crear" className="card flex items-center gap-3 border-dashed p-4 text-primary-container">
          <Icon name="add_circle" /> <span className="font-semibold">Crear alimento o plato propio</span>
        </Link>

        <ul className="space-y-3">
          {list.map((f) => (
            <li key={f.id}>
              <Link to={`/alimento/${f.id}`} className="card flex items-center gap-3 p-3 transition hover:bg-[#1b1b1f]">
                <FoodThumb emoji={f.emoji} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate font-semibold">
                    {f.name}{state.favorites.includes(f.id) && <Icon name="favorite" fill className="!text-[14px] text-primary-container" />}
                  </p>
                  <p className="mb-1 text-xs text-zinc-500">{f.category} · 100 g</p>
                  <div className="flex gap-1.5 text-[11px] font-semibold">
                    <span className="rounded-md bg-protein/15 px-1.5 py-0.5 text-protein">{g1(f.protein)}g P</span>
                    <span className="rounded-md bg-carbs/15 px-1.5 py-0.5 text-carbs">{g1(f.carbs)}g C</span>
                    <span className="rounded-md bg-fat/15 px-1.5 py-0.5 text-fat">{g1(f.fat)}g G</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold">{f.kcal}</p>
                  <p className="text-[10px] uppercase text-zinc-500">kcal</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {list.length === 0 && <Empty icon="search_off" text="No hay alimentos que coincidan." />}
      </main>
    </>
  );
}
