import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { SEED_FOODS } from './data/foods';
import { macrosFor } from './lib/nutrition';
import type { AppState, Entry, Food, MealId, Settings } from './types';

const KEY = 'xeat:v1';

const DEFAULTS: AppState = {
  customFoods: [],
  entries: [],
  favorites: [],
  settings: { name: '', kcal: 2000, protein: 140, carbs: 210, fat: 65, theme: 'dark' },
};

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const p = JSON.parse(raw) as Partial<AppState>;
    return { ...DEFAULTS, ...p, settings: { ...DEFAULTS.settings, ...p.settings } };
  } catch {
    return DEFAULTS;
  }
}

type Action =
  | { type: 'addEntry'; entry: Entry }
  | { type: 'deleteEntry'; id: string }
  | { type: 'addFood'; food: Food }
  | { type: 'deleteFood'; id: string }
  | { type: 'toggleFav'; id: string }
  | { type: 'settings'; settings: Settings }
  | { type: 'reset' };

function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case 'addEntry': return { ...s, entries: [...s.entries, a.entry] };
    case 'deleteEntry': return { ...s, entries: s.entries.filter((e) => e.id !== a.id) };
    case 'addFood': return { ...s, customFoods: [...s.customFoods, a.food] };
    case 'deleteFood': return { ...s, customFoods: s.customFoods.filter((f) => f.id !== a.id), favorites: s.favorites.filter((f) => f !== a.id) };
    case 'toggleFav': return { ...s, favorites: s.favorites.includes(a.id) ? s.favorites.filter((f) => f !== a.id) : [...s.favorites, a.id] };
    case 'settings': return { ...s, settings: a.settings };
    case 'reset': return DEFAULTS;
  }
}

interface Ctx {
  state: AppState;
  foods: Food[];
  getFood: (id: string) => Food | undefined;
  logFood: (food: Food, grams: number, meal: MealId, date: string, time: string) => void;
  deleteEntry: (id: string) => void;
  addFood: (food: Omit<Food, 'id' | 'custom'>) => Food;
  deleteFood: (id: string) => void;
  toggleFav: (id: string) => void;
  saveSettings: (s: Settings) => void;
  reset: () => void;
  toast: (msg: string) => void;
  toastMsg: string | null;
}

const StoreCtx = createContext<Ctx | null>(null);
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* almacenamiento lleno o bloqueado */ }
  }, [state]);

  useEffect(() => {
    const { theme } = state.settings;
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f6f6f8' : '#0e0e10');
  }, [state.settings.theme]);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2200);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const foods = useMemo(() => [...state.customFoods, ...SEED_FOODS], [state.customFoods]);

  const value = useMemo<Ctx>(() => ({
    state,
    foods,
    getFood: (id) => foods.find((f) => f.id === id),
    logFood: (food, grams, meal, date, time) =>
      dispatch({
        type: 'addEntry',
        entry: { id: uid(), date, meal, time, foodId: food.id, name: food.name, emoji: food.emoji, grams, ...macrosFor(food, grams) },
      }),
    deleteEntry: (id) => dispatch({ type: 'deleteEntry', id }),
    addFood: (f) => {
      const food: Food = { ...f, id: 'c-' + uid(), custom: true };
      dispatch({ type: 'addFood', food });
      return food;
    },
    deleteFood: (id) => dispatch({ type: 'deleteFood', id }),
    toggleFav: (id) => dispatch({ type: 'toggleFav', id }),
    saveSettings: (settings) => dispatch({ type: 'settings', settings }),
    reset: () => dispatch({ type: 'reset' }),
    toast: setToastMsg,
    toastMsg,
  }), [state, foods, toastMsg]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('useStore fuera de StoreProvider');
  return c;
}

/** Hook auxiliar: alimentos recientes/frecuentes ordenados por nº de usos */
export function useFrequentFoods(limit = 6) {
  const { state, foods } = useStore();
  return useMemo(() => {
    const count = new Map<string, number>();
    state.entries.forEach((e) => count.set(e.foodId, (count.get(e.foodId) ?? 0) + 1));
    const used = [...count.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => foods.find((f) => f.id === id)).filter(Boolean) as Food[];
    const fill = foods.filter((f) => !count.has(f.id));
    return [...used, ...fill].slice(0, limit);
  }, [state.entries, foods, limit]);
}
