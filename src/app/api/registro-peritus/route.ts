import { NextRequest, NextResponse } from 'next/server'
import { getSanityClient } from '@/lib/sanity/client'
import bcrypt from 'bcryptjs'
import { sendCredentialsEmail } from '@/lib/email'

async function generateNextId(client: ReturnType<typeof getSanityClient>): Promise<string> {
  const query = `*[_type == "registroPeritus"] | order(fechaRegistro desc)[0]{ peritusId }`
  const last = await client.fetch(query)
  if (!last?.peritusId) return 'PER-0001'
  const match = last.peritusId.match(/PER-(\d+)/)
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

    const client = getSanityClient()

    // Check duplicate in registroPeritus
    const existing = await client.fetch(
      `*[_type == "registroPeritus" && (cedula == $cedula || correo == $correo)][0]{ cedula, correo }`,
      { cedula, correo }
    )
    if (existing) {
      const msg = existing.cedula === cedula
        ? 'Ya existe un registro con esta cédula'
        : 'Ya existe un registro con este correo'
      return NextResponse.json({ error: msg }, { status: 409 })
    }

    // Generate PERITUS ID
    const peritusId = await generateNextId(client)

    // Upload CV if provided
    let hojaDeVidaAsset = null
    if (hojaDeVida && hojaDeVida.size > 0) {
      if (hojaDeVida.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'La hoja de vida no puede superar 5MB' }, { status: 400 })
      }
      const buffer = Buffer.from(await hojaDeVida.arrayBuffer())
      const asset = await client.assets.upload('file', buffer, {
        filename: hojaDeVida.name,
        contentType: hojaDeVida.type,
      })
      hojaDeVidaAsset = { _type: 'file', asset: { _type: 'reference', _ref: asset._id } }
    }

    // ============================================================
    // STEP 1: Create crmClient (same flow as CNP CRM)
    // ============================================================
    const newCrmClient = await client.create({
      _type: 'crmClient',
      brand: 'Peritus',
      name: nombreApellido,
      email: correo,
      phone: celular,
      company: '',
      position: cargo,
      notes: `Profesión: ${profesionOficio} | Especialidad: ${especialidad} | Experiencia: ${experiencia}`,
      status: 'prospecto',
      createdBy: 'Registro Web PERITUS',
    })

    // ============================================================
    // STEP 2: Create or update crmUser (portal access)
    // ============================================================
    const clientIdSuffix = newCrmClient._id.slice(-4)
    const portalPassword = `CNP${clientIdSuffix}`
    const passwordHash = await bcrypt.hash(portalPassword, 10)

    const existingUser = await client.fetch<{ _id: string } | null>(
      `*[_type == "crmUser" && email == $email && active == true][0]{ _id }`,
      { email: correo }
    )

    if (existingUser) {
      await client.patch(existingUser._id).set({ passwordHash, mustChangePassword: true }).commit()
    } else {
      await client.create({
        _type: 'crmUser',
        username: correo,
        email: correo,
        displayName: nombreApellido,
        phone: celular,
        passwordHash,
        role: 'cliente',
        active: true,
        mustChangePassword: true,
      })
    }

    // ============================================================
    // STEP 3: Create registroPeritus document (extra fields)
    // ============================================================
    const contrasenaHash = await bcrypt.hash(contrasena, 10)

    await client.create({
      _type: 'registroPeritus',
      peritusId,
      nombreApellido,
      cedula,
      correo,
      celular,
      ciudad,
      profesionOficio,
      cargo,
      experiencia,
      especialidad,
      edad,
      fechaRegistro: new Date().toISOString(),
      estadoDocumentacion: 'pendiente',
      activo: true,
      contrasenaHash,
      clientRef: { _type: 'reference', _ref: newCrmClient._id },
      ...(hojaDeVidaAsset && { hojaDeVida: hojaDeVidaAsset }),
    })

    // ============================================================
    // STEP 4: Send credentials email (fire-and-forget, same as CNP)
    // ============================================================
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
