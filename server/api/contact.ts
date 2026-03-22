import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { sendEmail } from './email.js';
import { DATA_DIR, ensureDataDir } from '../dataPaths.js';

const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

function saveContact(contact: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}) {
  ensureDataDir();
  let contacts: typeof contact[] = [];
  if (fs.existsSync(CONTACTS_FILE)) {
    contacts = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'));
  }
  contacts.push(contact);
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf-8');
}

export async function handleContact(req: Request, res: Response) {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['name', 'email', 'message'],
    });
  }

  const contactRecord = {
    id: `contact-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim(),
    phone: phone ? String(phone).trim() : undefined,
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
  };

  // Save to file
  try {
    saveContact(contactRecord);
  } catch (err) {
    console.error('Failed to save contact:', err);
  }

  // Send email if configured (Resend - Railway blocks SMTP)
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
          <p><em>Received at ${contactRecord.createdAt}</em></p>
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
