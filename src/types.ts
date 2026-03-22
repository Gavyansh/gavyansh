import { LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  /** Up to 3 gallery URLs; when omitted, UI uses `image` only. */
  images?: string[];
  benefits: string[];
  variants: {
    weight: string;
    price: number;
  }[];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: LucideIcon;
}
