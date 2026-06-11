import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || '')
  return _resend
}

/**
 * Email de bienvenida para un perito recién registrado en PERITUS.
 * NO incluye contraseña: el perito accede con su correo y la contraseña que
 * eligió en el formulario de registro (no se genera ninguna automática).
 */
export async function sendPeritusWelcomeEmail({
  to,
  nombre,
  peritusId,
}: {
  to: string
  nombre: string
  peritusId: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not configured, skipping email')
    return null
  }

  const emailFrom = process.env.EMAIL_FROM || 'Peritus <contacto@peritus.com.co>'
  const replyTo = process.env.EMAIL_REPLY_TO || 'contacto@peritus.com.co'
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://peritus.com.co'
  const portalUrl = `${baseUrl}/portal/login`

  const { data, error } = await getResend().emails.send({
    from: emailFrom,
    to,
    replyTo,
    subject: 'Bienvenido al Portal de Peritos | PERITUS',
    text: `Bienvenido a PERITUS\n\nHola ${nombre},\n\nTu registro como perito se completó correctamente. Tu codigo PERITUS es ${peritusId}.\n\nYa puedes acceder al portal de peritos con tu correo electronico (${to}) y la contrasena que elegiste durante el registro.\n\nAccede aqui: ${portalUrl}\n\nPERITUS | Centro Nacional de Pruebas`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0a2a6e;">Bienvenido a PERITUS</h2>
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Tu registro como perito se complet&oacute; correctamente.</p>
        <div style="background: #f4f4f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Tu c&oacute;digo PERITUS:</strong> <code style="background: #e4e4e7; padding: 2px 6px; border-radius: 4px;">${peritusId}</code></p>
        </div>
        <p>Ya puedes acceder al portal de peritos con tu <strong>correo electr&oacute;nico</strong> (${to}) y la <strong>contrase&ntilde;a que elegiste</strong> durante el registro.</p>
        <p><a href="${portalUrl}" style="display:inline-block;background:#d4a843;color:#0a2a6e;font-weight:bold;padding:10px 20px;border-radius:8px;text-decoration:none;">Iniciar sesi&oacute;n</a></p>
        <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">Este es un correo autom&aacute;tico de PERITUS | Centro Nacional de Pruebas.</p>
      </div>
    `,
  })

  if (error) {
    console.error('[email] Error sending welcome email:', error)
    return null
  }

  return data
}

export async function sendCredentialsEmail({
  to,
  clientName,
  username,
  password,
}: {
  to: string
  clientName: string
  username: string
  password: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not configured, skipping email')
    return null
  }

  const emailFrom = process.env.EMAIL_FROM || 'CNP Portal <noreply@cnp.com.co>'
  const replyTo = process.env.EMAIL_REPLY_TO || 'soporte@cnp.com.co'
  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://cnp.com.co'}/portal/login`

  const { data, error } = await getResend().emails.send({
    from: emailFrom,
    to,
    replyTo,
    subject: 'Tus credenciales de acceso al Portal CNP',
    text: `Bienvenido al Portal CNP\n\nHola ${clientName},\n\nSe ha creado tu cuenta de acceso al portal de clientes.\n\nUsuario: ${username}\nContrasena: ${password}\n\nAccede al portal en: ${portalUrl}\n\nTe recomendamos cambiar tu contrasena despues del primer inicio de sesion.\n\nCNP | Peritus`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a;">Bienvenido al Portal CNP</h2>
        <p>Hola <strong>${clientName}</strong>,</p>
        <p>Se ha creado tu cuenta de acceso al portal de clientes. A continuaci&oacute;n encontrar&aacute;s tus credenciales:</p>
        <div style="background: #f4f4f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Usuario:</strong> ${username}</p>
          <p style="margin: 4px 0;"><strong>Contrase&ntilde;a:</strong> <code style="background: #e4e4e7; padding: 2px 6px; border-radius: 4px;">${password}</code></p>
        </div>
        <p>Puedes acceder al portal en: <a href="${portalUrl}">Iniciar Sesi&oacute;n</a></p>
        <p style="color: #666; font-size: 14px;">Te recomendamos cambiar tu contrase&ntilde;a despu&eacute;s del primer inicio de sesi&oacute;n.</p>
        <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">Este es un correo autom&aacute;tico del sistema CNP | Peritus.</p>
      </div>
    `,
  })

  if (error) {
    console.error('[email] Error sending credentials email:', error)
    return null
  }

  return data
}
