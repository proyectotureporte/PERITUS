/**
 * Sistema de contenido editable de las páginas públicas de PERITUS
 * (editado desde el panel /santiago de total, vía /api/site-content/*).
 * La tabla site_content vive en la BD compartida `cnp` (site='peritus').
 */

export type TipoCampo = 'texto' | 'parrafo' | 'imagen' | 'color' | 'enlace' | 'fuente'

export interface CampoLanding {
  /** Dot-path dentro del JSON de contenido, ej: "hero.titulo" */
  path: string
  label: string
  tipo: TipoCampo
}

export interface SeccionLanding {
  id: string
  titulo: string
  campos: CampoLanding[]
}

/** Fuentes disponibles (Inter es la del sitio, vía next/font). */
export const FUENTES_DISPONIBLES: Array<{ label: string; value: string }> = [
  { label: 'Inter (actual del sitio)', value: 'var(--font-inter), Arial, sans-serif' },
  { label: 'Arial / Helvetica', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia (serif elegante)', value: "Georgia, 'Times New Roman', serif" },
  { label: 'Verdana (legible)', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Sistema (nativa del dispositivo)', value: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
]

function esObjetoPlano(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** Merge profundo: overrides pisan defaults; strings vacíos se ignoran. */
export function mergeContenido<T extends Record<string, unknown>>(
  defaults: T,
  overrides: unknown,
): T {
  if (!esObjetoPlano(overrides)) return defaults
  const out: Record<string, unknown> = { ...defaults }
  for (const [k, v] of Object.entries(overrides)) {
    const base = (defaults as Record<string, unknown>)[k]
    if (esObjetoPlano(base) && esObjetoPlano(v)) {
      out[k] = mergeContenido(base as Record<string, unknown>, v)
    } else if (v !== undefined && v !== null && v !== '') {
      out[k] = v
    }
  }
  return out as T
}
