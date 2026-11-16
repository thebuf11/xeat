import { HandleSSOCallback } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui';
import { useFinishNavigate } from '../components/auth';

/** Página a la que vuelve el usuario tras autenticarse con Google o Apple. */
export default function SsoCallback() {
  const navigate = useNavigate();
  const finish = useFinishNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-zinc-400">
      <Icon name="progress_activity" className="animate-spin text-primary-container" />
      <p className="text-sm">Iniciando sesión…</p>
      <HandleSSOCallback navigateToApp={finish} navigateToSignIn={() => navigate('/login', { replace: true })} navigateToSignUp={() => navigate('/registro', { replace: true })} />
    </div>
  );
}
