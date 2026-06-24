import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { withTransaction, newId } from '@/lib/db'
import { findDuplicate, getMaxNumericPeritusId } from '@/lib/db/registroPeritus'
import { uploadFile } from '@/lib/sanity/assets'
import { sendPeritusWelcomeEmail } from '@/lib/email'

function nextPeritusId(last: string | null): string {
  if (!last) return 'PER-0001'
  const match = last.match(/^PER-(\d+)$/)
  if (!match) return 'PER-0001'
  return `PER-${String(parseInt(match[1], 10) + 1).padStart(4, '0')}`
}

/** Año inferior del rango de experiencia del formulario ("2-5" → 2, "20+" → 20, "0-1" → 0). */
function parseExperienceYears(rango: string): number {
  const m = (rango || '').match(/\d+/)
  return m ? parseInt(m[0], 10) : 0
}

/** Reintentos ante colisión concurrente del índice único de peritus_id. */
const MAX_PERITUS_ID_RETRIES = 5
function isPeritusIdCollision(e: unknown): boolean {
  const err = e as { code?: string; constraint?: string }
  return err?.code === '23505' && err?.constraint === 'idx_registro_peritus_peritus_id'
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const nombreApellido = (formData.get('nombreApellido') as string)?.trim()
    const cedula = (formData.get('cedula') as string)?.trim()
    const correo = (formData.get('correo') as string)?.trim().toLowerCase()
    const celular = (formData.get('celular') as string)?.trim()
    const ciudad = formData.get('ciudad') as string
    const profesionOficio = formData.get('profesionOficio') as string
    const cargo = formData.get('cargo') as string
    const experiencia = formData.get('experiencia') as string
    const especialidad = (formData.get('especialidad') as string)?.trim()
    const edad = formData.get('edad') as string
    const contrasena = formData.get('contrasena') as string
    const hojaDeVida = formData.get('hojaDeVida') as File | null

    // Validations
    if (!nombreApellido || !cedula || !correo || !celular || !ciudad ||
        !profesionOficio || !cargo || !experiencia || !especialidad || !edad || !contrasena) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
    }
    if (!/^\d{7,10}$/.test(cedula)) {
      return NextResponse.json({ error: 'La cédula debe tener entre 7 y 10 dígitos' }, { status: 400 })
    }
    if (!/\S+@\S+\.\S+/.test(correo)) {
      return NextResponse.json({ error: 'Formato de correo inválido' }, { status: 400 })
    }
    if (!/^\d{10}$/.test(celular)) {
      return NextResponse.json({ error: 'El celular debe tener 10 dígitos' }, { status: 400 })
    }
    if (contrasena.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    // Check duplicate in registro_peritus
    const existing = await findDuplicate(cedula, correo)
    if (existing) {
      const msg = existing.cedula === cedula
        ? 'Ya existe un registro con esta cédula'
        : 'Ya existe un registro con este correo'
      return NextResponse.json({ error: msg }, { status: 409 })
    }

    // Upload CV to Sanity CDN (los archivos siguen en el CDN tras la migración)
    let cvFile: { url: string | null; assetId: string; name: string | null; mime: string | null; size: number | null } | null = null
    if (hojaDeVida && hojaDeVida.size > 0) {
      if (hojaDeVida.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'La hoja de vida no puede superar 5MB' }, { status: 400 })
      }
      const buffer = Buffer.from(await hojaDeVida.arrayBuffer())
      const asset = await uploadFile(buffer, hojaDeVida.name, hojaDeVida.type)
      cvFile = { url: asset.url, assetId: asset.assetId, name: asset.originalFilename, mime: asset.mimeType, size: asset.size }
    }

    // IDs y credenciales de acceso al CRM (rol perito). El login del PORTAL de
    // peritus.com.co usa la contraseña ELEGIDA (registro_peritus.contrasena_hash),
    // no esta credencial CNPxxxx (que es la cuenta crm_user del directorio).
    const crmUserId = newId()
    const portalPassword = `CNP${crmUserId.slice(-4)}`
    const portalPasswordHash = await bcrypt.hash(portalPassword, 10)
    const contrasenaHash = await bcrypt.hash(contrasena, 10)
    const experienceYears = parseExperienceYears(experiencia)
    const disciplines = [profesionOficio]

    // El peritus_id se calcula DENTRO del bucle: si dos registros concurrentes
    // obtienen el mismo número, el índice único lanza 23505 y reintentamos con
    // el siguiente número (toda la transacción hizo ROLLBACK, sin huérfanos).
    let peritusId = ''
    for (let attempt = 0; ; attempt++) {
      peritusId = nextPeritusId(await getMaxNumericPeritusId())
      try {
        await withTransaction(async (db) => {
          // STEP 1: crm_user con rol 'perito'. Si el correo ya tiene cuenta activa
          // la reutiliza y la promueve a perito (evita chocar con el índice único
          // de username); si no, crea la cuenta nueva.
          let userId = crmUserId
          const foundUser = await db.query(
            `SELECT id FROM crm_user WHERE lower(email) = lower($1) AND active = TRUE LIMIT 1`,
            [correo],
          )
          if (foundUser.rows.length > 0) {
            userId = foundUser.rows[0].id
            await db.query(
              `UPDATE crm_user SET password_hash = $1, role = 'perito', must_change_password = TRUE WHERE id = $2`,
              [portalPasswordHash, userId],
            )
          } else {
            await db.query(
              `INSERT INTO crm_user (id, username, email, display_name, phone, password_hash, role, active, must_change_password)
               VALUES ($1, $2, $2, $3, $4, $5, 'perito', TRUE, TRUE)`,
              [userId, correo, nombreApellido, celular, portalPasswordHash],
            )
          }

          // STEP 2: expert (perfil en el directorio de Peritos del CRM, estado
          // 'pendiente' de validación). Idempotente por user_id: actualiza si ya
          // existía un perfil para esa cuenta.
          const foundExpert = await db.query(`SELECT id FROM expert WHERE user_id = $1 LIMIT 1`, [userId])
          if (foundExpert.rows.length > 0) {
            await db.query(
              `UPDATE expert SET
                 disciplines = $1::text[], specialization = $2, experience_years = $3,
                 city = $4, tax_id = $5, cv_file_url = $6, cv_file_asset_id = $7,
                 cv_file_name = $8, cv_mime_type = $9, cv_file_size = $10
               WHERE id = $11`,
              [
                disciplines, especialidad, experienceYears, ciudad, cedula,
                cvFile?.url ?? null, cvFile?.assetId ?? null, cvFile?.name ?? null,
                cvFile?.mime ?? null, cvFile?.size ?? null, foundExpert.rows[0].id,
              ],
            )
          } else {
            await db.query(
              `INSERT INTO expert (
                 id, user_id, disciplines, specialization, experience_years, professional_card,
                 city, region, tax_id, cv_file_url, cv_file_asset_id, cv_file_name, cv_mime_type,
                 cv_file_size, availability, validation_status, fee_currency
               ) VALUES (
                 $1, $2, $3::text[], $4, $5, '', $6, '', $7, $8, $9, $10, $11, $12,
                 'disponible', 'pendiente', 'COP'
               )`,
              [
                newId(), userId, disciplines, especialidad, experienceYears, ciudad, cedula,
                cvFile?.url ?? null, cvFile?.assetId ?? null, cvFile?.name ?? null,
                cvFile?.mime ?? null, cvFile?.size ?? null,
              ],
            )
          }

          // STEP 3: registro_peritus (login del portal + datos del formulario y CV).
          // Vinculado al crm_user del perito (user_id). Ya NO se crea crm_client.
          await db.query(
            `INSERT INTO registro_peritus (
               id, peritus_id, nombre_apellido, cedula, correo, celular, ciudad,
               profesion_oficio, cargo, experiencia, especialidad, edad,
               file_url, file_asset_id, file_name, mime_type, file_size,
               fecha_registro, estado_documentacion, activo, contrasena_hash, user_id
             ) VALUES (
               $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
               $13, $14, $15, $16, $17, now(), 'pendiente', TRUE, $18, $19
             )`,
            [
              newId(), peritusId, nombreApellido, cedula, correo, celular, ciudad,
              profesionOficio, cargo, experiencia, especialidad, edad,
              cvFile?.url ?? null, cvFile?.assetId ?? null, cvFile?.name ?? null,
              cvFile?.mime ?? null, cvFile?.size ?? null,
              contrasenaHash, userId,
            ],
          )
        })
        break // éxito
      } catch (e) {
        if (isPeritusIdCollision(e) && attempt < MAX_PERITUS_ID_RETRIES - 1) continue
        throw e
      }
    }

    // STEP 4: email de bienvenida de Peritus (fire-and-forget).
    // El perito entra al portal con su correo y la contraseña que ELIGIÓ en este formulario.
    sendPeritusWelcomeEmail({
      to: correo,
      nombre: nombreApellido,
      peritusId,
    }).catch((err) => console.error('[registro-peritus] Email send failed:', err))

    return NextResponse.json({
      success: true,
      peritusId,
      portalPassword,
      message: 'Registro exitoso',
    }, { status: 201 })
  } catch (error) {
    console.error('[registro-peritus] Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
