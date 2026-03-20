import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { saveOrder, sendOrderEmails } from './checkout';
import { getUserFromToken } from './auth.js';
import { createShiprocketOrder } from '../services/shiprocket';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function handleCreateOrder(req: Request, res: Response) {
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

  const amountInPaise = Math.round((Number(total) || 0) * 100);
  if (amountInPaise < 100) {
    return res.status(400).json({ error: 'Minimum order amount is ₹1' });
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: 'Payment gateway not configured' });
  }

  const orderId = `ORD-${Date.now()}`;

  try {
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderId,
      notes: {
        order_id: orderId,
        customer_email: customer.email,
      },
    });

    res.json({
      success: true,
      orderId,
      razorpayOrderId: order.id,
      amount: amountInPaise,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
}

export async function handleVerifyPayment(req: Request, res: Response) {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    customer,
    items,
    total,
    orderId,
  } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification data' });
  }

  if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
    return res.status(400).json({ error: 'Missing customer details' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    console.error('RAZORPAY_KEY_SECRET not configured');
    return res.status(500).json({ error: 'Payment verification not configured' });
  }

  const signatureBody = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signatureBody)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid payment signature' });
  }

  const user = getUserFromToken(req);
  const finalOrderId = orderId || `ORD-${Date.now()}`;
  const orderRecord = {
    id: finalOrderId,
    razorpayPaymentId: razorpay_payment_id,
    ...(user?.id && { userId: user.id }),
    razorpayOrderId: razorpay_order_id,
    customer: {
      name: String(customer.name).trim(),
      email: String(customer.email).trim(),
      phone: String(customer.phone).trim(),
      address: String(customer.address).trim(),
      city: String(customer.city || '').trim(),
      state: String(customer.state || '').trim(),
      pincode: String(customer.pincode || '').trim(),
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
    shiprocketOrderId: null as string | null,
    awb: null as string | null,
  };

  if (process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD) {
    try {
      const shipResult = await createShiprocketOrder(orderRecord);
      if (shipResult?.order_id) {
        orderRecord.shiprocketOrderId = shipResult.order_id;
        orderRecord.awb = shipResult.awb || null;
      }
    } catch (err) {
      console.error('Shiprocket order creation failed:', err);
    }
  }

  saveOrder(orderRecord);
  // Send emails in background - don't block the response
  sendOrderEmails(orderRecord).catch((err) => console.error('Order email failed:', err));

  res.json({
    success: true,
    message: 'Order placed successfully',
    orderId: finalOrderId,
  });
}
