import { Product, Review, Benefit } from './types';
import { Heart, ShieldCheck, Zap, Brain, Sun, Sparkles } from 'lucide-react';

export const PRODUCTS: Product[] = [
  {
    id: 'a2-desi-ghee',
    name: 'A2 Vedic Bilona Ghee',
    description: 'Traditionally churned from the curd of A2 milk of grass-fed Desi Cows. Rich in aroma and granular in texture.',
    image: '/input_file_0.png',
    benefits: ['Rich in A2 Protein', 'Bilona Method', 'No Preservatives'],
    variants: [
      { weight: '500ml', price: 850 },
      { weight: '1L', price: 1600 }
    ]
  },
  {
    id: 'gir-cow-ghee',
    name: 'Gir Cow Ghee',
    description: 'Pure and authentic Gir Cow Ghee, traditionally churned for maximum health benefits and superior taste.',
    image: '/input_file_1.png',
    benefits: ['Pure Gir Cow Milk', 'Traditionally Churned', 'Superior Taste'],
    variants: [
      { weight: '500ml', price: 950 },
      { weight: '1L', price: 1800 }
    ]
  }
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Anjali Sharma',
    rating: 5,
    comment: 'The aroma takes me back to my childhood. Truly authentic Bilona ghee. The texture is perfectly granular.',
    date: '2024-02-15'
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    rating: 5,
    comment: 'I have tried many brands, but this one is pure gold. Excellent for my daily bullet coffee and cooking.',
    date: '2024-03-01'
  }
];

export const BENEFITS: Benefit[] = [
  {
    title: 'Heart Health',
    description: 'Contains healthy fats that support cardiovascular health and maintain good cholesterol levels.',
    icon: Heart
  },
  {
    title: 'Digestive Aid',
    description: 'Rich in Butyric acid which helps in maintaining gut health and improves digestion.',
    icon: ShieldCheck
  },
  {
    title: 'Energy Booster',
    description: 'Medium-chain fatty acids provide an instant source of energy for your daily activities.',
    icon: Zap
  },
  {
    title: 'Brain Function',
    description: 'Essential fats in ghee are known to improve cognitive functions and memory.',
    icon: Brain
  },
  {
    title: 'Skin Glow',
    description: 'Natural antioxidants and healthy fats provide a natural radiance to your skin.',
    icon: Sparkles
  },
  {
    title: 'High Smoke Point',
    description: 'Perfect for Indian cooking as it doesn\'t break down into harmful free radicals at high heat.',
    icon: Sun
  }
];

export const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1495107336281-199c1576df01?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=800'
];
