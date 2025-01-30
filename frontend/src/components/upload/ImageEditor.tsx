import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Slider, Button } from '@mui/material';
import { FiRotateCw, FiCrop, FiMaximize, FiSave } from 'react-icons/fi';

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedImage: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  imageUrl,
  onSave,
  onCancel,
  aspectRatio
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

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
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Calculate bounding box of the rotated image
    const rotRad = (rotation * Math.PI) / 180;
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    // Set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // Translate canvas context to center of canvas
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.translate(-image.width / 2, -image.height / 2);

    // Draw rotated image
    ctx.drawImage(image, 0, 0);

    // Extract the cropped image
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');

    if (!croppedCtx) {
      throw new Error('No 2d context');
    }

    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;

    croppedCtx.drawImage(
      canvas,
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
    return new Promise((resolve) => {
      croppedCanvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.95);
    });
  };

  const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = (rotation * Math.PI) / 180;
    return {
      width:
        Math.abs(Math.cos(rotRad) * width) +
        Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) +
        Math.abs(Math.cos(rotRad) * height),
    };
  };

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        rotation
      );
      onSave(croppedImage);
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl mx-4">
        <div className="relative h-96 mb-4">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="space-y-4">
          {/* Zoom Control */}
          <div className="flex items-center space-x-4">
            <FiMaximize className="w-6 h-6" />
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(_, value) => setZoom(value as number)}
            />
          </div>

          {/* Rotation Control */}
          <div className="flex items-center space-x-4">
            <FiRotateCw className="w-6 h-6" />
            <Slider
              value={rotation}
              min={0}
              max={360}
              step={1}
              onChange={(_, value) => setRotation(value as number)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isProcessing}
              startIcon={<FiSave />}
            >
              {isProcessing ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
// در ImageEditor.tsx

// اضافه کردن state برای فیلتر
const [currentFilter, setCurrentFilter] = useState<string>('original');
const [filteredImage, setFilteredImage] = useState<string>(imageUrl);

// اضافه کردن handler برای تغییر فیلتر
const handleFilterApply = (filteredImageUrl: string) => {
  setFilteredImage(filteredImageUrl);
};

// آپدیت render
return (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
    <div className="bg-white rounded-lg p-4 w-full max-w-4xl mx-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="relative h-96">
            <Cropper
              image={filteredImage}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <ImageFilters
            imageSrc={imageUrl}
            onFilterApply={handleFilterApply}
          />
          
          {/* ... بقیه کنترل‌ها ... */}
        </div>
      </div>
    </div>
  </div>
);
const [layers, setLayers] = useState<Array<{
    id: string;
    type: 'text' | 'sticker';
    props: any;
  }>>([]);
  
  // اضافه کردن handler های مدیریت لایه
  const addTextLayer = () => {
    const newLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      props: {
        text: 'Double click to edit',
        style: {
          color: '#000000',
          fontSize: 24,
          fontFamily: 'Arial'
        }
      }
    };
    setLayers([...layers, newLayer]);
  };
  
  const addStickerLayer = (stickerUrl: string) => {
    const newLayer = {
      id: `sticker-${Date.now()}`,
      type: 'sticker',
      props: {
        stickerUrl
      }
    };
    setLayers([...layers, newLayer]);
  };
  
  const updateLayer = (id: string, props: any) => {
    setLayers(layers.map(layer =>
      layer.id === id ? { ...layer, props: { ...layer.props, ...props } } : layer
    ));
  };
  
  const deleteLayer = (id: string) => {
    setLayers(layers.filter(layer => layer.id !== id));
  };
  
  // در render، اضافه کردن لایه‌ها
  {layers.map((layer, index) => (
    layer.type === 'text' ? (
      <TextLayer
        key={layer.id}
        id={layer.id}
        {...layer.props}
        onUpdate={updateLayer}
        onDelete={deleteLayer}
        zIndex={index + 10}
      />
    ) : (
      <StickerLayer
        key={layer.id}
        id={layer.id}
        {...layer.props}
        onUpdate={updateLayer}
        onDelete={deleteLayer}
        zIndex={index + 10}
      />
    )
  ))}
  
  // اضافه کردن دکمه‌های کنترل
  <div className="absolute bottom-4 left-4">
    <button
      onClick={addTextLayer}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
    >
      Add Text
    </button>
    <button
      onClick={() => {/* Show sticker picker */}}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
    >
      Add Sticker
    </button>
  </div>