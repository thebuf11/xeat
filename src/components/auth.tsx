import { useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { useSignIn } from '@clerk/react';
import { Icon } from './ui';

type SetActiveNavigate = NonNullable<NonNullable<Parameters<ReturnType<typeof useSignIn>['signIn']['finalize']>[0]>['navigate']>;

/** Traduce los códigos de error más habituales de Clerk al español. */
const MESSAGES: Record<string, string> = {
  form_identifier_not_found: 'No encontramos ninguna cuenta con ese email o usuario.',
  form_password_incorrect: 'La contraseña no es correcta.',
  form_password_pwned: 'Esta contraseña ha aparecido en una filtración. Elige otra.',
  form_password_length_too_short: 'La contraseña es demasiado corta (mínimo 8 caracteres).',
  form_password_not_strong_enough: 'La contraseña es demasiado débil.',
  form_password_validation_failed: 'La contraseña no es correcta.',
  form_identifier_exists: 'Ya existe una cuenta con ese email o usuario.',
  form_username_invalid_length: 'El usuario debe tener entre 4 y 64 caracteres.',
  form_username_invalid_character: 'El usuario solo puede tener letras, números, «-» y «_».',
  form_param_format_invalid: 'Revisa el formato de los datos.',
  form_param_nil: 'Rellena todos los campos.',
  form_code_incorrect: 'El código no es correcto.',
  verification_expired: 'El código ha caducado. Pide uno nuevo.',
  verification_failed: 'No se pudo verificar. Pide un código nuevo.',
  too_many_requests: 'Demasiados intentos. Espera un momento.',
  session_exists: 'Ya has iniciado sesión.',
  strategy_for_user_invalid: 'Esta cuenta usa otro método de acceso (prueba con Google o Apple).',
  not_allowed_access: 'Esta cuenta no tiene acceso.',
};

export function errorText(err: unknown): string {
  const e = err as { code?: string; longMessage?: string; message?: string; errors?: { code?: string; longMessage?: string; message?: string }[] } | null;
  const first = e?.errors?.[0] ?? e;
  if (first?.code && MESSAGES[first.code]) return MESSAGES[first.code];
  return first?.longMessage || first?.message || 'Algo ha ido mal. Inténtalo de nuevo.';
}

/** Navegación tras crear la sesión, tal como la recomienda Clerk (decorateUrl para Safari ITP). */
export function useFinishNavigate(): SetActiveNavigate {
  const navigate = useNavigate();
  return ({ decorateUrl }) => {
    const url = decorateUrl('/');
    if (url.startsWith('http')) window.location.href = url;
    else navigate(url, { replace: true });
  };
}

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="pt-safe pb-safe mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-high font-display text-3xl font-extrabold text-primary-container">x</div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-zinc-400">{subtitle}</p>
      </div>
      <div className="card space-y-5 p-5">{children}</div>
      {footer && <p className="mt-6 text-center text-sm text-zinc-400">{footer}</p>}
      <div id="clerk-captcha" className="mt-4 flex justify-center" />
    </div>
  );
}

export function Field({ label, type = 'text', value, onChange, autoComplete, error, autoFocus, inputMode, placeholder }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; autoComplete?: string; error?: string | null;
  autoFocus?: boolean; inputMode?: 'numeric' | 'email' | 'text'; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <label className="block">
      <span className="label">{label}</span>
      <div className="relative mt-1.5">
        <input
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          inputMode={inputMode}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={`input ${isPassword ? 'pr-12' : ''} ${error ? '!border-error/70' : ''}`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300">
            <Icon name={show ? 'visibility_off' : 'visibility'} className="!text-[20px]" />
          </button>
        )}
      </div>
      {error && <span className="mt-1.5 block text-xs text-error">{error}</span>}
    </label>
  );
}

export function FormError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <div role="alert" className="flex items-start gap-2 rounded-xl border border-error/30 bg-error/10 px-3 py-2.5 text-sm text-error">
      <Icon name="error" className="!text-[18px]" /> <span>{children}</span>
    </div>
  );
}

export function SubmitButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
      {loading ? <Icon name="progress_activity" className="animate-spin" /> : children}
    </button>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-3 text-xs text-zinc-500">
      <span className="h-px flex-1 bg-ink/10" /> o <span className="h-px flex-1 bg-ink/10" />
    </div>
  );
}

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
);

const AppleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.37 12.62c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.28-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.51 1.25-2.58-.03-.01-2.4-.92-2.42-3.65zM14.1 5.87c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.58.67-1.09 1.75-.96 2.79 1.02.08 2.05-.52 2.68-1.27z" />
  </svg>
);

export type SsoStrategy = 'oauth_google' | 'oauth_apple';

/** Botones de Google y Apple. `onSso` lanza la redirección al proveedor. */
export function SocialButtons({ onSso, disabled }: { onSso: (s: SsoStrategy) => Promise<void>; disabled?: boolean }) {
  const [pending, setPending] = useState<SsoStrategy | null>(null);
  const go = async (s: SsoStrategy) => {
    setPending(s);
    try { await onSso(s); } finally { setPending(null); }
  };
  const btn = (s: SsoStrategy, label: string, logo: ReactNode) => (
    <button type="button" onClick={() => go(s)} disabled={disabled || !!pending} className="btn-ghost w-full py-3 disabled:opacity-50">
      {pending === s ? <Icon name="progress_activity" className="animate-spin !text-[18px]" /> : logo}
      {label}
    </button>
  );
  return (
    <div className="space-y-2.5">
      {btn('oauth_google', 'Continuar con Google', <GoogleLogo />)}
      {btn('oauth_apple', 'Continuar con Apple', <AppleLogo />)}
    </div>
  );
}

/** Pequeño helper para formularios: evita el submit por defecto y gestiona el estado de carga. */
export function useSubmit(fn: () => Promise<void>) {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try { await fn(); } finally { setLoading(false); }
  };
  return { loading, onSubmit };
}

export const ssoUrls = () => ({
  redirectUrl: `${window.location.origin}/`,
  redirectCallbackUrl: `${window.location.origin}/sso-callback`,
});
