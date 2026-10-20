export type MealId = 'desayuno' | 'almuerzo' | 'merienda' | 'cena';

export interface Micro { name: string; amount: number; unit: string; pct: number } // por 100 g

export interface Food {
  id: string;
  name: string;
  category: string;
  emoji: string;
  kcal: number; // por 100 g
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  micros?: Micro[];
  custom?: boolean;
}

export interface Macros { kcal: number; protein: number; fat: number; carbs: number; fiber: number }

export interface Entry extends Macros {
  id: string;
  date: string; // YYYY-MM-DD
  meal: MealId;
  time: string; // HH:mm
  foodId: string;
  name: string;
  emoji: string;
  grams: number;
}

export interface Settings {
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AppState {
  customFoods: Food[];
  entries: Entry[];
  favorites: string[];
  settings: Settings;
}

export const MEALS: { id: MealId; label: string; icon: string; defaultTime: string }[] = [
  { id: 'desayuno', label: 'Desayuno', icon: 'bakery_dining', defaultTime: '08:30' },
  { id: 'almuerzo', label: 'Almuerzo', icon: 'lunch_dining', defaultTime: '14:00' },
  { id: 'merienda', label: 'Merienda', icon: 'nutrition', defaultTime: '17:30' },
  { id: 'cena', label: 'Cena', icon: 'dinner_dining', defaultTime: '21:00' },
];
