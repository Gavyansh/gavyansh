/** Seed data for Review table (matches legacy `src/constants.ts` REVIEWS). */
export const DEFAULT_REVIEWS: { id: string; name: string; rating: number; comment: string; date: string }[] = [
  {
    id: '1',
    name: 'Anjali Sharma',
    rating: 5,
    comment:
      'The aroma takes me back to my childhood. Truly authentic Bilona ghee. The texture is perfectly granular.',
    date: '2024-02-15',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    rating: 5,
    comment: 'I have tried many brands, but this one is pure gold. Excellent for my daily bullet coffee and cooking.',
    date: '2024-03-01',
  },
];
