import type { ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { clamp } from '../lib/nutrition';

export const Icon = ({ name, className = '', fill = false }: { name: string; className?: string; fill?: boolean }) => (
  <span className={`material-symbols-outlined ${fill ? 'fill' : ''} ${className}`} aria-hidden="true">{name}</span>
);

export function Bar({ value, color = 'bg-primary-container', className = '' }: { value: number; color?: string; className?: string }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-ink/10 ${className}`}>
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${clamp(value)}%` }} />
    </div>
  );
}

export function Ring({ rings, size = 150, children }: { rings: { value: number; color: string }[]; size?: number; children?: ReactNode }) {
  const stroke = 11, gap = 4;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {rings.map((r, i) => {
          const rad = size / 2 - stroke / 2 - i * (stroke + gap);
          const c = 2 * Math.PI * rad;
          return (
            <g key={i}>
              <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke="rgb(var(--ink) / 0.07)" strokeWidth={stroke} />
              <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke={r.color} strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={c * (1 - clamp(r.value, 0, 100) / 100)} style={{ transition: 'stroke-dashoffset .6s' }} />
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

export function SettingsButton() {
  const nav = useNavigate();
  return (
    <button onClick={() => nav('/ajustes')} aria-label="Ajustes"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-surface-container-high text-zinc-300 transition hover:text-primary-container active:scale-95">
      <Icon name="settings" />
    </button>
  );
}

export function Header({ subtitle, back }: { subtitle?: string; back?: string | boolean }) {
  const { state } = useStore();
  const nav = useNavigate();
  const { pathname } = useLocation();
  return (
    <header className="pt-safe sticky top-0 z-30 flex items-center justify-between border-b border-ink/5 bg-background/85 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {back ? (
          <button onClick={() => (typeof back === 'string' ? nav(back) : nav(-1))} aria-label="Volver" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5">
            <Icon name="arrow_back" />
          </button>
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-high font-display text-xl font-extrabold text-primary-container">x</div>
        )}
        <div>
          <h1 className="font-display text-lg font-bold leading-tight">
            {back ? subtitle : `¡Hola${state.settings.name ? ', ' + state.settings.name : ''}!`}
          </h1>
          {!back && subtitle && <p className="text-sm text-zinc-400">{subtitle}</p>}
        </div>
      </div>
      {pathname !== '/ajustes' && <SettingsButton />}
    </header>
  );
}

const TABS = [
  { to: '/', label: 'Hoy', icon: 'monitoring' },
  { to: '/historial', label: 'Historial', icon: 'calendar_month' },
  { to: '/anadir', label: 'Añadir', icon: 'add', fab: true },
  { to: '/explorar', label: 'Explorar', icon: 'manage_search' },
];

export function BottomNav() {
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-ink/5 bg-background/90 backdrop-blur-xl">
      <ul className="grid grid-cols-4 items-end px-2 pb-2 pt-1">
        {TABS.map((t) => (
          <li key={t.to} className="flex justify-center">
            <NavLink to={t.to} end className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium ${t.fab ? '' : isActive ? 'text-primary-container' : 'text-zinc-500'}`}>
              {({ isActive }) => t.fab ? (
                <>
                  <span className={`-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-white shadow-[0_0_24px_rgba(249,115,22,0.5)] ${isActive ? 'ring-2 ring-ink/20' : ''}`}>
                    <Icon name="add" className="!text-[30px]" />
                  </span>
                  <span className="text-zinc-400">{t.label}</span>
                </>
              ) : (
                <>
                  <Icon name={t.icon} fill={isActive} />
                  {t.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Toast() {
  const { toastMsg } = useStore();
  if (!toastMsg) return null;
  return (
    <div role="status" className="fixed inset-x-0 bottom-28 z-50 mx-auto w-fit max-w-[90%] rounded-full border border-ink/10 bg-surface-container-highest px-5 py-3 text-sm font-medium shadow-xl">
      {toastMsg}
    </div>
  );
}

export function Stepper({ value, onChange, step = 10, min = 0, max = 5000 }: { value: number; onChange: (n: number) => void; step?: number; min?: number; max?: number }) {
  const set = (n: number) => onChange(clamp(Math.round(n), min, max));
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-black/30 p-1.5">
      <button onClick={() => set(value - step)} aria-label="Menos" className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-high active:scale-95"><Icon name="remove" /></button>
      <div className="flex items-baseline justify-center gap-1">
        <input type="number" inputMode="decimal" value={value || ''} placeholder="0" onChange={(e) => set(Number(e.target.value))}
          className="w-16 bg-transparent text-center font-display text-2xl font-bold outline-none" aria-label="Gramos" />
        <span className="text-sm text-zinc-500">g</span>
      </div>
      <button onClick={() => set(value + step)} aria-label="Más" className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-high active:scale-95"><Icon name="add" /></button>
    </div>
  );
}

export function FoodThumb({ emoji, size = 'h-14 w-14' }: { emoji: string; size?: string }) {
  return <div className={`${size} flex shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-2xl`}>{emoji}</div>;
}

export function Empty({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center text-zinc-500">
      <Icon name={icon} className="!text-[40px]" />
      <p className="max-w-[16rem] text-sm">{text}</p>
    </div>
  );
}
