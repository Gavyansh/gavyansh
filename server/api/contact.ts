import { Request, Response } from 'express';
import { sendEmail } from './email.js';
import { prisma } from '../db.js';

export async function handleContact(req: Request, res: Response) {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['name', 'email', 'message'],
    });
  }

  const contactRecord = {
    name: String(name).trim(),
    email: String(email).trim(),
    phone: phone ? String(phone).trim() : undefined,
    message: String(message).trim(),
  };

  try {
    await prisma.contact.create({
      data: {
        name: contactRecord.name,
        email: contactRecord.email,
        phone: contactRecord.phone ?? null,
        message: contactRecord.message,
      },
    });
  } catch (err) {
    console.error('Failed to save contact:', err);
  }

  const notifyEmail = process.env.ORDER_NOTIFY_EMAIL;

  if (process.env.RESEND_API_KEY && notifyEmail) {
    try {
      await sendEmail({
        to: notifyEmail,
        subject: `New Contact: ${contactRecord.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${contactRecord.name}</p>
          <p><strong>Email:</strong> ${contactRecord.email}</p>
          <p><strong>Phone:</strong> ${contactRecord.phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <pre>${contactRecord.message}</pre>
          <p><em>Received at ${new Date().toISOString()}</em></p>
        `,
      });
    } catch (err) {
      console.error('Contact email error:', err);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Thank you! We will get back to you soon.',
  });
}
