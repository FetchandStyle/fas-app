const MAX_DIMENSION = 1280;
const MAX_BYTES = 3 * 1024 * 1024;
const JPEG_QUALITY = 0.82;

export function searchImageErrorMessage(err: unknown): string {
  if (err instanceof DOMException && err.name === 'QuotaExceededError') {
    return 'Image is too large to store. Try a smaller photo or crop before uploading.';
  }
  if (err instanceof Error && err.message.includes('too large')) {
    return err.message;
  }
  return 'Could not process image. Please try a smaller file.';
}

/**
 * Resize and re-encode an image in the browser so it fits sessionStorage
 * and stays reliable for demo image search.
 */
export async function compressImageForSearch(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image file.');
  }

  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process image.');

  ctx.drawImage(img, 0, 0, width, height);

  let quality = JPEG_QUALITY;
  let result = canvas.toDataURL('image/jpeg', quality);

  while (estimateDataUrlBytes(result) > MAX_BYTES && quality > 0.45) {
    quality -= 0.08;
    result = canvas.toDataURL('image/jpeg', quality);
  }

  if (estimateDataUrlBytes(result) > MAX_BYTES) {
    throw new Error('Image is too large even after compression. Please use a photo under 10 MB.');
  }

  return result;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image.'));
    img.src = src;
  });
}

function estimateDataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Math.ceil((base64.length * 3) / 4);
}
