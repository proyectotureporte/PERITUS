'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'portal', email: email.trim().toLowerCase(), password: password.trim() }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Credenciales invalidas');
        return;
      }

      router.replace('/portal/cases');
    } catch {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2a6e] via-[#0d1f4e] to-[#1565c0] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4a843] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/LOGO.png" alt="PERITUS" className="h-14 w-auto brightness-0 invert" />
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="h-1 w-full bg-[#d4a843]" />

          <div className="px-8 pb-8 pt-8">
            <h1 className="mb-1 text-center text-xl font-bold text-white">Portal Cliente</h1>
            <p className="mb-8 text-center text-sm text-white/60">Acceso exclusivo para peritos registrados</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2.5 rounded-lg bg-red-500/20 border border-red-400/30 px-4 py-3 text-sm text-red-200" role="alert">
                  <AlertCircle className="h-[18px] w-[18px] shrink-0 text-red-300" />
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">Email</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Mail className="h-[18px] w-[18px] text-white/40" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="correo@ejemplo.com"
                    className="w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pl-11 pr-4 text-sm text-white placeholder-white/30 transition-all focus:border-[#d4a843]/60 focus:outline-none focus:ring-2 focus:ring-[#d4a843]/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/80">Contraseña</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Lock className="h-[18px] w-[18px] text-white/40" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Ingrese su contraseña"
                    className="w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pl-11 pr-4 text-sm text-white placeholder-white/30 transition-all focus:border-[#d4a843]/60 focus:outline-none focus:ring-2 focus:ring-[#d4a843]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0a2a6e] shadow-md transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #d4a843, #c49a30)' }}
              >
                <span className="flex items-center justify-center gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                </span>
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-white/30">
              PERITUS &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
