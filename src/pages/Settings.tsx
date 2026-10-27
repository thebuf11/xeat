import { useState } from 'react';
import { Header, Icon } from '../components/ui';
import { exportCsv } from '../lib/csv';
import { useStore } from '../store';
import type { Theme } from '../types';

const THEMES: { id: Theme; label: string; icon: string }[] = [
  { id: 'light', label: 'Claro', icon: 'light_mode' },
  { id: 'dark', label: 'Oscuro', icon: 'dark_mode' },
];

export default function Settings() {
  const { state, saveSettings, reset, toast } = useStore();
  const [f, setF] = useState({
    name: state.settings.name,
    kcal: String(state.settings.kcal),
    protein: String(state.settings.protein),
    carbs: String(state.settings.carbs),
    fat: String(state.settings.fat),
  });

  const nums = { kcal: Number(f.kcal), protein: Number(f.protein), carbs: Number(f.carbs), fat: Number(f.fat) };
  const valid = Object.values(nums).every((x) => Number.isFinite(x) && x > 0);
  const macroKcal = nums.protein * 4 + nums.carbs * 4 + nums.fat * 9;

  const save = () => {
    if (!valid) return;
    saveSettings({ ...state.settings, name: f.name.trim(), ...nums });
    toast('Objetivos guardados');
  };

  const wipe = () => {
    if (confirm('Se borrarán todos tus registros, alimentos creados y ajustes. ¿Continuar?')) {
      reset();
      setF({ name: '', kcal: '2000', protein: '140', carbs: '210', fat: '65' });
      toast('Datos borrados');
    }
  };

  const field = (key: keyof typeof f, label: string, unit?: string, type = 'text') => (
    <label className="block">
      <span className="label">{label}</span>
      <div className="relative mt-1.5">
        <input type={type} inputMode={type === 'number' ? 'numeric' : undefined} value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })} className="input" />
        {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">{unit}</span>}
      </div>
    </label>
  );

  return (
    <>
      <Header back="/" subtitle="Ajustes" />
      <main className="space-y-5 px-4 pb-10 pt-4">
        <section className="card space-y-4 p-4">
          <h2 className="font-display text-lg font-semibold">Perfil</h2>
          {field('name', 'Tu nombre')}
        </section>

        <section className="card space-y-4 p-4">
          <h2 className="font-display text-lg font-semibold">Objetivos diarios</h2>
          {field('kcal', 'Calorías', 'kcal', 'number')}
          <div className="grid grid-cols-3 gap-3">
            {field('protein', 'Proteína', 'g', 'number')}
            {field('carbs', 'Carbos', 'g', 'number')}
            {field('fat', 'Grasas', 'g', 'number')}
          </div>
          <p className={`text-xs ${Math.abs(macroKcal - nums.kcal) > nums.kcal * 0.1 ? 'text-primary-container' : 'text-zinc-500'}`}>
            Tus macros suman {Math.round(macroKcal)} kcal frente a {nums.kcal || 0} kcal de meta.
          </p>
          <button onClick={save} disabled={!valid} className="btn-primary w-full py-3.5"><Icon name="check" /> Guardar objetivos</button>
        </section>

        <section className="card space-y-4 p-4">
          <h2 className="font-display text-lg font-semibold">Personalizar</h2>
          <div>
            <span className="label">Apariencia</span>
            <div role="radiogroup" aria-label="Apariencia" className="mt-1.5 grid grid-cols-2 gap-1 rounded-2xl border border-ink/[0.08] bg-inner p-1">
              {THEMES.map((t) => {
                const active = state.settings.theme === t.id;
                return (
                  <button key={t.id} role="radio" aria-checked={active} onClick={() => saveSettings({ ...state.settings, theme: t.id })}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${active ? 'bg-primary-container text-white' : 'text-zinc-400'}`}>
                    <Icon name={t.icon} className="!text-[20px]" fill={active} /> {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="font-display text-lg font-semibold">Tus datos</h2>
          <p className="text-sm text-zinc-500">Todo se guarda solo en este dispositivo ({state.entries.length} registros).</p>
          <button onClick={() => exportCsv(state.entries)} disabled={!state.entries.length} className="btn-ghost w-full py-3"><Icon name="download" /> Exportar CSV</button>
          <button onClick={wipe} className="btn-ghost w-full py-3 !text-error"><Icon name="delete_forever" /> Borrar todos los datos</button>
        </section>
      </main>
    </>
  );
}
