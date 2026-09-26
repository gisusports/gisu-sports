/**
 * Client-Side Passport Image Compression Utility
 * Prevents massive Base64 payloads from bloating database rows and exhausting Supabase 5GB egress.
 * Reduces 3MB-5MB photos down to ~15KB-30KB with zero noticeable quality loss on digital ID cards.
 */

export interface CompressionResult {
  compressedDataUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  reductionPercentage: number;
}

/**
 * Compresses an uploaded image file or base64 string to a lightweight, crisp passport thumbnail
 * @param input File object or data URL string
 * @param maxDimension Maximum width/height in pixels (default 400 for high-DPI retina display)
 * @param quality JPEG compression quality between 0.0 and 1.0 (default 0.82)
 */
export async function compressPassportImage(
  input: File | string,
  maxDimension = 400,
  quality = 0.82
): Promise<CompressionResult> {
  return new Promise((resolve) => {
    // If not in browser environment, return fallback
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      const fallbackStr = typeof input === 'string' ? input : '';
      resolve({
        compressedDataUrl: fallbackStr,
        originalSizeBytes: fallbackStr.length,
        compressedSizeBytes: fallbackStr.length,
        reductionPercentage: 0,
      });
      return;
    }

    const processDataUrl = (dataUrl: string, originalSize: number) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate scaling while preserving aspect ratio
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          // Render onto off-screen canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({
              compressedDataUrl: dataUrl,
              originalSizeBytes: originalSize,
              compressedSizeBytes: originalSize,
              reductionPercentage: 0,
            });
            return;
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Fill white background in case of transparent PNGs
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          // Draw resized image
          ctx.drawImage(img, 0, 0, width, height);

          // Export as compressed JPEG
          const compressed = canvas.toDataURL('image/jpeg', quality);
          const compressedSize = Math.round((compressed.length * 3) / 4);
          const reduction = originalSize > 0 
            ? Math.round(((originalSize - compressedSize) / originalSize) * 100) 
            : 0;

          resolve({
            compressedDataUrl: compressed,
            originalSizeBytes: originalSize,
            compressedSizeBytes: compressedSize,
            reductionPercentage: Math.max(0, reduction),
          });
        } catch {
          // Graceful fallback
          resolve({
            compressedDataUrl: dataUrl,
            originalSizeBytes: originalSize,
            compressedSizeBytes: originalSize,
            reductionPercentage: 0,
          });
        }
      };

      img.onerror = () => {
        resolve({
          compressedDataUrl: dataUrl,
          originalSizeBytes: originalSize,
          compressedSizeBytes: originalSize,
          reductionPercentage: 0,
        });
      };

      img.src = dataUrl;
    };

    if (typeof input === 'string') {
      const estimatedSize = Math.round((input.length * 3) / 4);
      processDataUrl(input, estimatedSize);
    } else {
      const originalSize = input.size;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          processDataUrl(result, originalSize);
        } else {
          resolve({
            compressedDataUrl: '',
            originalSizeBytes: originalSize,
            compressedSizeBytes: 0,
            reductionPercentage: 0,
          });
        }
      };
      reader.onerror = () => {
        resolve({
          compressedDataUrl: '',
          originalSizeBytes: originalSize,
          compressedSizeBytes: 0,
          reductionPercentage: 0,
        });
      };
      reader.readAsDataURL(input);
    }
  });
}
