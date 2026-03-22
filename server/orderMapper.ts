import type { Order as PrismaOrder, OrderItem } from '@prisma/client';
import type { OrderRecord } from './api/checkout.js';

type OrderWithItems = PrismaOrder & { items: OrderItem[] };

export function orderToRecord(order: OrderWithItems): OrderRecord {
  return {
    id: order.id,
    userId: order.userId ?? undefined,
    paymentMethod: order.paymentMethod ?? undefined,
    razorpayPaymentId: order.razorpayPaymentId ?? undefined,
    razorpayOrderId: order.razorpayOrderId ?? undefined,
    customer: {
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
      address: order.customerAddress,
      city: order.customerCity ?? undefined,
      state: order.customerState ?? undefined,
      pincode: order.customerPincode ?? undefined,
    },
    items: order.items.map((i) => ({
      id: i.productId,
      name: i.name,
      weight: i.weight,
      price: i.price,
      quantity: i.quantity,
    })),
    total: order.total,
    createdAt: order.createdAt.toISOString(),
    shiprocketOrderId: order.shiprocketOrderId,
    awb: order.awb,
  };
}
