import { useEffect, useState } from 'react';
import type { Food } from '../types';

/**
 * Foto de producto local. Convenio de nombres:
 *   public/products/<slug>.<ext>   (ext = webp | png | jpg | jpeg)
 * Se prueban las extensiones en orden; si no hay ninguna, se cae al emoji.
 * El slug es estable (no cambia al editar el nombre), así que las fotos que
 * ya hayas colocado siguen sirviendo.
 */
const IMAGE_BASE = `${import.meta.env.BASE_URL ?? '/'}products/`;
const EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg'] as const;

const cache = new Map<string, string | null>();

async function resolveImage(slug: string): Promise<string | null> {
  if (cache.has(slug)) return cache.get(slug)!;
  for (const ext of EXTENSIONS) {
    const url = `${IMAGE_BASE}${slug}.${ext}`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      // En dev Vite responde la página de inicio con 200 y text/html para rutas
      // inexistentes (SPA fallback), así que validamos también el content-type.
      const type = res.headers.get('content-type') ?? '';
      if (res.ok && res.url === new URL(url, window.location.href).href && !type.startsWith('text/html')) {
        cache.set(slug, url);
        return url;
      }
    } catch {
      /* siguiente extensión */
    }
  }
  cache.set(slug, null);
  return null;
}

/** URL resuelta de la foto del alimento, o null si no hay / aún se está resolviendo. */
export function useFoodImage(food: Food): string | null {
  const [src, setSrc] = useState<string | null>(() => (food.image ? cache.get(food.image) ?? null : null));

  useEffect(() => {
    if (!food.image) return;
    const cached = cache.get(food.image);
    if (cached !== undefined) {
      setSrc(cached);
      return;
    }
    let alive = true;
    resolveImage(food.image).then((url) => {
      if (alive) setSrc(url);
    });
    return () => {
      alive = false;
    };
  }, [food.image]);

  return src;
}

const NUTRI: Record<string, { bg: string; label: string }> = {
  A: { bg: 'bg-[#4fc465] text-[#04350f]', label: 'Nutri-Score A · muy buena calidad nutricional' },
  B: { bg: 'bg-[#9fcf3f] text-[#2c3a04]', label: 'Nutri-Score B · buena calidad nutricional' },
  C: { bg: 'bg-[#f9d423] text-[#4a3c00]', label: 'Nutri-Score C · calidad nutricional media' },
  D: { bg: 'bg-[#f0872f] text-[#4a2400]', label: 'Nutri-Score D · calidad nutricional baja' },
  E: { bg: 'bg-[#e63b34] text-white', label: 'Nutri-Score E · baja calidad nutricional' },
};

export function NutriBadge({ score }: { score: NonNullable<Food['nutriScore']> }) {
  const n = NUTRI[score];
  return (
    <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${n.bg}`} title={n.label} aria-label={n.label}>
      Nutri {score}
    </span>
  );
}
