'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, FileText, Lock } from 'lucide-react';

interface Cotizacion {
  _id: string;
  _createdAt: string;
  nombre: string;
  email: string;
  telefono: string;
  tipoPeritaje: string;
  ciudad: string;
  descripcion: string;
  estado: string;
}

const TIPO_LABELS: Record<string, string> = {
  medicina: 'Medicina',
  legal: 'Legal',
  finanzas: 'Finanzas',
  informatica: 'Informática',
  vivienda: 'Vivienda',
  industria: 'Industria',
  otro: 'Otro',
};

export default function CotizacionesPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [fetching, setFetching] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/portal/cotizaciones/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthed(true);
      } else {
        setError('Contraseña incorrecta');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authed) return;
    setFetching(true);
    fetch('/api/portal/cotizaciones/list')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCotizaciones(data.data);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [authed]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a2a6e] via-[#0d1f4e] to-[#1565c0] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <Image src="/LOGO.png" alt="Peritus" width={160} height={54} className="brightness-0 invert" />
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="h-5 w-5 text-gold" />
              <h1 className="text-white font-bold text-lg">Cotizaciones</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Contraseña de acceso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              {error && <p className="text-red-300 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gold text-navy-dark font-bold rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Verificando...' : 'Ingresar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2a6e] via-[#0d1f4e] to-[#1565c0]">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Image src="/LOGO.png" alt="Peritus" width={140} height={47} className="brightness-0 invert" />
        <div className="flex items-center gap-2 text-white">
          <FileText className="h-4 w-4 text-gold" />
          <span className="font-bold">Cotizaciones recibidas</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {fetching ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-white/10 animate-pulse" />
            ))}
          </div>
        ) : cotizaciones.length === 0 ? (
          <div className="bg-white/10 rounded-xl border border-white/20 py-16 flex flex-col items-center gap-3">
            <FileText className="h-10 w-10 text-white/40" />
            <p className="text-white/60 font-medium">No hay cotizaciones aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-white/60 text-sm mb-6">{cotizaciones.length} solicitud{cotizaciones.length !== 1 ? 'es' : ''} recibida{cotizaciones.length !== 1 ? 's' : ''}</p>
            {cotizaciones.map((c) => (
              <div key={c._id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-white font-bold text-lg">{c.nombre}</h3>
                      <span className="bg-gold/20 text-gold text-xs font-bold px-3 py-1 rounded-full border border-gold/30">
                        {TIPO_LABELS[c.tipoPeritaje] ?? c.tipoPeritaje}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />{c.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />{c.telefono}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />{c.ciudad}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mt-2">{c.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/40 text-xs whitespace-nowrap">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(c._createdAt).toLocaleDateString('es-CO', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
