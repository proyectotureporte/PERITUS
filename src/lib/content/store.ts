import { query, queryOne } from '@/lib/db/pool'

export interface SiteContentRow {
  site: string
  page: string
  valor: Record<string, unknown>
  updatedAt: string
}

const SELECT = `site, page, valor, updated_at AS "updatedAt"`

// La tabla site_content la crea la migración 006 de CNP (BD compartida `cnp`)
// con GRANT a peritus_user. Aquí solo se usa con site='peritus'.

export async function getSiteContent(page: string): Promise<SiteContentRow | null> {
  return queryOne<SiteContentRow>(
    `SELECT ${SELECT} FROM site_content WHERE site = 'peritus' AND page = $1`,
    [page],
  )
}

export async function setSiteContent(
  page: string,
  valor: Record<string, unknown>,
): Promise<SiteContentRow | null> {
  return queryOne<SiteContentRow>(
    `INSERT INTO site_content (site, page, valor, updated_at)
     VALUES ('peritus', $1, $2::jsonb, now())
     ON CONFLICT (site, page)
     DO UPDATE SET valor = EXCLUDED.valor, updated_at = now()
     RETURNING ${SELECT}`,
    [page, JSON.stringify(valor ?? {})],
  )
}

export async function listSiteContent(): Promise<SiteContentRow[]> {
  return query<SiteContentRow>(
    `SELECT ${SELECT} FROM site_content WHERE site = 'peritus' ORDER BY page`,
  )
}
