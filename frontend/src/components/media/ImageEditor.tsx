
// frontend/src/components/media/ImageEditor.tsx
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import Cropper from 'react-easy-crop';
import { Slider } from '@/components/ui/Slider';

interface ImageEditorProps {
  image: string;
  onSave: (editedImage: File) => void;
  onCancel: () => void;
}

export const ImageEditor = ({
  image,
  onSave,
  onCancel
}: ImageEditorProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
    rotation = 0
  ): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Set canvas size to match the desired crop size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw rotated image
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw the image at the correct position
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Convert canvas to blob
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        if (blob) {
          resolve(new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' }));
        }
      }, 'image/jpeg');
    });
  };

  const handleSave = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(
          image,
          croppedAreaPixels,
          rotation
        );
        onSave(croppedImage);
      }
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative h-96">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={16 / 9}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            بزرگنمایی
          </label>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(value: number) => setZoom(value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            چرخش
          </label>
          <Slider
            min={0}
            max={360}
            step={1}
            value={rotation}
            onChange={(value: number) => setRotation(value)}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onCancel}>
            انصراف
          </Button>
          <Button onClick={handleSave}>
            ذخیره تغییرات
          </Button>
        </div>
      </div>
    </div>
  );
};

