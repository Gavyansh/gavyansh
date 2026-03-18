import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/checkout', async (req, res) => {
    const { customer, items, total } = req.body;

    // Create a transporter
    // NOTE: For production, use real SMTP credentials in environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'info1gavyansh@gmail.com',
        pass: process.env.EMAIL_PASS, // This needs to be an App Password for Gmail
      },
    });

    const itemsHtml = items
      .map(
        (item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.weight})</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price * item.quantity}</td>
      </tr>
    `
      )
      .join('');

    const emailContent = `
      <div style="font-family: serif; color: #5A4A32; max-width: 600px; margin: auto; border: 1px solid #D4AF37; padding: 40px; border-radius: 20px;">
        <h1 style="color: #D4AF37; text-align: center;">Gavyansh Vedic Ghee</h1>
        <h2 style="text-align: center;">Order Confirmation</h2>
        <p>Dear ${customer.name},</p>
        <p>Thank you for your order! We are preparing your liquid gold for delivery.</p>
        
        <h3>Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #F5F2ED;">
              <th style="text-align: left; padding: 10px;">Product</th>
              <th style="text-align: left; padding: 10px;">Qty</th>
              <th style="text-align: left; padding: 10px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; font-weight: bold;">Total</td>
              <td style="padding: 10px; font-weight: bold; color: #D4AF37;">₹${total}</td>
            </tr>
          </tfoot>
        </table>

        <h3>Delivery Address:</h3>
        <p>${customer.address}</p>
        <p>Phone: ${customer.phone}</p>

        <p style="margin-top: 40px; border-top: 1px solid #D4AF37; pt: 20px; text-align: center; font-size: 12px; color: #999;">
          Go the Vedic Way • Gavyansh
        </p>
      </div>
    `;

    try {
      // 1. Send email to Customer
      await transporter.sendMail({
        from: '"Gavyansh Vedic Ghee" <info1gavyansh@gmail.com>',
        to: customer.email,
        subject: 'Order Confirmed - Gavyansh Vedic Ghee',
        html: emailContent,
      });

      // 2. Send email to Admin
      await transporter.sendMail({
        from: '"Gavyansh Website" <info1gavyansh@gmail.com>',
        to: 'info1gavyansh@gmail.com',
        subject: `New Order Received from ${customer.name}`,
        html: `
          <h1>New Order Alert</h1>
          <p><strong>Customer:</strong> ${customer.name}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Phone:</strong> ${customer.phone}</p>
          <p><strong>Address:</strong> ${customer.address}</p>
          <hr/>
          ${emailContent}
        `,
      });

      res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
      console.error('Email error:', error);
      // Even if email fails, we log it. In a real app, you might use a queue.
      res.status(500).json({ error: 'Failed to send confirmation email' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
