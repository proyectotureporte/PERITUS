'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { EXPERIENCE_RANGES } from '@/lib/peritos/clasificacion'
import { EXPERT_CATEGORIES, EXPERT_CATEGORY_LABELS, EXPERT_CATEGORY_SPECIALTIES, type ExpertCategory } from '@/lib/peritos/categorias'

interface FormData {
  nombreApellido: string
  cedula: string
  correo: string
  celular: string
  ciudad: string
  departamento: string
  macroCategoria: string
  especialidad: string
  cargo: string
  experiencia: string
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

const rangosEdad = [
  { title: '18-25 años', value: '18-25' },
  { title: '26-35 años', value: '26-35' },
  { title: '36-45 años', value: '36-45' },
  { title: '46-55 años', value: '46-55' },
  { title: '56-65 años', value: '56-65' },
  { title: 'Más de 65 años', value: '65+' },
];

// Borrador del registro: se guarda SOLO en el navegador del perito (localStorage)
// al pasar de paso, para no tratar datos en el servidor antes del consentimiento.
// Nunca se guardan la contraseña ni el archivo de la hoja de vida.
const DRAFT_KEY = 'peritus-registro-borrador-v1'
const MAX_FILE_BYTES = 50 * 1024 * 1024

const STEPS = [
  { title: 'Información personal' },
  { title: 'Experiencia, especialidad y estudios' },
  { title: 'Documentos, contraseña y consentimiento' },
] as const

const EMPTY_FORM: FormData = {
  nombreApellido: '', cedula: '', correo: '', celular: '', ciudad: '', departamento: '',
  macroCategoria: '', especialidad: '', cargo: '', experiencia: '', edad: '', contrasena: '', hojaDeVida: null,
}
const EMPTY_FORMACION = {
  pregrado: false, esp1: false, esp2: false, esp3: false, maestria1: false, maestria2: false, doctorado: false, ninguno: false,
}
type Formacion = typeof EMPTY_FORMACION

interface Draft {
  step: number
  form: Omit<FormData, 'contrasena' | 'hojaDeVida'>
  formacion: Formacion
}

function readDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const draft = JSON.parse(raw) as Partial<Draft>
    if (!draft || typeof draft !== 'object' || !draft.form) return null
    return {
      step: Math.min(Math.max(Number(draft.step) || 0, 0), STEPS.length - 1),
      form: { ...EMPTY_FORM, ...draft.form },
      formacion: { ...EMPTY_FORMACION, ...draft.formacion },
    }
  } catch {
    return null
  }
}

function writeDraft(step: number, form: FormData, formacion: Formacion) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contrasena, hojaDeVida, ...rest } = form
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, form: rest, formacion } satisfies Draft))
  } catch {
    // Sin almacenamiento (modo privado, bloqueo): el registro sigue funcionando.
  }
}

function clearDraft() {
  try { window.localStorage.removeItem(DRAFT_KEY) } catch { /* noop */ }
}

const inputClass = "w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#d4a843]";
const selectClass = "w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4a843]";
const labelClass = "block text-sm font-semibold mb-2 text-white";

