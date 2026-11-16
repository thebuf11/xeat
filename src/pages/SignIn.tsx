import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignIn } from '@clerk/react';
import { AuthLayout, Divider, Field, FormError, SocialButtons, SubmitButton, errorText, ssoUrls, useFinishNavigate, useSubmit, type SsoStrategy } from '../components/auth';

type Step = 'credentials' | 'mfa' | 'reset-request' | 'reset-code';

export default function SignIn() {
  const { signIn } = useSignIn();
  const navigate = useFinishNavigate();
  const [step, setStep] = useState<Step>('credentials');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const go = (s: Step) => { setError(null); setCode(''); setStep(s); };

  // Termina el inicio de sesión o, si Clerk pide verificar el dispositivo, envía un código por email.
  const continueAfterFirstFactor = async () => {
    if (signIn.status === 'complete') {
      const { error } = await signIn.finalize({ navigate });
      if (error) setError(errorText(error));
      return;
    }
    if (signIn.status === 'needs_second_factor' || signIn.status === 'needs_client_trust') {
      if (signIn.supportedSecondFactors.some((f) => f.strategy === 'email_code')) {
        const { error } = await signIn.mfa.sendEmailCode();
        if (error) return setError(errorText(error));
        return go('mfa');
      }
      return setError('Tu cuenta requiere un segundo paso de verificación que esta pantalla no admite.');
    }
    setError('No se pudo completar el inicio de sesión.');
  };

  const login = useSubmit(async () => {
    setError(null);
    const { error } = await signIn.password({ identifier: identifier.trim(), password });
    if (error) return setError(errorText(error));
    await continueAfterFirstFactor();
  });

  const verifyMfa = useSubmit(async () => {
    setError(null);
    const { error } = await signIn.mfa.verifyEmailCode({ code: code.trim() });
    if (error) return setError(errorText(error));
    await continueAfterFirstFactor();
  });

  const requestReset = useSubmit(async () => {
    setError(null);
    const created = await signIn.create({ identifier: identifier.trim() });
    if (created.error) return setError(errorText(created.error));
    const { error } = await signIn.resetPasswordEmailCode.sendCode();
    if (error) return setError(errorText(error));
    setPassword('');
    go('reset-code');
  });

  const submitReset = useSubmit(async () => {
    setError(null);
    const verified = await signIn.resetPasswordEmailCode.verifyCode({ code: code.trim() });
    if (verified.error) return setError(errorText(verified.error));
    const { error } = await signIn.resetPasswordEmailCode.submitPassword({ password });
    if (error) return setError(errorText(error));
    await continueAfterFirstFactor();
  });

  const sso = async (strategy: SsoStrategy) => {
    setError(null);
    const { error } = await signIn.sso({ strategy, ...ssoUrls() });
    if (error) setError(errorText(error));
  };

  const back = <button type="button" onClick={() => go('credentials')} className="w-full text-center text-sm text-zinc-400 hover:text-zinc-200">Volver</button>;

  if (step === 'mfa') {
    return (
      <AuthLayout title="Verifica que eres tú" subtitle="Te hemos enviado un código a tu email.">
        <form onSubmit={verifyMfa.onSubmit} className="space-y-4">
          <Field label="Código" value={code} onChange={setCode} inputMode="numeric" autoComplete="one-time-code" autoFocus />
          <FormError>{error}</FormError>
          <SubmitButton loading={verifyMfa.loading}>Verificar</SubmitButton>
        </form>
        {back}
      </AuthLayout>
    );
  }

  if (step === 'reset-request') {
    return (
      <AuthLayout title="Recuperar contraseña" subtitle="Te enviaremos un código a tu email.">
        <form onSubmit={requestReset.onSubmit} className="space-y-4">
          <Field label="Email" type="email" value={identifier} onChange={setIdentifier} autoComplete="email" inputMode="email" autoFocus />
          <FormError>{error}</FormError>
          <SubmitButton loading={requestReset.loading}>Enviar código</SubmitButton>
        </form>
        {back}
      </AuthLayout>
    );
  }

  if (step === 'reset-code') {
    return (
      <AuthLayout title="Nueva contraseña" subtitle={`Introduce el código enviado a ${identifier.trim()}.`}>
        <form onSubmit={submitReset.onSubmit} className="space-y-4">
          <Field label="Código" value={code} onChange={setCode} inputMode="numeric" autoComplete="one-time-code" autoFocus />
          <Field label="Nueva contraseña" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
          <FormError>{error}</FormError>
          <SubmitButton loading={submitReset.loading}>Cambiar y entrar</SubmitButton>
        </form>
        {back}
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Bienvenido a Xeat"
      subtitle="Inicia sesión para continuar"
      footer={<>¿No tienes cuenta? <Link to="/registro" className="font-semibold text-primary-container hover:underline">Regístrate</Link></>}
    >
      <SocialButtons onSso={sso} disabled={login.loading} />
      <Divider />
      <form onSubmit={login.onSubmit} className="space-y-4">
        <Field label="Email o usuario" value={identifier} onChange={setIdentifier} autoComplete="username" />
        <Field label="Contraseña" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
        <div className="-mt-1 text-right">
          <button type="button" onClick={() => go('reset-request')} className="text-xs font-medium text-zinc-400 hover:text-zinc-200">¿Olvidaste tu contraseña?</button>
        </div>
        <FormError>{error}</FormError>
        <SubmitButton loading={login.loading}>Iniciar sesión</SubmitButton>
      </form>
    </AuthLayout>
  );
}
