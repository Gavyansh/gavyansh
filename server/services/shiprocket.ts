import { OrderRecord } from '../api/checkout';

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

async function getToken(): Promise<string> {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error('Shiprocket credentials not configured');
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!data.token) {
    throw new Error('Failed to get Shiprocket token');
  }
  return data.token;
}

function extractPincode(address: string): string {
  const match = address.match(/\b(\d{6})\b/);
  return match ? match[1] : '';
}

export async function createShiprocketOrder(order: OrderRecord): Promise<{ order_id: string; awb?: string } | null> {
  const token = await getToken();
  const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary';
  const { customer, items, id: orderId, total } = order;

  const pincode = customer.pincode || extractPincode(customer.address);
  const phoneStr = customer.phone.replace(/\D/g, '').slice(-10) || '9999999999';
  const phone = parseInt(phoneStr, 10) || 9999999999;

  const orderDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const payload = {
    order_id: orderId,
    order_date: orderDate,
    channel_id: '',
    billing_customer_name: customer.name.split(' ')[0] || customer.name,
    billing_last_name: customer.name.split(' ').slice(1).join(' ') || '',
    billing_address: customer.address,
    billing_address_2: '',
    billing_city: customer.city || 'Surat',
    billing_pincode: parseInt(pincode, 10) || 395007,
    billing_state: customer.state || 'Gujarat',
    billing_country: 'India',
    billing_email: customer.email,
    billing_phone: phone,
    billing_alternate_phone: '',
    shipping_is_billing: 1,
    shipping_customer_name: customer.name.split(' ')[0] || customer.name,
    shipping_last_name: customer.name.split(' ').slice(1).join(' ') || '',
    shipping_address: customer.address,
    shipping_address_2: '',
    shipping_city: customer.city || 'Surat',
    shipping_pincode: parseInt(pincode, 10) || 395007,
    shipping_state: customer.state || 'Gujarat',
    shipping_country: 'India',
    shipping_phone: phone,
    order_items: items.map((item) => ({
      name: item.name,
      sku: item.id,
      units: item.quantity,
      selling_price: item.price,
    })),
    payment_method: (order as { paymentMethod?: string }).paymentMethod === 'COD' ? 'COD' : 'Prepaid',
    sub_total: total,
    length: 15,
    breadth: 15,
    height: 10,
    weight: Math.max(500, items.reduce((sum, i) => sum + i.quantity * 500, 0)),
    pickup_location: pickupLocation,
  };

  const res = await fetch(`${BASE_URL}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('Shiprocket API error:', data);
    return null;
  }

  return {
    order_id: data.order_id?.toString() || orderId,
    awb: data.awb_code || data.shipment?.awb,
  };
}
