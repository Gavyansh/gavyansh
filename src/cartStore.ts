import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './types';

interface CartItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant: { weight: string; price: number }) => void;
  removeItem: (id: string, weight: string) => void;
  updateQuantity: (id: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, variant) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.id === product.id && item.weight === variant.weight
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && item.weight === variant.weight
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id,
                name: product.name,
                weight: variant.weight,
                price: variant.price,
                quantity: 1,
                image: product.image,
              },
            ],
          });
        }
      },
      removeItem: (id, weight) => {
        set({
          items: get().items.filter((item) => !(item.id === id && item.weight === weight)),
        });
      },
      updateQuantity: (id, weight, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, weight);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id && item.weight === weight ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: 'gavyansh-cart',
    }
  )
);
