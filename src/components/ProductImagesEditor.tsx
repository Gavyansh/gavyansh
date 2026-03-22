import React from 'react';
import ImageUpload from './ImageUpload';
import { Trash2 } from 'lucide-react';

const MAX_IMAGES = 3;

interface ProductImagesEditorProps {
  urls: string[];
  onChange: (urls: string[]) => void;
  /** First image required when true (add product) */
  requireFirst?: boolean;
}

/**
 * Up to 3 product images: edit existing slots or add new uploads until max.
 */
export default function ProductImagesEditor({ urls, onChange, requireFirst }: ProductImagesEditorProps) {
  const safe = urls.filter(Boolean).slice(0, MAX_IMAGES);

  const updateAt = (index: number, url: string) => {
    const next = [...safe];
    next[index] = url;
    onChange(next.filter(Boolean));
  };

  const removeAt = (index: number) => {
    onChange(safe.filter((_, j) => j !== index));
  };

  const append = (url: string) => {
    if (!url || safe.length >= MAX_IMAGES) return;
    onChange([...safe, url]);
  };

  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">
        Product images (up to {MAX_IMAGES})
        {requireFirst && <span className="text-red-500"> *</span>}
      </label>

      {safe.map((url, i) => (
        <div
          key={`slot-${i}-${url.slice(-24)}`}
          className="rounded-xl border border-ghee-gold/15 p-4 bg-ghee-warm/30 space-y-2"
        >
          <div className="flex justify-between items-start gap-2">
            <span className="text-xs font-bold text-ghee-brown/70">Image {i + 1}</span>
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              title="Remove image"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <ImageUpload
            value={url}
            onChange={(newUrl) => updateAt(i, newUrl)}
            label={`Replace image ${i + 1}`}
            hideLabel
          />
        </div>
      ))}

      {safe.length < MAX_IMAGES && (
        <ImageUpload
          key={`add-${safe.length}`}
          value=""
          onChange={(u) => {
            if (!u) return;
            if (safe.length === 0) onChange([u]);
            else append(u);
          }}
          label={
            safe.length === 0
              ? requireFirst
                ? 'Image 1 — upload or paste URL'
                : 'Image 1 — upload or paste URL'
              : `Add image ${safe.length + 1} (optional)`
          }
        />
      )}
    </div>
  );
}
