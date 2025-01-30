import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { logger } from '../utils/logger';

export class ImageService {
  private s3Client: S3Client;
  private bucket: string;
  private cdnDomain: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    });
    this.bucket = process.env.S3_BUCKET || '';
    this.cdnDomain = process.env.CDN_DOMAIN || '';
  }

  async optimizeAndUpload(
    buffer: Buffer,
    filename: string,
    width?: number
  ): Promise<string> {
    try {
      let imageBuffer = sharp(buffer);

      // Resize if width is specified
      if (width) {
        imageBuffer = imageBuffer.resize(width, null, {
          withoutEnlargement: true
        });
      }

      // Convert to WebP format
      const optimized = await imageBuffer
        .webp({ quality: 80 })
        .toBuffer();

      // Upload to S3
      const key = `images/${filename}.webp`;
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: optimized,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000'
        })
      );

      return `https://${this.cdnDomain}/${key}`;
    } catch (error) {
      logger.error('Image optimization failed:', error);
      throw error;
    }
  }

  async generateResponsiveImages(
    buffer: Buffer,
    filename: string
  ): Promise<string[]> {
    const sizes = [640, 750, 828, 1080, 1200];
    const urls: string[] = [];

    for (const size of sizes) {
      const url = await this.optimizeAndUpload(buffer, `${filename}-${size}`, size);
      urls.push(url);
    }

    return urls;
  }
}