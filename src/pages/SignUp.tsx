import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignUp } from '@clerk/react';
import { AuthLayout, Divider, Field, FormError, SocialButtons, SubmitButton, errorText, ssoUrls, useFinishNavigate, useSubmit, type SsoStrategy } from '../components/auth';

export default function SignUp() {
  const { signUp } = useSignUp();
  const navigate = useFinishNavigate();
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const finishOrVerify = async () => {
    if (signUp.status === 'complete') {
      const { error } = await signUp.finalize({ navigate });
      if (error) setError(errorText(error));
      return;
    }
    if (signUp.unverifiedFields.includes('email_address')) {
      const { error } = await signUp.verifications.sendEmailCode();
      if (error) return setError(errorText(error));
      setCode('');
      setStep('verify');
      return;
    }
    setError('Faltan datos para crear la cuenta.');
  };

  const register = useSubmit(async () => {
    setError(null);
    const { error } = await signUp.password({ username: username.trim(), emailAddress: email.trim(), password });
    if (error) return setError(errorText(error));
    await finishOrVerify();
  });

  const verify = useSubmit(async () => {
    setError(null);
    const { error } = await signUp.verifications.verifyEmailCode({ code: code.trim() });
    if (error) return setError(errorText(error));
    if (signUp.status !== 'complete') return setError('No se pudo completar el registro.');
    const fin = await signUp.finalize({ navigate });
    if (fin.error) setError(errorText(fin.error));
  });

  const resend = async () => {
    setError(null);
    const { error } = await signUp.verifications.sendEmailCode();
    setError(error ? errorText(error) : null);
  };

  const sso = async (strategy: SsoStrategy) => {
    setError(null);
    const { error } = await signUp.sso({ strategy, ...ssoUrls() });
    if (error) setError(errorText(error));
  };

  if (step === 'verify') {
    return (
      <AuthLayout title="Revisa tu email" subtitle={`Te hemos enviado un código a ${email.trim()}.`}>
        <form onSubmit={verify.onSubmit} className="space-y-4">
          <Field label="Código" value={code} onChange={setCode} inputMode="numeric" autoComplete="one-time-code" autoFocus />
          <FormError>{error}</FormError>
          <SubmitButton loading={verify.loading}>Verificar y entrar</SubmitButton>
        </form>
        <div className="flex justify-between text-sm">
          <button type="button" onClick={() => { setError(null); setStep('form'); }} className="text-zinc-400 hover:text-zinc-200">Volver</button>
          <button type="button" onClick={resend} className="font-medium text-primary-container hover:underline">Reenviar código</button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a llevar el control de tus comidas"
      footer={<>¿Ya tienes cuenta? <Link to="/login" className="font-semibold text-primary-container hover:underline">Inicia sesión</Link></>}
    >
      <SocialButtons onSso={sso} disabled={register.loading} />
      <Divider />
      <form onSubmit={register.onSubmit} className="space-y-4">
        <Field label="Usuario" value={username} onChange={setUsername} autoComplete="username" />
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" inputMode="email" />
        <Field label="Contraseña" type="password" value={password} onChange={setPassword} autoComplete="new-password" placeholder="Mínimo 8 caracteres" />
        <FormError>{error}</FormError>
        <SubmitButton loading={register.loading}>Crear cuenta</SubmitButton>
      </form>
    </AuthLayout>
  );
}
