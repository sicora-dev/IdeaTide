'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSupportEmail({
  email,
  name,
  subject,
  message,
  type,
}: {
  email: string;
  name: string;
  subject: string;
  message: string;
  type: string;
}) {
  if (!email || !name || !subject || !message) {
    throw new Error('Missing required fields');
  }

  const userHtml = `
    <h2>¡Solicitud de soporte recibida!</h2>
    <p>Hola ${name},</p>
    <p>Hemos recibido tu solicitud de soporte con el siguiente detalle:</p>
    <ul>
      <li><strong>Tipo:</strong> ${type}</li>
      <li><strong>Asunto:</strong> ${subject}</li>
    </ul>
    <p>Mensaje:</p>
    <blockquote>${message.replace(/\n/g, '<br/>')}</blockquote>
    <p>Nos pondremos en contacto contigo lo antes posible.</p>
    <p>Saludos,<br/>El equipo de soporte</p>
  `;

  const { error: userError } = await resend.emails.send({
    from: 'sicora@sicoradev.com',
    to: [email],
    subject: 'Hemos recibido tu solicitud de soporte',
    html: userHtml,
  });

  if (userError) {
    throw new Error('Failed to send confirmation email to user');
  }

  const adminHtml = `
    <h2>Nueva solicitud de soporte registrada</h2>
    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Tipo:</strong> ${type}</p>
    <p><strong>Asunto:</strong> ${subject}</p>
    <p><strong>Mensaje:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
  `;

  const { error: adminError } = await resend.emails.send({
    from: 'sicora@sicoradev.com',
    to: ['sirocornejoraez@gmail.com'],
    subject: `Nueva solicitud de soporte: ${subject}`,
    html: adminHtml,
  });

  if (adminError) {
    throw new Error('Failed to send notification email to admin');
  }
}