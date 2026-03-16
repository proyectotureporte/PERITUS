'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'

interface FormData {
  nombreApellido: string
  cedula: string
  correo: string
  celular: string
  ciudad: string
  profesionOficio: string
  cargo: string
  experiencia: string
  especialidad: string
  edad: string
  contrasena: string
  hojaDeVida: File | null
}

const ciudadesColombia = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué',
  'Pasto', 'Manizales', 'Neiva', 'Villavicencio', 'Armenia', 'Valledupar', 'Montería', 'Sincelejo', 'Popayán', 'Buenaventura',
  'Tuluá', 'Palmira', 'Floridablanca', 'Turbaco', 'Malambo', 'Facatativá', 'Sogamoso', 'Girardot', 'Ubaté', 'Fusagasugá',
  'Barrancas', 'Maicao', 'Cartago', 'Bello', 'Envigado', 'Itagüí', 'Sabaneta', 'La Estrella', 'Caldas', 'Copacabana',
  'Girardota', 'Barbosa', 'Rionegro', 'Apartadó', 'Turbo', 'Caucasia', 'Necoclí', 'Chigorodó', 'Mutatá', 'Carepa', 'Tumaco'
];

const profesiones = [
  { title: 'Contador Público', value: 'Contador Público' },
  { title: 'Abogado', value: 'Abogado' },
  { title: 'Ingeniero', value: 'Ingeniero' },
  { title: 'Médico', value: 'Médico' },
  { title: 'Arquitecto', value: 'Arquitecto' },
  { title: 'Economista', value: 'Economista' },
  { title: 'Psicólogo', value: 'Psicólogo' },
  { title: 'Administrador', value: 'Administrador' },
  { title: 'Perito en Informática', value: 'Perito en Informática' },
  { title: 'Perito en Grafología', value: 'Perito en Grafología' },
  { title: 'Otro', value: 'Otro' },
];

const cargos = [
  { title: 'Perito', value: 'Perito' },
  { title: 'Consultor', value: 'Consultor' },
  { title: 'Asesor', value: 'Asesor' },
  { title: 'Director', value: 'Director' },
  { title: 'Coordinador', value: 'Coordinador' },
  { title: 'Analista', value: 'Analista' },
  { title: 'Independiente', value: 'Independiente' },
  { title: 'Otro', value: 'Otro' },
];

const rangosExperiencia = [
  { title: '0-1 años', value: '0-1' },
  { title: '2-5 años', value: '2-5' },
  { title: '6-10 años', value: '6-10' },
  { title: '11-15 años', value: '11-15' },
  { title: '16-20 años', value: '16-20' },
  { title: 'Más de 20 años', value: '20+' },
];

const rangosEdad = [
  { title: '18-25 años', value: '18-25' },
  { title: '26-35 años', value: '26-35' },
  { title: '36-45 años', value: '36-45' },
  { title: '46-55 años', value: '46-55' },
  { title: '56-65 años', value: '56-65' },
  { title: 'Más de 65 años', value: '65+' },
];

