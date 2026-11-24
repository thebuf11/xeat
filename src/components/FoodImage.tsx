import { useState } from 'react';
import { NutriBadge, useFoodImage } from './useFoodImage';
import type { Food } from '../types';

/** Miniatura para listas: foto si el archivo existe, si no emoji. */
export function FoodImageThumb({ food, size = 'h-14 w-14', className = '' }: { food: Food; size?: string; className?: string }) {
  const src = useFoodImage(food);

  if (src) {
    return (
      <img src={src} alt={food.name} loading="lazy"
        className={`${size} shrink-0 rounded-xl border border-ink/10 bg-white object-contain p-1 ${className}`} />
    );
  }

  return (
    <div className={`${size} flex shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-2xl ${className}`}>
      {food.emoji}
    </div>
  );
}

/** Imagen grande con despliegue para verificar que el producto es el correcto. */
export function FoodImageSheet({ food }: { food: Food }) {
  const [open, setOpen] = useState(false);
  const src = useFoodImage(food);
  const hasMeta = Boolean(food.store || food.package || food.nutriScore);

  if (!food.image) {
    return (
      <div className="inner flex flex-col items-center gap-3 p-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-container-high text-5xl">{food.emoji}</div>
        <p className="text-xs text-zinc-400">
          {hasMeta ? 'Sin foto de producto todavía — coloca la imagen en public/products/' : 'Alimento genérico: sin foto de producto'}
        </p>
      </div>
    );
  }

  if (!src) {
    return (
      <div className="inner space-y-3 p-4">
        <p className="label">Foto del producto</p>
        <div className="flex h-24 items-center justify-center rounded-xl bg-surface-container-high/60 text-3xl text-zinc-400">{food.emoji}</div>
        <p className="text-center text-[11px] text-zinc-500">
          Buscando <code className="rounded bg-black/40 px-1">public/products/{food.image}.webp</code>
        </p>
      </div>
    );
  }

  return (
    <div className="inner space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label">Foto del producto</p>
          <p className="truncate font-display text-base font-semibold leading-tight">{food.name}</p>
          <p className="text-xs text-zinc-400">
            {food.package ? `Envase ${food.package}` : 'Envase habitual'} · {food.store ?? 'Marca'}
          </p>
        </div>
        {food.nutriScore && <NutriBadge score={food.nutriScore} />}
      </div>

      <div
        role="button" tabIndex={0}
        aria-expanded={open} aria-label={open ? 'Cerrar imagen del producto' : 'Ampliar imagen del producto'}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className="relative flex cursor-zoom-in items-center justify-center overflow-hidden rounded-xl bg-white p-3"
      >
        <img src={src} alt={`Envase de ${food.name}`}
          className={`transition-all duration-300 ${open ? 'max-h-[60vh] w-full object-contain' : 'max-h-40 w-auto object-contain'}`} />
        {!open && (
          <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[11px] font-semibold text-white">
            <span className="material-symbols-outlined !text-[16px]">zoom_in</span> Ampliar
          </span>
        )}
      </div>

      <p className="text-center text-[11px] text-zinc-500">Toca la imagen para verificar el envase antes de registrar</p>
    </div>
  );
}
