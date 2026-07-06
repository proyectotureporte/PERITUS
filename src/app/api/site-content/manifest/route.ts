// Manifiesto de páginas editables de peritus.com.co para el panel /santiago.
// Server-to-server con x-content-secret.
import { NextRequest, NextResponse } from 'next/server'
import { requireContentSecret } from '@/lib/content/secret'
import { PAGINAS_PERITUS, getPaginaPeritus } from '@/lib/content/registry'
import { getSiteContent } from '@/lib/content/store'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const stop = requireContentSecret(request)
  if (stop) return stop
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    if (!page) {
      return NextResponse.json({
        success: true,
        paginas: PAGINAS_PERITUS.map((p) => ({ key: p.key, nombre: p.nombre, url: p.url })),
      })
    }
    const pagina = getPaginaPeritus(page)
    if (!pagina) {
      return NextResponse.json({ success: false, error: 'Página no encontrada' }, { status: 404 })
    }
    const row = await getSiteContent(page)
    return NextResponse.json({
      success: true,
      key: pagina.key,
      nombre: pagina.nombre,
      url: pagina.url,
      secciones: pagina.secciones,
      defaults: pagina.defaults,
      valores: row?.valor ?? null,
    })
  } catch (e) {
    console.error('Error site-content/manifest:', e)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
