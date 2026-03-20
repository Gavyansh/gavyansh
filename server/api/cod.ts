import { Request, Response } from 'express';
import { saveOrder, sendOrderEmails, OrderRecord } from './checkout';
import { createShiprocketOrder } from '../services/shiprocket';

export async function handlePlaceOrderCOD(req: Request, res: Response) {
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
    paymentMethod: 'COD',
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
    orderId,
  });
}
