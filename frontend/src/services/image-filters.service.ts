export class ImageFilterService {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
  
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d')!;
    }
  
    async applyFilter(
      image: HTMLImageElement,
      filterType: string,
      intensity: number = 1
    ): Promise<string> {
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      this.ctx.drawImage(image, 0, 0);
  
      const imageData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
  
      switch (filterType) {
        case 'grayscale':
          this.applyGrayscale(imageData.data);
          break;
        case 'sepia':
          this.applySepia(imageData.data);
          break;
        case 'vintage':
          this.applyVintage(imageData.data);
          break;
        case 'vibrant':
          this.applyVibrant(imageData.data, intensity);
          break;
        case 'dramatic':
          this.applyDramatic(imageData.data);
          break;
        case 'cinematic':
          this.applyCinematic(imageData.data);
          break;
        case 'noir':
          this.applyNoir(imageData.data);
          break;
        // ... دیگر فیلترها
      }
  
      this.ctx.putImageData(imageData, 0, 0);
      return this.canvas.toDataURL('image/jpeg', 0.92);
    }
  
    private applyGrayscale(data: Uint8ClampedArray) {
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // Red
        data[i + 1] = avg; // Green
        data[i + 2] = avg; // Blue
      }
    }
  
    private applySepia(data: Uint8ClampedArray) {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
  
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
      }
    }
  
    private applyVintage(data: Uint8ClampedArray) {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
  
        data[i] = r * 1.3 + 20;
        data[i + 1] = g * 1.1 + 10;
        data[i + 2] = b * 0.9;
      }
    }
  
    private applyVibrant(data: Uint8ClampedArray, intensity: number) {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * (1 + 0.2 * intensity));
        data[i + 1] = Math.min(255, data[i + 1] * (1 + 0.2 * intensity));
        data[i + 2] = Math.min(255, data[i + 2] * (1 + 0.2 * intensity));
      }
    }
  
    private applyDramatic(data: Uint8ClampedArray) {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
  
        data[i] = Math.min(255, r * 1.5);
        data[i + 1] = g * 0.9;
        data[i + 2] = b * 0.8;
      }
    }
  
    private applyCinematic(data: Uint8ClampedArray) {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
  
        // Boost shadows
        const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        const factor = 1 + (0.5 - luminance) * 0.5;
  
        data[i] = Math.min(255, r * factor);
        data[i + 1] = Math.min(255, g * factor);
        data[i + 2] = Math.min(255, b * factor);
      }
    }
  
    private applyNoir(data: Uint8ClampedArray) {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
  
        const v = 0.299 * r + 0.587 * g + 0.114 * b;
        const contrast = 1.5; // Increase contrast
  
        data[i] = data[i + 1] = data[i + 2] = 
          Math.min(255, Math.max(0, (v - 128) * contrast + 128));
      }
    }
  }