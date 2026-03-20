import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.ORDER_FROM_EMAIL || 'onboarding@resend.dev';
const fromName = process.env.ORDER_FROM_NAME || 'Gavyansh Vedic Ghee';

function getFrom() {
  return `${fromName} <${fromEmail}>`;
}

export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  if (!resendApiKey) return;

  const resend = new Resend(resendApiKey);
  const to = Array.isArray(options.to) ? options.to : [options.to];

  const { error } = await resend.emails.send({
    from: getFrom(),
    to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  });

  if (error) throw error;
}
