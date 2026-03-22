/** Seed data when Product table is empty */
export const DEFAULT_PRODUCTS = [
  {
    id: 'a2-desi-ghee',
    name: 'A2 Vedic Bilona Ghee',
    description:
      'Traditionally churned from the curd of A2 milk of grass-fed Desi Cows. Rich in aroma and granular in texture.',
    image: '/images/D2.jpeg',
    benefits: ['Rich in A2 Protein', 'Bilona Method', 'No Preservatives'],
    variants: [
      { weight: '500ml', price: 850 },
      { weight: '1L', price: 1600 },
    ],
  },
  {
    id: 'gir-cow-ghee',
    name: 'Gir Cow Ghee',
    description:
      'Pure and authentic Gir Cow Ghee, traditionally churned for maximum health benefits and superior taste.',
    image: '/images/D1.jpeg',
    benefits: ['Pure Gir Cow Milk', 'Traditionally Churned', 'Superior Taste'],
    variants: [
      { weight: '500ml', price: 950 },
      { weight: '1L', price: 1800 },
    ],
  },
];
