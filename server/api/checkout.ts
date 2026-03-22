import { Request, Response } from 'express';
import { sendEmail } from './email.js';
import { prisma } from '../db.js';

export interface OrderRecord {
  id: string;
  customer: { name: string; email: string; phone: string; address: string; city?: string; state?: string; pincode?: string };
  items: Array<{ id: string; name: string; weight: string; price: number; quantity: number }>;
  total: number;
  createdAt: string;
  [key: string]: unknown;
}

export async function saveOrder(order: OrderRecord) {
  const o = order as OrderRecord & {
    userId?: string;
    paymentMethod?: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    shiprocketOrderId?: string | null;
    awb?: string | null;
  };

  await prisma.order.create({
    data: {
      id: o.id,
      userId: o.userId ?? null,
      paymentMethod: o.paymentMethod ?? null,
      razorpayPaymentId: o.razorpayPaymentId ?? null,
      razorpayOrderId: o.razorpayOrderId ?? null,
      customerName: o.customer.name,
      customerEmail: o.customer.email,
      customerPhone: o.customer.phone,
      customerAddress: o.customer.address,
      customerCity: o.customer.city ?? null,
      customerState: o.customer.state ?? null,
      customerPincode: o.customer.pincode ?? null,
      total: o.total,
      shiprocketOrderId: o.shiprocketOrderId ?? null,
      awb: o.awb ?? null,
      items: {
        create: o.items.map((i) => ({
          productId: i.id,
          name: i.name,
          weight: i.weight,
          price: i.price,
          quantity: i.quantity,
        })),
      },
    },
  });
}

export function buildOrderEmailHtml(order: OrderRecord) {
  const { id: orderId, customer, items, total } = order;
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.weight})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price * item.quantity}</td>
    </tr>
  `
    )
    .join('');

  return `
    <div style="font-family: serif; color: #5A4A32; max-width: 600px; margin: auto; border: 1px solid #D4AF37; padding: 40px; border-radius: 20px;">
      <h1 style="color: #D4AF37; text-align: center;">Gavyansh Vedic Ghee</h1>
      <h2 style="text-align: center;">Order Confirmation (${orderId})</h2>
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
}

export async function sendOrderEmails(order: OrderRecord) {
  if (!process.env.RESEND_API_KEY) return;

  const emailContent = buildOrderEmailHtml(order);
  const { id: orderId, customer } = order;
  const notifyEmail = process.env.ORDER_NOTIFY_EMAIL;

  try {
    await sendEmail({
      to: customer.email,
      subject: `Order Confirmed (${orderId}) - Gavyansh Vedic Ghee`,
      html: emailContent,
    });

    if (notifyEmail) {
      await sendEmail({
        to: notifyEmail,
        subject: `New Order ${orderId} from ${customer.name}`,
        html: `
        <h1>New Order Alert</h1>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customer.name}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Phone:</strong> ${customer.phone}</p>
        <p><strong>Address:</strong> ${customer.address}</p>
        <hr/>
        ${emailContent}
      `,
      });
    }
  } catch (err) {
    console.error('Order email error:', err);
  }
}

export async function handleCheckout(req: Request, res: Response) {
  const { customer, items, total } = req.body;

  if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
    return res.status(400).json({
      error: 'Missing required customer details',
      required: ['name', 'email', 'phone', 'address'],
    });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const orderId = `ORD-${Date.now()}`;
  const orderRecord: OrderRecord = {
    id: orderId,
    customer: {
      name: String(customer.name).trim(),
      email: String(customer.email).trim(),
      phone: String(customer.phone).trim(),
      address: String(customer.address).trim(),
    },
    items: items.map((i: { id: string; name: string; weight: string; price: number; quantity: number }) => ({
      id: i.id,
      name: i.name,
      weight: i.weight,
      price: i.price,
      quantity: i.quantity,
    })),
    total: Number(total) || 0,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveOrder(orderRecord);
  } catch (err) {
    console.error('saveOrder error:', err);
    return res.status(500).json({ error: 'Failed to save order' });
  }

  sendOrderEmails(orderRecord).catch((err) => console.error('Order email failed:', err));

  res.status(200).json({
    success: true,
    message: 'Order placed successfully',
    orderId,
  });
}
