'use client';

import { useState, FormEvent } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const tiposPeritaje = [
  { value: '', label: 'Seleccione tipo de peritaje' },
  { value: 'medicina', label: 'Medicina' },
  { value: 'legal', label: 'Legal' },
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'informatica', label: 'Informática' },
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'industria', label: 'Industria' },
  { value: 'otro', label: 'Otro' },
];

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  tipoPeritaje: string;
  ciudad: string;
  descripcion: string;
}

const initialFormData: FormData = {
  nombre: '',
  email: '',
  telefono: '',
  tipoPeritaje: '',
  ciudad: '',
  descripcion: '',
};

export default function CotizacionForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      const res = await fetch('/api/cotizacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setFormData(initialFormData);
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Error al enviar el formulario');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Error de conexión. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    'w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-colors';

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          required
          className={inputClasses}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          className={inputClasses}
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
          className={inputClasses}
        />
        <select
          name="tipoPeritaje"
          value={formData.tipoPeritaje}
          onChange={handleChange}
          required
          className={inputClasses}
        >
          {tiposPeritaje.map((tipo) => (
            <option key={tipo.value} value={tipo.value} className="text-gray-900">
              {tipo.label}
            </option>
          ))}
        </select>
      </div>
      <input
        type="text"
        name="ciudad"
        placeholder="Ciudad"
        value={formData.ciudad}
        onChange={handleChange}
        required
        className={inputClasses}
      />
      <textarea
        name="descripcion"
        placeholder="Describa brevemente su caso..."
        value={formData.descripcion}
        onChange={handleChange}
        required
        rows={4}
        className={inputClasses + ' resize-none'}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto px-8 py-3 bg-gold text-navy-dark font-bold rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Enviar cotización
          </>
        )}
      </button>

      {status === 'success' && (
        <div className="flex items-center justify-center gap-2 text-green-300 bg-green-900/30 rounded-lg p-3">
          <CheckCircle className="h-5 w-5" />
          <span>Cotización enviada exitosamente. Nos pondremos en contacto pronto.</span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center justify-center gap-2 text-red-300 bg-red-900/30 rounded-lg p-3">
          <AlertCircle className="h-5 w-5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </form>
  );
}
