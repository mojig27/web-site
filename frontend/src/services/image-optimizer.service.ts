import imageCompression from 'browser-image-compression';
import { detect } from 'detect-browser';

interface OptimizationOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  quality?: number;
  preserveExif?: boolean;
}

export class ImageOptimizerService {
  private defaultOptions: OptimizationOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    quality: 0.8,
    preserveExif: true
  };

  private browser = detect();

  async optimizeImage(
    file: File,
    customOptions?: Partial<OptimizationOptions>
  ): Promise<{ 
    optimizedFile: File;
    compressionRate: number;
    originalSize: number;
    optimizedSize: number;
    dimensions: { width: number; height: number };
  }> {
    try {
      const options = this.getOptimizationOptions(file, customOptions);
      const originalSize = file.size;

      // بررسی نیاز به بهینه‌سازی
      if (!this.needsOptimization(file, options)) {
        return {
          optimizedFile: file,
          compressionRate: 1,
          originalSize,
          optimizedSize: originalSize,
          dimensions: await this.getImageDimensions(file)
        };
      }

      // بهینه‌سازی تصویر
      const optimizedFile = await imageCompression(file, options);
      const dimensions = await this.getImageDimensions(optimizedFile);

      return {
        optimizedFile,
        compressionRate: optimizedFile.size / originalSize,
        originalSize,
        optimizedSize: optimizedFile.size,
        dimensions
      };
    } catch (error) {
      console.error('Image optimization failed:', error);
      throw new Error('Failed to optimize image');
    }
  }

  private getOptimizationOptions(
    file: File,
    customOptions?: Partial<OptimizationOptions>
  ): OptimizationOptions {
    const options = { ...this.defaultOptions, ...customOptions };

    // تنظیمات خاص مرورگر
    if (this.browser) {
      switch (this.browser.name) {
        case 'safari':
          options.useWebWorker = false; // Safari مشکلاتی با Web Workers دارد
          break;
        case 'firefox':
          options.quality = Math.min(options.quality!, 0.85); // Firefox کیفیت بهتری نیاز دارد
          break;
      }
    }

    // تنظیم کیفیت بر اساس اندازه فایل
    if (file.size > 5 * 1024 * 1024) { // بیشتر از 5MB
      options.quality = 0.7;
    } else if (file.size > 2 * 1024 * 1024) { // بیشتر از 2MB
      options.quality = 0.8;
    }

    return options;
  }

  private async needsOptimization(
    file: File,
    options: OptimizationOptions
  ): Promise<boolean> {
    if (file.size <= options.maxSizeMB * 1024 * 1024) {
      const dimensions = await this.getImageDimensions(file);
      if (dimensions.width <= options.maxWidthOrHeight && 
          dimensions.height <= options.maxWidthOrHeight) {
        return false;
      }
    }
    return true;
  }

  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  async analyzeImage(file: File): Promise<{
    format: string;
    dimensions: { width: number; height: number };
    aspectRatio: number;
    size: number;
    isHighResolution: boolean;
    recommendedOptimizations: string[];
  }> {
    const dimensions = await this.getImageDimensions(file);
    const format = file.type.split('/')[1];
    const aspectRatio = dimensions.width / dimensions.height;

    const recommendedOptimizations: string[] = [];

    // بررسی رزولوشن بالا
    const isHighResolution = dimensions.width > 1920 || dimensions.height > 1080;
    if (isHighResolution) {
      recommendedOptimizations.push('Reduce resolution');
    }

    // بررسی حجم فایل
    if (file.size > 2 * 1024 * 1024) {
      recommendedOptimizations.push('Compress file size');
    }

    // بررسی فرمت
    if (!['jpeg', 'webp'].includes(format)) {
      recommendedOptimizations.push('Convert to WebP format');
    }

    return {
      format,
      dimensions,
      aspectRatio,
      size: file.size,
      isHighResolution,
      recommendedOptimizations
    };
  }
}