export default function RegistroPeritus() {
  const [form, setForm] = useState<FormData>({
    nombreApellido: '',
    cedula: '',
    correo: '',
    celular: '',
    ciudad: '',
    profesionOficio: '',
    cargo: '',
    experiencia: '',
    especialidad: '',
    edad: '',
    contrasena: '',
    hojaDeVida: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [registeredName, setRegisteredName] = useState('')

  const isFormValid = useMemo(() => {
    const requiredFields = [
      form.nombreApellido, form.cedula, form.correo, form.celular,
      form.ciudad, form.profesionOficio, form.cargo, form.experiencia,
      form.especialidad, form.edad, form.contrasena,
    ]
    return requiredFields.every(v => v.trim() !== '') && form.contrasena.length >= 6
  }, [form])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setForm({ ...form, hojaDeVida: file })
    if (error) setError('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid) {
      const formElement = e.currentTarget.closest('form')
      if (formElement) formElement.requestSubmit()
    }
  }

  const validateForm = (): boolean => {
    if (!form.nombreApellido.trim()) { setError('El nombre es obligatorio'); return false }
    if (!/^\d{7,10}$/.test(form.cedula.trim())) { setError('La cédula debe tener entre 7 y 10 dígitos'); return false }
    if (!/\S+@\S+\.\S+/.test(form.correo.trim())) { setError('Formato de correo inválido'); return false }
    if (!/^\d{10}$/.test(form.celular.trim())) { setError('El celular debe tener 10 dígitos'); return false }
    if (!form.ciudad) { setError('Selecciona una ciudad'); return false }
    if (!form.profesionOficio) { setError('Selecciona una profesión u oficio'); return false }
    if (!form.cargo) { setError('Selecciona un cargo'); return false }
    if (!form.experiencia) { setError('Selecciona los años de experiencia'); return false }
    if (!form.especialidad.trim()) { setError('La especialidad es obligatoria'); return false }
    if (!form.edad) { setError('Selecciona un rango de edad'); return false }
    if (form.contrasena.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return false }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('nombreApellido', form.nombreApellido.trim())
      formData.append('cedula', form.cedula.trim())
      formData.append('correo', form.correo.trim())
      formData.append('celular', form.celular.trim())
      formData.append('ciudad', form.ciudad)
      formData.append('profesionOficio', form.profesionOficio)
      formData.append('cargo', form.cargo)
      formData.append('experiencia', form.experiencia)
      formData.append('especialidad', form.especialidad.trim())
      formData.append('edad', form.edad)
      formData.append('contrasena', form.contrasena)
      if (form.hojaDeVida) {
        formData.append('hojaDeVida', form.hojaDeVida)
      }

      const response = await fetch('/api/registro-peritus', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error en el registro')
      }

      const result = await response.json()
      setGeneratedCode(result.peritusId)
      setRegisteredName(form.nombreApellido)
      setSuccess(true)

      setForm({
        nombreApellido: '', cedula: '', correo: '', celular: '', ciudad: '',
        profesionOficio: '', cargo: '', experiencia: '', especialidad: '',
        edad: '', contrasena: '', hojaDeVida: null,
      })
    } catch (err) {
      const errorMessage = (err as Error).message || String(err)
      setError('Error al registrar: ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a2a6e] via-[#0d1f4e] to-[#1565c0] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4a843] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-6">
            <Image src="/LOGO.png" alt="PERITUS" width={200} height={60} className="h-14 w-auto mx-auto brightness-0 invert" />
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-[#d4a843]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">Registro Exitoso</h2>
            <p className="text-white/80 mb-6">Bienvenido, {registeredName}.</p>

            <div className="bg-white/10 p-6 rounded-lg border border-white/20">
              <p className="text-white/70 text-sm mb-2">Tu código PERITUS es:</p>
              <p className="text-2xl font-bold text-[#d4a843] tracking-widest">{generatedCode}</p>
            </div>

            <p className="mt-6 text-white/70 text-sm">
              Hemos enviado tus credenciales de acceso a tu correo electrónico.
            </p>

            <a
              href="/"
              className="mt-6 inline-block w-full bg-white text-[#0a2a6e] font-semibold py-3 px-6 rounded-lg hover:bg-white/90 transition-colors text-center"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2a6e] via-[#0d1f4e] to-[#1565c0] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4a843] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-10">
          <div className="mb-6">
            <Image src="/LOGO.png" alt="PERITUS" width={200} height={60} className="h-14 w-auto mx-auto brightness-0 invert" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-white">
            Registro de Perito
          </h1>
          <p className="text-white/80">Únete a nuestra red de peritos especializados</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl" />

          <div className="relative z-10">
            {error && (
              <div className="mb-6 p-4 bg-red-600/20 border border-red-500/40 rounded-lg backdrop-blur-sm">
                <p className="text-red-300 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Columna 1 */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="nombreApellido" className="block text-sm font-semibold mb-2 text-white">Nombre y Apellido</label>
                  <input id="nombreApellido" name="nombreApellido" value={form.nombreApellido} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Tu nombre completo" required className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#d4a843]" />
                </div>
                <div>
                  <label htmlFor="cedula" className="block text-sm font-semibold mb-2 text-white">Cédula</label>
                  <input id="cedula" name="cedula" value={form.cedula} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Tu número de cédula" required pattern="[0-9]{7,10}" className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#d4a843]" />
                </div>
                <div>
                  <label htmlFor="correo" className="block text-sm font-semibold mb-2 text-white">Correo Electrónico</label>
                  <input id="correo" name="correo" value={form.correo} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="tu@correo.com" required type="email" className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#d4a843]" />
                </div>
                <div>
                  <label htmlFor="celular" className="block text-sm font-semibold mb-2 text-white">Celular</label>
                  <input id="celular" name="celular" value={form.celular} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="3001234567" required pattern="[0-9]{10}" className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#d4a843]" />
                </div>
                <div>
                  <label htmlFor="ciudad" className="block text-sm font-semibold mb-2 text-white">Ciudad</label>
                  <select id="ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} required className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4a843]">
                    <option value="" className="bg-[#0d1f4e] text-gray-300">Selecciona una ciudad</option>
                    {ciudadesColombia.map(ciudad => <option key={ciudad} value={ciudad} className="bg-[#0d1f4e] text-gray-300">{ciudad}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="edad" className="block text-sm font-semibold mb-2 text-white">Edad</label>
                  <select id="edad" name="edad" value={form.edad} onChange={handleChange} required className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4a843]">
                    <option value="" className="bg-[#0d1f4e] text-gray-300">Rango de edad</option>
                    {rangosEdad.map(rango => <option key={rango.value} value={rango.value} className="bg-[#0d1f4e] text-gray-300">{rango.title}</option>)}
                  </select>
                </div>
              </div>

              {/* Columna 2 */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="profesionOficio" className="block text-sm font-semibold mb-2 text-white">Profesión u Oficio</label>
                  <select id="profesionOficio" name="profesionOficio" value={form.profesionOficio} onChange={handleChange} required className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4a843]">
                    <option value="" className="bg-[#0d1f4e] text-gray-300">Selecciona una profesión</option>
                    {profesiones.map(prof => <option key={prof.value} value={prof.value} className="bg-[#0d1f4e] text-gray-300">{prof.title}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="cargo" className="block text-sm font-semibold mb-2 text-white">Cargo</label>
                  <select id="cargo" name="cargo" value={form.cargo} onChange={handleChange} required className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4a843]">
                    <option value="" className="bg-[#0d1f4e] text-gray-300">Selecciona un cargo</option>
                    {cargos.map(cargo => <option key={cargo.value} value={cargo.value} className="bg-[#0d1f4e] text-gray-300">{cargo.title}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="experiencia" className="block text-sm font-semibold mb-2 text-white">Años de Experiencia</label>
                  <select id="experiencia" name="experiencia" value={form.experiencia} onChange={handleChange} required className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4a843]">
                    <option value="" className="bg-[#0d1f4e] text-gray-300">Experiencia laboral</option>
                    {rangosExperiencia.map(rango => <option key={rango.value} value={rango.value} className="bg-[#0d1f4e] text-gray-300">{rango.title}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="especialidad" className="block text-sm font-semibold mb-2 text-white">Especialidad</label>
                  <input id="especialidad" name="especialidad" value={form.especialidad} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Ej: Peritaje contable, Medicina legal..." required className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#d4a843]" />
                </div>
                <div>
                  <label htmlFor="hojaDeVida" className="block text-sm font-semibold mb-2 text-white">Subir Hoja de Vida</label>
                  <input id="hojaDeVida" name="hojaDeVida" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#d4a843] file:text-[#0a2a6e] hover:file:bg-[#d4a843]/80 focus:outline-none focus:ring-2 focus:ring-[#d4a843]" />
                  <p className="text-white/50 text-xs mt-1">PDF, DOC o DOCX (máx. 5MB)</p>
                </div>
                <div>
                  <label htmlFor="contrasena" className="block text-sm font-semibold mb-2 text-white">Contraseña</label>
                  <div className="relative">
                    <input id="contrasena" name="contrasena" value={form.contrasena} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Mín. 6 caracteres" required type={showPassword ? 'text' : 'password'} minLength={6} className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#d4a843] pr-12" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white/80">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="w-full bg-[#d4a843] hover:bg-[#d4a843]/90 disabled:bg-gray-600 text-[#0a2a6e] font-bold py-4 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02] disabled:transform-none mt-4"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Registrando...
                    </>
                  ) : 'Registrarse'}
                </button>
              </div>
            </form>

            <div className="text-center mt-8 pt-6 border-t border-white/10">
              <a href="/" className="text-sm text-white/80 hover:text-white font-medium transition-colors underline">
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
