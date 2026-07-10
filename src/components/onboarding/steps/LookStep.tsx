'use client';

import { useRef, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { compressImageForSearch } from '@/lib/imageSearch';
import type { KycData } from '@/lib/demo/kyc';
import type { Product } from '@/types';

interface LookStepProps {
  data: KycData;
  onUpdate: (data: Partial<KycData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function LookStep({ data, onUpdate, onNext, onBack }: LookStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSku, setSelectedSku] = useState<string | null>(data.selectedLook);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    setError(null);
    setIsSearching(true);
    setProducts([]);

    try {
      const preview = await compressImageForSearch(file);
      setImagePreview(preview);

      const blob = await fetch(preview).then((r) => r.blob());
      const formData = new FormData();
      formData.append('image', new File([blob], 'look.jpg', { type: 'image/jpeg' }));
      formData.append('limit', '8');

      const response = await fetch('/api/search', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Search failed');

      const result = await response.json();
      setProducts((result.results ?? []).slice(0, 8));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find matching products.');
      setImagePreview(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleNext = () => {
    if (selectedSku) {
      onUpdate({ selectedLook: selectedSku });
    } else {
      onUpdate({ selectedLook: 'skipped' });
    }
    onNext();
  };

  const clearImage = () => {
    setImagePreview(null);
    setProducts([]);
    setSelectedSku(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#111827]">
          Find your <span className="text-[#DB2777]">look</span>
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Upload a room photo or furniture image to discover similar items.
        </p>
      </div>

      {!imagePreview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleUpload(file);
          }}
          className={`mb-6 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
            isDragging ? 'border-[#DB2777] bg-[#FFF0F5]' : 'border-[#E5E7EB] hover:border-[#658EC2] hover:bg-[#F0F4F8]/50'
          }`}
        >
          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3F4F6]">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={1.5} className="h-8 w-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="font-medium text-[#374151]">
              {isDragging ? 'Drop your image here' : 'Click to upload or drag & drop'}
            </p>
            <p className="mt-1 text-sm text-[#9CA3AF]">JPG, PNG or WebP</p>
          </label>
        </div>
      ) : (
        <div className="mb-6 max-h-[50vh] flex-1 overflow-y-auto">
          <div className="mb-4 flex items-start gap-4 rounded-xl bg-[#F9FAFB] p-4">
            <div className="relative shrink-0">
              <img src={imagePreview} alt="Uploaded" className="h-20 w-20 rounded-lg object-cover shadow" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <p className="font-medium text-[#374151]">Your uploaded image</p>
              <p className="text-sm text-[#6B7280]">
                {isSearching ? 'Searching…' : `${products.length} matching products`}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          {isSearching && (
            <div className="flex justify-center py-8">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F3F4F6] border-t-[#658EC2]" />
            </div>
          )}

          {!isSearching && products.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.sku}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedSku(product.sku);
                    onUpdate({ selectedLook: product.sku });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedSku(product.sku);
                      onUpdate({ selectedLook: product.sku });
                    }
                  }}
                  className={`cursor-pointer rounded-xl transition-all ${
                    selectedSku === product.sku ? 'ring-2 ring-[#DB2777] ring-offset-2' : ''
                  }`}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-auto flex gap-3">
        <PrimaryButton onClick={onBack} variant="outline" className="flex-1">
          ← Back
        </PrimaryButton>
        <PrimaryButton onClick={handleNext} disabled={isSearching} className="flex-[2]">
          {!imagePreview ? 'Skip →' : selectedSku ? 'Continue →' : 'Skip →'}
        </PrimaryButton>
      </div>
    </div>
  );
}
