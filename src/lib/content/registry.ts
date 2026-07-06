/**
 * Registro de páginas públicas editables de peritus.com.co (site 'peritus').
 * Cada módulo exporta DEFAULTS, SECCIONES, NOMBRE y URL_PUBLICA.
 */

import type { SeccionLanding } from './tipos'
import * as home from './paginas/home'
// Próximas: perito, abogado, juez, empresa (mismo patrón que home)

export interface PaginaRegistrada {
  key: string
  nombre: string
  url: string
  defaults: Record<string, unknown>
  secciones: SeccionLanding[]
}

const modulos = { home } as const

export const PAGINAS_PERITUS: PaginaRegistrada[] = Object.entries(modulos).map(
  ([key, mod]) => ({
    key,
    nombre: (mod as { NOMBRE?: string }).NOMBRE ?? key,
    url: (mod as { URL_PUBLICA?: string }).URL_PUBLICA ?? `/${key}`,
    defaults: (mod as { DEFAULTS: Record<string, unknown> }).DEFAULTS,
    secciones: (mod as { SECCIONES: SeccionLanding[] }).SECCIONES,
  }),
)

export function getPaginaPeritus(key: string): PaginaRegistrada | null {
  return PAGINAS_PERITUS.find((p) => p.key === key) ?? null
}