export default function RegistroPeritus() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  // Formación académica (base de la clasificación automática)
  const [formacion, setFormacion] = useState<Formacion>(EMPTY_FORMACION)
  // Consentimientos obligatorios
  const [consent, setConsent] = useState({ datos: false, veracidad: false })
  const [step, setStep] = useState(0)
  const [restored, setRestored] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [registeredName, setRegisteredName] = useState('')

  // Recupera el avance guardado en este navegador (solo en cliente).
  useEffect(() => {
    const draft = readDraft()
    if (!draft) return
    setForm((current) => ({ ...current, ...draft.form }))
    setFormacion(draft.formacion)
    setStep(draft.step)
    setRestored(true)
  }, [])

  const especialidades = useMemo(
    () => form.macroCategoria ? EXPERT_CATEGORY_SPECIALTIES[form.macroCategoria as ExpertCategory] ?? [] : [],
    [form.macroCategoria],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // Al cambiar la macro-categoría, se reinicia la especialidad dependiente.
    if (name === 'macroCategoria') {
      setForm({ ...form, macroCategoria: value, especialidad: '' })
    } else {
      setForm({ ...form, [name]: value })
    }
    if (error) setError('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setForm({ ...form, hojaDeVida: file })
    if (error) setError('')
  }

  const toggleFormacion = (key: keyof Formacion, checked: boolean) => {
    // "Ninguno" excluye los títulos y viceversa.
    if (key === 'ninguno') {
      setFormacion(checked ? { ...EMPTY_FORMACION, ninguno: true } : { ...formacion, ninguno: false })
    } else {
      setFormacion({ ...formacion, [key]: checked, ninguno: false })
    }
    if (error) setError('')
  }

  const hasFormacion = Object.values(formacion).some(Boolean)

  // Todos los campos del formulario son obligatorios; cada paso valida los suyos.
  const validateStep = (index: number): boolean => {
    if (index === 0) {
      if (!form.nombreApellido.trim()) { setError('El nombre es obligatorio'); return false }
      if (!/^\d{7,10}$/.test(form.cedula.trim())) { setError('La cédula debe tener entre 7 y 10 dígitos'); return false }
      if (!/\S+@\S+\.\S+/.test(form.correo.trim())) { setError('Formato de correo inválido'); return false }
      if (!/^\d{10}$/.test(form.celular.trim())) { setError('El celular debe tener 10 dígitos'); return false }
      if (!form.ciudad) { setError('Selecciona una ciudad'); return false }
      if (!form.departamento.trim()) { setError('El departamento es obligatorio'); return false }
      if (!form.edad) { setError('Selecciona un rango de edad'); return false }
    }
    if (index === 1) {
      if (!form.cargo) { setError('Selecciona un cargo'); return false }
      if (!form.macroCategoria) { setError('Selecciona una macro-categoría'); return false }
      if (!form.especialidad) { setError('Selecciona una especialidad'); return false }
      if (!form.experiencia) { setError('Selecciona los años de experiencia'); return false }
      if (!hasFormacion) { setError('Marca tus títulos obtenidos o "Ninguno de los anteriores"'); return false }
    }
    if (index === 2) {
      if (!form.hojaDeVida) { setError('La hoja de vida es obligatoria'); return false }
      if (form.hojaDeVida.size > MAX_FILE_BYTES) { setError('La hoja de vida no puede superar 50 MB'); return false }
      if (form.contrasena.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return false }
      if (!consent.datos) { setError('Debes autorizar el tratamiento de datos personales'); return false }
      if (!consent.veracidad) { setError('Debes declarar la veracidad de la información'); return false }
    }
    return true
  }

  const goNext = () => {
    if (!validateStep(step)) return
    const next = Math.min(step + 1, STEPS.length - 1)
    writeDraft(next, form, formacion)
    setError('')
    setStep(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    const prev = Math.max(step - 1, 0)
    writeDraft(prev, form, formacion)
    setError('')
    setStep(prev)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startOver = () => {
    clearDraft()
    setForm(EMPTY_FORM)
    setFormacion(EMPTY_FORMACION)
    setConsent({ datos: false, veracidad: false })
    setStep(0)
    setRestored(false)
    setError('')
  }

  // Enter avanza de paso en lugar de enviar el formulario completo.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step < STEPS.length - 1) {
      e.preventDefault()
      goNext()
    }
  }

  const numEspecializaciones = (formacion.esp1 ? 1 : 0) + (formacion.esp2 ? 1 : 0) + (formacion.esp3 ? 1 : 0)
  const numMaestrias = (formacion.maestria1 ? 1 : 0) + (formacion.maestria2 ? 1 : 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < STEPS.length - 1) { goNext(); return }
    // Revalida todo: el borrador pudo haberse editado fuera del flujo.
    for (let index = 0; index < STEPS.length; index++) {
      if (!validateStep(index)) { setStep(index); return }
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('nombreApellido', form.nombreApellido.trim())
      formData.append('cedula', form.cedula.trim())
      formData.append('correo', form.correo.trim())
      formData.append('celular', form.celular.trim())
      formData.append('ciudad', form.ciudad)
      formData.append('departamento', form.departamento.trim())
      formData.append('macroCategoria', form.macroCategoria)
      formData.append('especialidad', form.especialidad)
      formData.append('cargo', form.cargo)
      formData.append('experiencia', form.experiencia)
      formData.append('edad', form.edad)
      formData.append('contrasena', form.contrasena)
      formData.append('pregrado', String(formacion.pregrado))
      formData.append('numEspecializaciones', String(numEspecializaciones))
      formData.append('numMaestrias', String(numMaestrias))
      formData.append('doctorado', String(formacion.doctorado))
      if (form.hojaDeVida) formData.append('hojaDeVida', form.hojaDeVida)

      const response = await fetch('/api/registro-peritus', { method: 'POST', body: formData })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 413) throw new Error('El archivo es demasiado grande (máx. 50 MB)')
        throw new Error(errorData.error || 'Error en el registro')
      }

      const result = await response.json()
      // Registro guardado en el servidor y la hoja de vida en Sanity: se descarta el borrador local.
      clearDraft()
      setGeneratedCode(result.peritusId)
      setRegisteredName(form.nombreApellido)
      setSuccess(true)

      setForm(EMPTY_FORM)
      setFormacion(EMPTY_FORMACION)
      setConsent({ datos: false, veracidad: false })
      setStep(0)
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
            <p className="text-white/80 mb-4">Bienvenido, {registeredName}.</p>
            <p className="text-white/70 text-sm mb-6">
              Quedas registrado como <span className="text-[#d4a843] font-semibold">Perito Candidato</span>.
              Nuestro equipo revisará tu documentación y te contactará para la etapa de evaluación.
            </p>

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
          <h1 className="text-4xl font-bold mb-3 text-white">Registro de Perito</h1>
          <p className="text-white/80">Únete a nuestra red de peritos especializados</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl" />

          <div className="relative z-10">
            {/* Progreso */}
            <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Progreso del registro">
              {STEPS.map((item, index) => (
                <li key={item.title} className="flex flex-col gap-2">
                  <div className={`h-1.5 rounded-full ${index <= step ? 'bg-[#d4a843]' : 'bg-white/20'}`} />
                  <span className={`text-xs sm:text-sm ${index === step ? 'text-white font-semibold' : 'text-white/60'}`} aria-current={index === step ? 'step' : undefined}>
                    <span className="block text-[#d4a843]">Paso {index + 1} de {STEPS.length}</span>
                    <span className="hidden sm:block">{item.title}</span>
                  </span>
                </li>
              ))}
            </ol>

            {restored && (
              <div className="mb-6 p-4 bg-[#d4a843]/15 border border-[#d4a843]/40 rounded-lg flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-white/90">Recuperamos tu avance. Completa los datos que faltan{step === STEPS.length - 1 ? ' (por seguridad, vuelve a escribir la contraseña y adjuntar la hoja de vida)' : ''}.</p>
                <button type="button" onClick={startOver} className="text-sm font-semibold text-[#d4a843] underline hover:text-[#d4a843]/80">Empezar de cero</button>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-600/20 border border-red-500/40 rounded-lg backdrop-blur-sm" role="alert">
                <p className="text-red-300 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {step === 0 && (
                <section>
                  <h3 className="text-lg font-bold text-[#d4a843] mb-4">Paso 1 · Información personal</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="nombreApellido" className={labelClass}>Nombre y Apellido</label>
                      <input id="nombreApellido" name="nombreApellido" value={form.nombreApellido} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Tu nombre completo" required autoComplete="name" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="cedula" className={labelClass}>Cédula</label>
                      <input id="cedula" name="cedula" value={form.cedula} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Número de documento" required inputMode="numeric" pattern="[0-9]{7,10}" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="correo" className={labelClass}>Correo Electrónico</label>
                      <input id="correo" name="correo" value={form.correo} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="tu@correo.com" required type="email" autoComplete="email" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="celular" className={labelClass}>Celular</label>
                      <input id="celular" name="celular" value={form.celular} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="3001234567" required inputMode="numeric" autoComplete="tel-national" pattern="[0-9]{10}" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="ciudad" className={labelClass}>Ciudad</label>
                      <select id="ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} required className={selectClass}>
                        <option value="" className="bg-[#0d1f4e] text-gray-300">Selecciona una ciudad</option>
                        {ciudadesColombia.map(ciudad => <option key={ciudad} value={ciudad} className="bg-[#0d1f4e] text-gray-300">{ciudad}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="departamento" className={labelClass}>Departamento</label>
                      <input id="departamento" name="departamento" value={form.departamento} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Ej: Cundinamarca" required className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="edad" className={labelClass}>Edad</label>
                      <select id="edad" name="edad" value={form.edad} onChange={handleChange} required className={selectClass}>
                        <option value="" className="bg-[#0d1f4e] text-gray-300">Rango de edad</option>
                        {rangosEdad.map(rango => <option key={rango.value} value={rango.value} className="bg-[#0d1f4e] text-gray-300">{rango.title}</option>)}
                      </select>
                    </div>
                  </div>
                </section>
              )}

              {step === 1 && (
                <>
                  <section>
                    <h3 className="text-lg font-bold text-[#d4a843] mb-4">Paso 2 · Experiencia y especialidad</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="cargo" className={labelClass}>Cargo</label>
                        <select id="cargo" name="cargo" value={form.cargo} onChange={handleChange} required className={selectClass}>
                          <option value="" className="bg-[#0d1f4e] text-gray-300">Selecciona un cargo</option>
                          {cargos.map(cargo => <option key={cargo.value} value={cargo.value} className="bg-[#0d1f4e] text-gray-300">{cargo.title}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="experiencia" className={labelClass}>Años de Experiencia profesional</label>
                        <select id="experiencia" name="experiencia" value={form.experiencia} onChange={handleChange} required className={selectClass}>
                          <option value="" className="bg-[#0d1f4e] text-gray-300">Experiencia laboral</option>
                          {EXPERIENCE_RANGES.map(r => <option key={r.value} value={r.value} className="bg-[#0d1f4e] text-gray-300">{r.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="macroCategoria" className={labelClass}>Macro-categoría</label>
                        <select id="macroCategoria" name="macroCategoria" value={form.macroCategoria} onChange={handleChange} required className={selectClass}>
                          <option value="" className="bg-[#0d1f4e] text-gray-300">Selecciona una categoría</option>
                          {EXPERT_CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0d1f4e] text-gray-300">{EXPERT_CATEGORY_LABELS[c]}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="especialidad" className={labelClass}>Especialidad específica</label>
                        <select id="especialidad" name="especialidad" value={form.especialidad} onChange={handleChange} required disabled={!form.macroCategoria} className={`${selectClass} disabled:opacity-50`}>
                          <option value="" className="bg-[#0d1f4e] text-gray-300">{form.macroCategoria ? 'Selecciona una especialidad' : 'Elige primero una categoría'}</option>
                          {especialidades.map(esp => <option key={esp} value={esp} className="bg-[#0d1f4e] text-gray-300">{esp}</option>)}
                        </select>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-[#d4a843] mb-1">Formación académica</h3>
                    <p className="text-white/60 text-xs mb-4">Marca tus títulos obtenidos. Con esta información clasificamos tu nivel (Junior / Senior / Master).</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {([
                        ['pregrado', 'Pregrado'], ['esp1', 'Especialización 1'], ['esp2', 'Especialización 2'], ['esp3', 'Especialización 3'],
                        ['maestria1', 'Maestría 1'], ['maestria2', 'Maestría 2'], ['doctorado', 'Doctorado'], ['ninguno', 'Ninguno de los anteriores'],
                      ] as [keyof Formacion, string][]).map(([key, label]) => (
                        <label key={key} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${formacion[key] ? 'bg-[#d4a843]/20 border-[#d4a843]/50' : 'bg-white/10 border-white/20'}`}>
                          <input type="checkbox" checked={formacion[key]} onChange={(e) => toggleFormacion(key, e.target.checked)} className="h-4 w-4 accent-[#d4a843]" />
                          <span className="text-sm text-white">{label}</span>
                        </label>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {step === 2 && (
                <>
                  <section>
                    <h3 className="text-lg font-bold text-[#d4a843] mb-4">Paso 3 · Documentos y acceso</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="hojaDeVida" className={labelClass}>Hoja de Vida <span className="text-[#d4a843]">*</span></label>
                        <input id="hojaDeVida" name="hojaDeVida" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#d4a843] file:text-[#0a2a6e] hover:file:bg-[#d4a843]/80 focus:outline-none focus:ring-2 focus:ring-[#d4a843]" />
                        <p className="text-white/50 text-xs mt-1">PDF, DOC o DOCX (máx. 50 MB). Obligatoria. Otros documentos (cédula, certificaciones, soportes) los podrás subir después desde tu perfil.</p>
                      </div>
                    <div>
                      <label htmlFor="contrasena" className={labelClass}>Contraseña de acceso</label>
                      <div className="relative">
                        <input id="contrasena" name="contrasena" value={form.contrasena} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Mín. 6 caracteres" required type={showPassword ? 'text' : 'password'} minLength={6} autoComplete="new-password" className={`${inputClass} pr-12`} />
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
                  </section>

                  <section className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={consent.datos} onChange={(e) => setConsent({ ...consent, datos: e.target.checked })} className="mt-1 h-4 w-4 accent-[#d4a843]" />
                      <span className="text-sm text-white/80">Autorizo el tratamiento de mis datos personales conforme a la política de privacidad de PERITUS.</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={consent.veracidad} onChange={(e) => setConsent({ ...consent, veracidad: e.target.checked })} className="mt-1 h-4 w-4 accent-[#d4a843]" />
                      <span className="text-sm text-white/80">Declaro que la información y los documentos aportados son veraces, y acepto el proceso de validación y capacitación.</span>
                    </label>
                  </section>
                </>
              )}

              {/* Navegación */}
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={loading}
                    className="sm:w-1/3 border border-white/30 text-white font-semibold py-4 px-6 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    Atrás
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#d4a843] hover:bg-[#d4a843]/90 disabled:bg-gray-600 text-[#0a2a6e] font-bold py-4 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Registrando...
                    </>
                  ) : step < STEPS.length - 1 ? 'Siguiente' : 'Registrarse como Perito'}
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
