import { useEffect, useState } from 'react';
import { REVIEWS } from '../constants';
import { Review } from '../types';
import { API_BASE } from '../api';

/** Loads reviews from the API when available; keeps static `REVIEWS` on failure or empty response until API returns rows. */
export function usePublicReviews(): Review[] {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);

  useEffect(() => {
    fetch(`${API_BASE}/api/reviews`)
      .then((r) => r.json())
      .then((data: unknown) => {
        if (!Array.isArray(data)) return;
        const mapped: Review[] = data.map((x: Record<string, unknown>) => ({
          id: String(x.id ?? ''),
          name: String(x.name ?? ''),
          rating: Math.min(5, Math.max(1, Number(x.rating) || 5)),
          comment: String(x.comment ?? ''),
          date: String(x.date ?? ''),
        }));
        if (mapped.length > 0) setReviews(mapped);
      })
      .catch(() => {});
  }, []);

  return reviews;
}
