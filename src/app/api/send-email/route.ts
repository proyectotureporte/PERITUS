import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailTemplate =
  | 'welcome'
  | 'case_created'
  | 'case_assigned'
  | 'new_message'
  | 'payment_received'
  | 'payment_released'
  | 'verification_approved'
  | 'verification_rejected'
  | 'deadline_reminder';

interface EmailRequest {
  to: string;
  template: EmailTemplate;
  data: Record<string, string | number>;
}

const templates: Record<EmailTemplate, { subject: string; body: (data: Record<string, string | number>) => string }> = {
  welcome: {
    subject: 'Bienvenido a PERITUS - Centro Nacional de Pruebas',
    body: (data) => `
      <h1>¡Bienvenido a PERITUS, ${data.name}!</h1>
      <p>Gracias por unirte a la plataforma más confiable de peritaje profesional en Colombia.</p>
      <p>Tu cuenta ha sido creada exitosamente como <strong>${data.role === 'cliente' ? 'Cliente' : 'Perito'}</strong>.</p>
      ${data.role === 'perito' ? '<p>Para comenzar a recibir casos, completa tu verificación de credenciales.</p>' : '<p>Ya puedes comenzar a buscar peritos expertos para tus casos.</p>'}
      <p><a href="${data.loginUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Ir a PERITUS</a></p>
    `,
  },
  case_created: {
    subject: 'Nuevo caso creado - ${caseNumber}',
    body: (data) => `
      <h1>Caso Creado Exitosamente</h1>
      <p>Tu caso <strong>${data.caseNumber}</strong> ha sido registrado.</p>
      <p><strong>Título:</strong> ${data.title}</p>
      <p><strong>Especialidad:</strong> ${data.specialty}</p>
      <p>Estamos buscando al mejor perito para tu caso. Te notificaremos cuando sea asignado.</p>
      <p><a href="${data.caseUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Ver Caso</a></p>
    `,
  },
  case_assigned: {
    subject: 'Caso asignado - ${caseNumber}',
    body: (data) => `
      <h1>Caso Asignado</h1>
      <p>El caso <strong>${data.caseNumber}</strong> ha sido asignado ${data.role === 'perito' ? 'a ti' : `al perito ${data.expertName}`}.</p>
      <p><strong>Título:</strong> ${data.title}</p>
      ${data.role === 'perito' ? '<p>Por favor revisa los detalles del caso y comienza a trabajar en él.</p>' : '<p>El perito comenzará a trabajar en tu caso pronto.</p>'}
      <p><a href="${data.caseUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Ver Caso</a></p>
    `,
  },
  new_message: {
    subject: 'Nuevo mensaje en tu caso - ${caseNumber}',
    body: (data) => `
      <h1>Tienes un nuevo mensaje</h1>
      <p><strong>${data.senderName}</strong> te ha enviado un mensaje en el caso <strong>${data.caseNumber}</strong>.</p>
      <p style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">"${data.messagePreview}..."</p>
      <p><a href="${data.chatUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Ver Mensaje</a></p>
    `,
  },
  payment_received: {
    subject: 'Pago recibido - ${amount}',
    body: (data) => `
      <h1>Pago Recibido</h1>
      <p>Hemos recibido tu pago de <strong>${data.amount}</strong> para el caso <strong>${data.caseNumber}</strong>.</p>
      <p>El pago está en custodia (escrow) y será liberado al perito cuando el caso sea completado y aprobado.</p>
      <p><a href="${data.paymentUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Ver Detalles</a></p>
    `,
  },
  payment_released: {
    subject: 'Pago liberado - ${amount}',
    body: (data) => `
      <h1>¡Pago Liberado!</h1>
      <p>Se ha liberado el pago de <strong>${data.amount}</strong> del caso <strong>${data.caseNumber}</strong>.</p>
      <p>El monto ha sido transferido a tu cuenta registrada.</p>
      <p><a href="${data.paymentUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Ver Detalles</a></p>
    `,
  },
  verification_approved: {
    subject: '¡Tu verificación ha sido aprobada!',
    body: (data) => `
      <h1>¡Felicitaciones, ${data.name}!</h1>
      <p>Tu perfil de perito ha sido verificado exitosamente.</p>
      <p>Ya puedes comenzar a recibir casos y ofrecer tus servicios profesionales en PERITUS.</p>
      <p><a href="${data.dashboardUrl}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Ir a mi Dashboard</a></p>
    `,
  },
  verification_rejected: {
    subject: 'Actualización sobre tu verificación',
    body: (data) => `
      <h1>Actualización de Verificación</h1>
      <p>Hola ${data.name},</p>
      <p>Después de revisar tu solicitud de verificación, necesitamos información adicional:</p>
      <p style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin: 16px 0;">${data.reason}</p>
      <p>Por favor actualiza tu perfil con la información solicitada.</p>
      <p><a href="${data.verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Actualizar Información</a></p>
    `,
  },
  deadline_reminder: {
    subject: 'Recordatorio: Fecha límite próxima - ${caseNumber}',
    body: (data) => `
      <h1>Recordatorio de Fecha Límite</h1>
      <p>El caso <strong>${data.caseNumber}</strong> tiene una fecha límite en <strong>${data.daysRemaining} días</strong>.</p>
      <p><strong>Título:</strong> ${data.title}</p>
      <p><strong>Fecha límite:</strong> ${data.deadline}</p>
      <p>Por favor asegúrate de completar el dictamen a tiempo.</p>
      <p><a href="${data.caseUrl}" style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Ver Caso</a></p>
    `,
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json() as EmailRequest;
    const { to, template, data } = body;

    if (!to || !template || !templates[template]) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const templateConfig = templates[template];

    // Replace placeholders in subject
    let subject = templateConfig.subject;
    Object.entries(data).forEach(([key, value]) => {
      subject = subject.replace(`\${${key}}`, String(value));
    });

    const htmlContent = templateConfig.body(data);

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'PERITUS <noreply@peritus.co>',
      to,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; }
            h1 { color: #111827; margin-bottom: 16px; }
            p { margin: 8px 0; }
            a { color: #2563eb; }
          </style>
        </head>
        <body style="margin: 0; padding: 32px; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            ${htmlContent}
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
            <p style="font-size: 12px; color: #6b7280; text-align: center;">
              © ${new Date().getFullYear()} PERITUS - Centro Nacional de Pruebas<br>
              Este correo fue enviado porque tienes una cuenta activa en nuestra plataforma.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in send-email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
