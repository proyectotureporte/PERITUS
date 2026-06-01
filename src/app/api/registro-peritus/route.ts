import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { withTransaction, newId } from '@/lib/db'
import { findDuplicate, getLatestPeritusId } from '@/lib/db/registroPeritus'
import { uploadFile } from '@/lib/sanity/assets'
import { sendCredentialsEmail } from '@/lib/email'

function nextPeritusId(last: string | null): string {
  if (!last) return 'PER-0001'
  const match = last.match(/PER-(\d+)/)
  if (!match) return 'PER-0001'
  return `PER-${String(parseInt(match[1], 10) + 1).padStart(4, '0')}`
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

    // Generate PERITUS ID
    const peritusId = nextPeritusId(await getLatestPeritusId())

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

    // IDs y credenciales del portal (mismo flujo que CNP)
    const clientId = newId()
    const portalPassword = `CNP${clientId.slice(-4)}`
    const portalPasswordHash = await bcrypt.hash(portalPassword, 10)
    const contrasenaHash = await bcrypt.hash(contrasena, 10)

    await withTransaction(async (db) => {
      // STEP 1: crm_client
      await db.query(
        `INSERT INTO crm_client (id, brand, name, email, phone, company, position, notes, status, created_by)
         VALUES ($1, 'Peritus', $2, $3, $4, '', $5, $6, 'prospecto', 'Registro Web PERITUS')`,
        [
          clientId, nombreApellido, correo, celular, cargo,
          `Profesión: ${profesionOficio} | Especialidad: ${especialidad} | Experiencia: ${experiencia}`,
        ],
      )

      // STEP 2: crm_user (acceso portal) — crear o actualizar contraseña si ya existe
      const found = await db.query(
        `SELECT id FROM crm_user WHERE lower(email) = lower($1) AND active = TRUE LIMIT 1`,
        [correo],
      )
      if (found.rows.length > 0) {
        await db.query(
          `UPDATE crm_user SET password_hash = $1, must_change_password = TRUE WHERE id = $2`,
          [portalPasswordHash, found.rows[0].id],
        )
      } else {
        await db.query(
          `INSERT INTO crm_user (id, username, email, display_name, phone, password_hash, role, active, must_change_password)
           VALUES ($1, $2, $2, $3, $4, $5, 'cliente', TRUE, TRUE)`,
          [newId(), correo, nombreApellido, celular, portalPasswordHash],
        )
      }

      // STEP 3: registro_peritus
      await db.query(
        `INSERT INTO registro_peritus (
           id, peritus_id, nombre_apellido, cedula, correo, celular, ciudad,
           profesion_oficio, cargo, experiencia, especialidad, edad,
           file_url, file_asset_id, file_name, mime_type, file_size,
           fecha_registro, estado_documentacion, activo, contrasena_hash, client_id
         ) VALUES (
           $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
           $13, $14, $15, $16, $17, now(), 'pendiente', TRUE, $18, $19
         )`,
        [
          newId(), peritusId, nombreApellido, cedula, correo, celular, ciudad,
          profesionOficio, cargo, experiencia, especialidad, edad,
          cvFile?.url ?? null, cvFile?.assetId ?? null, cvFile?.name ?? null,
          cvFile?.mime ?? null, cvFile?.size ?? null,
          contrasenaHash, clientId,
        ],
      )
    })

    // STEP 4: email de credenciales (fire-and-forget, igual que CNP)
    sendCredentialsEmail({
      to: correo,
      clientName: nombreApellido,
      username: correo,
      password: portalPassword,
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
