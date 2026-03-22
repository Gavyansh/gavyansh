import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
const CLOUDINARY_ENABLED = !!(CLOUD_NAME && UPLOAD_PRESET);

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  /** When true, no label row is rendered (parent provides context). */
  hideLabel?: boolean;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Product Image',
  hideLabel = false,
  className = '',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        setError(data.error?.message || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Check your connection.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  if (!CLOUDINARY_ENABLED) {
    return (
      <div className={className}>
        {!hideLabel && (
          <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">
            {label} (URL)
          </label>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or /images/D2.jpeg"
          className="w-full bg-ghee-warm rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-ghee-gold"
        />
        <p className="text-xs text-ghee-brown/50 mt-1">
          Tip: Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET for upload
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {!hideLabel && (
        <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">
          {label}
        </label>
      )}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {value && (
          <div className="w-24 h-24 rounded-xl overflow-hidden border border-ghee-gold/20 shrink-0">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 w-full">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-3 bg-ghee-warm rounded-xl font-medium text-ghee-brown hover:bg-ghee-gold/20 transition-all disabled:opacity-50"
          >
            {uploading ? (
              <>
                <span className="w-4 h-4 border-2 border-ghee-gold/30 border-t-ghee-gold rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} className="text-ghee-gold" />
                {value ? 'Change Image' : 'Upload Image'}
              </>
            )}
          </button>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          {value && (
            <p className="text-xs text-ghee-brown/50 mt-2 truncate max-w-xs" title={value}>
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
